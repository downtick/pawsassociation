import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import type { Lead, Listing } from "@/lib/types";

export const metadata: Metadata = { title: "Leads", robots: { index: false } };
export const dynamic = "force-dynamic";

// The leads inbox — the retention core. Every "request availability" from
// the member's public listing, newest first. RLS limits reads to their own.
export default async function LeadsPage() {
  const profile = await requireActiveMember();
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("id, business_name, approved, slug")
    .eq("profile_id", profile.id)
    .maybeSingle<Pick<Listing, "id" | "business_name" | "approved" | "slug">>();

  const leads: Lead[] = listing
    ? ((await supabase
        .from("leads")
        .select("*")
        .eq("listing_id", listing.id)
        .order("created_at", { ascending: false })
        .limit(100)).data as Lead[] ?? [])
    : [];

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <h1 className="display mb-1" style={{ fontSize: 24 }}>Leads</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--ink-3)" }}>
        Inquiries from your public listing. Each one was also emailed to you the
        moment it arrived — fast replies win bookings.
      </p>

      {!listing ? (
        <div className="note">
          <span>
            You don&apos;t have a listing yet —{" "}
            <Link href="/dashboard/profile" className="font-semibold" style={{ color: "var(--blue)" }}>
              create yours
            </Link>{" "}
            to start receiving leads.
          </span>
        </div>
      ) : leads.length === 0 ? (
        <div className="note">
          <span>
            No leads yet. {listing.approved
              ? "Your listing is live — leads will appear here as planners find you."
              : "Your listing is awaiting review; leads start once it's live."}{" "}
            The member guides cover how to drive more traffic to your profile.
          </span>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold" style={{ color: "var(--ink)" }}>{lead.name}</p>
                <p className="text-xs" style={{ color: "var(--ink-3)" }}>{fmt(lead.created_at)}</p>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-2)" }}>
                <a href={`mailto:${lead.email}`} className="font-semibold" style={{ color: "var(--blue)" }}>{lead.email}</a>
                {lead.phone && <> · {lead.phone}</>}
                {lead.event_date && <> · Event: {new Date(`${lead.event_date}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>}
              </p>
              {lead.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg p-3 text-sm" style={{ background: "var(--ground-3)", color: "var(--ink-2)" }}>
                  {lead.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
