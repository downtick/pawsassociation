import type { Profile } from "./types";

export interface MembershipDisplay {
  label: string;
  detail: string;
  daysLeft: number | null;
  /** Maps onto the `.pill` modifier classes in globals.css. */
  statusClass: "on" | "soon" | "off";
}

// Single place that turns a profile's raw status/plan/dates into the
// dashboard status badge + "days left" indicator, for both membership paths
// (Stripe retail and admin-granted comp).
export function getMembershipDisplay(profile: Profile): MembershipDisplay {
  const now = new Date();
  const expiry = profile.current_period_end
    ? new Date(profile.current_period_end)
    : profile.comp_until
    ? new Date(profile.comp_until)
    : null;

  // Mirrors has_access in the member_access view — keep the two in step.
  const hasAccess = memberHasAccess(profile, now);

  if (!hasAccess) {
    return {
      label: profile.membership_status === "pending" ? "Pending" : "Lapsed",
      detail: "Your membership isn't currently active.",
      daysLeft: null,
      statusClass: profile.membership_status === "pending" ? "soon" : "off",
    };
  }

  const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const fullDate = expiry
    ? expiry.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const renewalNote =
    profile.billing_source === "stripe" ? "renews automatically" : "does not auto-renew";

  return {
    label: `Active${fullDate ? ` through ${fullDate}` : ""}`,
    detail: expiry ? `Membership ${renewalNote} — ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining.` : "Membership is active.",
    daysLeft,
    statusClass: daysLeft !== null && daysLeft <= 30 ? "soon" : "on",
  };
}

export function fullName(profile: Pick<Profile, "first_name" | "last_name">): string {
  return [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "there";
}

// The DB stores member numbers as `PAWS-000482`; the UI renders the digits
// only, e.g. "Member no. 000482".
export function memberNumberDigits(memberNumber: string | null | undefined): string {
  if (!memberNumber) return "—";
  return memberNumber.replace(/^PAWS-/i, "");
}

export function memberNumberLabel(memberNumber: string | null | undefined): string {
  return `Member no. ${memberNumberDigits(memberNumber)}`;
}

// Single source for "does this profile have access right now", matching the
// member_access view's has_access in SQL.
export function memberHasAccess(
  profile: Pick<Profile, "membership_status" | "comp_until">,
  now: Date = new Date()
): boolean {
  const statusOk = profile.membership_status === "active" || profile.membership_status === "past_due";
  const comped = Boolean(profile.comp_until && new Date(profile.comp_until) > now);
  return statusOk || comped;
}
