import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { getMembershipDisplay, fullName, memberNumberLabel } from "@/lib/membership";
import Icon from "@/components/Icon";
import type { Listing } from "@/lib/types";

export default async function DashboardHome() {
  const profile = await requireActiveMember();
  const status = getMembershipDisplay(profile);
  const supabase = await createClient();

  // The member's listing + this month's lead count — the value story.
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle<Listing>();

  let leadsThisMonth = 0;
  if (listing) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listing.id)
      .gte("created_at", monthStart.toISOString());
    leadsThisMonth = count ?? 0;
  }

  const pct =
    status.daysLeft !== null ? Math.max(0, Math.min(100, Math.round((status.daysLeft / 365) * 100))) : 100;

  return (
    <div>
      <div className="welcome">
        <div>
          <h1 className="display" style={{ fontSize: 25 }}>Welcome back, {fullName(profile)}</h1>
          <p style={{ fontSize: 14 }}>
            {listing
              ? listing.approved
                ? `Your listing is live. ${leadsThisMonth} lead${leadsThisMonth === 1 ? "" : "s"} this month.`
                : "Your listing is awaiting review — it goes live shortly."
              : "Set up your directory listing to start receiving leads."}
          </p>
          {profile.billing_source === "comp" && (
            <div className="viaagent">
              <Icon name="badge" />
              <span>Your membership is provided through a <b>partner program</b></span>
            </div>
          )}
        </div>

        <div className="status">
          <span className={`pill ${status.statusClass}`}>{status.label}</span>
          {status.daysLeft !== null && (
            <div className="meter" role="img" aria-label={`${status.daysLeft} membership days remaining`}>
              <i style={{ width: `${pct}%` }} />
            </div>
          )}
          <span className="fineprint mono">
            {status.daysLeft !== null ? `${status.daysLeft} days remaining · ` : ""}
            {memberNumberLabel(profile.member_number)}
          </span>
        </div>
      </div>

      {!listing && (
        <div className="startcard mb-8">
          <span className="startbadge">Start here</span>
          <h2 className="display mt-3" style={{ fontSize: 20 }}>Create your directory listing</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-2)" }}>
            Your listing is how event planners find you — it&apos;s the member benefit
            that pays for the rest. It takes about five minutes.
          </p>
          <Link href="/dashboard/profile" className="btn btn-primary mt-4 w-fit">
            Set up my listing <span className="nudge">→</span>
          </Link>
        </div>
      )}

      <div className="three" style={{ marginTop: 0, marginBottom: 30, gridTemplateColumns: "repeat(2, 1fr)" }}>
        <Link href="/dashboard/leads" className="perk" style={{ textDecoration: "none" }}>
          <div className="perkhead">
            <span className="icbox"><Icon name="user" /></span>
            <div>
              <span className="cat">Leads</span>
              <h4>Your leads inbox</h4>
            </div>
          </div>
          <p>Every &ldquo;request availability&rdquo; from your public listing, in one place.</p>
        </Link>
        <Link href="/dashboard/profile" className="perk" style={{ textDecoration: "none" }}>
          <div className="perkhead">
            <span className="icbox"><Icon name="window" /></span>
            <div>
              <span className="cat">My listing</span>
              <h4>{listing ? "Edit your public listing" : "Create your listing"}</h4>
            </div>
          </div>
          <p>{listing ? "Update services, service area, and contact details." : "Get found by planners, schools, and families."}</p>
        </Link>
        <Link href="/dashboard/perks" className="perk" style={{ textDecoration: "none" }}>
          <div className="perkhead">
            <span className="icbox"><Icon name="tag" /></span>
            <div>
              <span className="cat">Benefits</span>
              <h4>Partner discounts</h4>
            </div>
          </div>
          <p>Rentals, hosting, business tools, animal meds — codes and member links.</p>
        </Link>
        <Link href="/dashboard/articles" className="perk" style={{ textDecoration: "none" }}>
          <div className="perkhead">
            <span className="icbox"><Icon name="doc" /></span>
            <div>
              <span className="cat">Guides</span>
              <h4>Operator playbooks</h4>
            </div>
          </div>
          <p>Venue outreach, pricing, reviews, and printable event-day checklists.</p>
        </Link>
      </div>

      {listing && listing.approved && (
        <p className="fineprint">
          Your public profile:{" "}
          <Link href={`/members/${listing.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>
            pawsassociation.com/members/{listing.slug}
          </Link>
        </p>
      )}
    </div>
  );
}
