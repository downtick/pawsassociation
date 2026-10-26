import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail, sendMemberAdminNotice } from "@/lib/emails";
import { GUARANTEE_DAYS } from "@/lib/membershipPolicy";

// Stripe webhook — the $149/yr membership subscription lifecycle. Comp
// (admin-granted) memberships never touch Stripe; they live entirely on
// profiles.comp_until.
// Stripe subscription status → our membership_status. "trialing" counts as a
// full member (no trials are sold today, but an admin could add one in
// Stripe); incomplete/unpaid/expired lose access.
function membershipStatusFor(status: Stripe.Subscription.Status): "active" | "past_due" | "lapsed" | "canceled" {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due") return "past_due";
  if (status === "canceled") return "canceled";
  return "lapsed";
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency guard. The event id is claimed up front (the primary key
  // stops a concurrent retry processing it twice) and released again if
  // processing throws, so Stripe's automatic retry gets another chance
  // instead of the update being silently lost.
  const { error: claimError } = await admin.from("stripe_events").insert({ id: event.id, type: event.type });
  if (claimError) {
    if (claimError.code === "23505") return NextResponse.json({ received: true }); // already processed
    console.error("Stripe webhook: could not record event", claimError.message);
    return NextResponse.json({ error: "Could not record event." }, { status: 500 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error(`Stripe webhook: ${event.type} ${event.id} failed`, err);
    await admin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Processing failed; Stripe will retry." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event) {
  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const profileId = session.metadata?.profile_id || (session.client_reference_id ?? undefined);
      if (!profileId) break;

      const subscription = session.subscription
        ? await getStripe().subscriptions.retrieve(session.subscription as string)
        : null;

      const { data: profile } = await admin
        .from("profiles")
        // Never touch role here: an admin who buys a membership (or tests
        // checkout) must stay an admin.
        .update({
          plan: "retail_annual",
          membership_status: subscription ? membershipStatusFor(subscription.status) : "active",
          billing_source: "stripe",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription?.id ?? null,
          current_period_end: subscription
            ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
            : null,
        })
        .eq("id", profileId)
        .select()
        .single();

      await admin.from("member_events").insert({
        member_id: profileId,
        event: "joined",
        detail: {
          stripe_event: event.id,
          plan: "retail_annual",
          guarantee: subscription?.metadata?.guarantee === "1",
        },
      });

      if (profile) {
        await sendWelcomeEmail({
          to: profile.email,
          firstName: profile.first_name || "",
          memberNumber: profile.member_number || "",
          guaranteeUntil: subscription?.metadata?.guarantee === "1"
            ? new Date(Date.now() + GUARANTEE_DAYS * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        }).catch((err) => console.error("Welcome email error:", err));

        await sendMemberAdminNotice({
          event: "retail",
          member: {
            firstName: profile.first_name, lastName: profile.last_name, email: profile.email,
            phone: profile.phone, state: profile.state, memberNumber: profile.member_number,
          },
          expiresAt: profile.current_period_end,
          payment: { amountCents: session.amount_total, reference: subscription?.id ?? session.id },
        }).catch((err) => console.error("Member admin notice error:", err));
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const status = membershipStatusFor(sub.status);
      await admin
        .from("profiles")
        .update({
          membership_status: status,
          current_period_end: new Date(sub.items.data[0].current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const { data: profile } = await admin
        .from("profiles")
        .update({ membership_status: "canceled" })
        .eq("stripe_subscription_id", sub.id)
        .select()
        .single();
      if (profile) {
        await admin.from("member_events").insert({ member_id: profile.id, event: "canceled", detail: { stripe_event: event.id } });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // API 2025-03+ moved the subscription under parent.subscription_details.
      const fromParent = invoice.parent?.subscription_details?.subscription;
      const subId = typeof fromParent === "string" ? fromParent : fromParent?.id;
      if (subId) {
        const { data: profile } = await admin
          .from("profiles")
          .update({ membership_status: "past_due" })
          .eq("stripe_subscription_id", subId)
          .select()
          .single();
        if (profile) {
          await admin.from("member_events").insert({ member_id: profile.id, event: "payment_failed", detail: { stripe_event: event.id } });
        }
      }
      break;
    }

    default:
      break;
  }
}
