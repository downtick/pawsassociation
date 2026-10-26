import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { unsubscribeToken } from "@/lib/emailTokens";
import { sendSeriesEmail, sendBillingNotice, type SeriesKey } from "@/lib/seriesEmails";
import { RENEWAL_REMINDER_DAYS } from "@/lib/membershipPolicy";

// Daily (vercel.json cron): the member welcome series plus billing notices.
//
// Welcome series — day N after joining, skipped for members who opted out:
//   1 listing (only if they have no listing yet) · 3 course · 10 benefits
//   21 share · 60 check-in
// Billing notices — always sent (they're about money):
//   trial_ending ~2 days before a free trial converts
//   renewal_reminder ~30 days before each automatic renewal
//
// Every send is recorded in member_events, which is also the dedupe: a step
// already in a member's timeline is never sent again. Each step has a 4-day
// window, so a missed day catches up, but members who joined long before a
// step existed are never sent a stale "welcome" email.
const SERIES: { key: SeriesKey; day: number }[] = [
  { key: "listing", day: 1 },
  { key: "course", day: 3 },
  { key: "benefits", day: 10 },
  { key: "share", day: 21 },
  { key: "checkin", day: 60 },
];
const WINDOW_DAYS = 4;
const DAY = 24 * 60 * 60 * 1000;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pawsassociation.com";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const now = Date.now();

  const { data: members, error } = await db
    .from("profiles")
    .select("id, email, first_name, billing_source, membership_status, comp_until, current_period_end, stripe_subscription_id, email_opt_out, created_at")
    .eq("role", "member");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const active = (members ?? []).filter(
    (m) => ["active", "past_due"].includes(m.membership_status) || (m.comp_until && new Date(m.comp_until).getTime() > now)
  );
  if (active.length === 0) return NextResponse.json({ checked: 0, sent: {} });
  const ids = active.map((m) => m.id);

  const [{ data: events }, { data: listings }] = await Promise.all([
    db.from("member_events").select("member_id, event, detail, created_at").in("member_id", ids),
    db.from("listings").select("id, slug, profile_id").in("profile_id", ids),
  ]);
  const listingIds = (listings ?? []).map((l) => l.id);
  const { data: leads } = listingIds.length
    ? await db.from("leads").select("listing_id").in("listing_id", listingIds)
    : { data: [] as { listing_id: string }[] };

  const eventsBy = new Map<string, { event: string; detail: Record<string, unknown> | null; created_at: string }[]>();
  for (const e of events ?? []) {
    const list = eventsBy.get(e.member_id) ?? [];
    list.push(e);
    eventsBy.set(e.member_id, list);
  }

  const sent: Record<string, number> = {};
  const failures: string[] = [];
  const record = async (memberId: string, event: string, detail: Record<string, unknown> = {}) => {
    await db.from("member_events").insert({ member_id: memberId, event, detail });
    sent[event] = (sent[event] ?? 0) + 1;
  };

  let stripe: ReturnType<typeof getStripe> | null = null;
  const subscription = async (id: string) => {
    stripe ??= getStripe();
    return stripe.subscriptions.retrieve(id);
  };

  for (const m of active) {
    const evs = eventsBy.get(m.id) ?? [];
    const has = (event: string) => evs.some((e) => e.event === event);
    const start = evs.find((e) => e.event === "joined" || e.event === "member_created_by_admin")?.created_at ?? m.created_at;
    const daysIn = Math.floor((now - new Date(start).getTime()) / DAY);
    const listing = (listings ?? []).find((l) => l.profile_id === m.id);

    try {
      // ── Welcome series ──
      if (!m.email_opt_out) {
        for (const step of SERIES) {
          const event = `series_${step.key}`;
          if (has(event) || daysIn < step.day || daysIn >= step.day + WINDOW_DAYS) continue;
          if (step.key === "listing" && listing) continue;
          const res = await sendSeriesEmail(step.key, {
            to: m.email,
            firstName: m.first_name || "",
            unsubscribeUrl: `${SITE_URL}/unsubscribe?u=${m.id}&t=${unsubscribeToken(m.id)}`,
            listingSlug: listing?.slug,
            leadCount: listing ? (leads ?? []).filter((l) => l.listing_id === listing.id).length : undefined,
          });
          if (res.ok) await record(m.id, event, { day: step.day });
          else failures.push(`${event}:${m.id}`);
          break; // at most one tips email per member per day
        }
      }

      if (m.billing_source !== "stripe" || !m.stripe_subscription_id) continue;

      // ── Trial ending (~2 days out) ──
      const trialEndsIso = evs.find((e) => e.event === "joined")?.detail?.trial_ends;
      if (typeof trialEndsIso === "string" && !has("trial_ending_sent")) {
        const msLeft = new Date(trialEndsIso).getTime() - now;
        if (msLeft > 0 && msLeft <= 2.5 * DAY) {
          const sub = await subscription(m.stripe_subscription_id);
          if (sub.status === "trialing" && !sub.cancel_at_period_end && !sub.cancel_at && sub.trial_end) {
            const res = await sendBillingNotice("trial_ending", { to: m.email, firstName: m.first_name || "", date: new Date(sub.trial_end * 1000) });
            if (res.ok) await record(m.id, "trial_ending_sent", { trial_end: trialEndsIso });
            else failures.push(`trial_ending:${m.id}`);
          }
        }
      }

      // ── Renewal reminder (~30 days before; once per renewal date) ──
      if (m.current_period_end) {
        const periodEnd = m.current_period_end as string;
        const daysToRenewal = (new Date(periodEnd).getTime() - now) / DAY;
        const alreadyForThisPeriod = evs.some(
          (e) => e.event === "renewal_reminder_sent" && e.detail?.period_end === periodEnd
        );
        if (daysToRenewal > RENEWAL_REMINDER_DAYS - WINDOW_DAYS && daysToRenewal <= RENEWAL_REMINDER_DAYS + 1 && !alreadyForThisPeriod) {
          const sub = await subscription(m.stripe_subscription_id);
          if (sub.status === "active" && !sub.cancel_at_period_end && !sub.cancel_at) {
            const res = await sendBillingNotice("renewal_reminder", { to: m.email, firstName: m.first_name || "", date: new Date(periodEnd) });
            if (res.ok) await record(m.id, "renewal_reminder_sent", { period_end: periodEnd });
            else failures.push(`renewal_reminder:${m.id}`);
          }
        }
      }
    } catch (err) {
      console.error(`[member-emails] ${m.id} failed:`, err);
      failures.push(`error:${m.id}`);
    }
  }

  if (failures.length) console.error("[member-emails] failures:", failures.join(", "));
  return NextResponse.json({ checked: active.length, sent, failures: failures.length });
}
