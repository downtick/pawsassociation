"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/emails";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pawsassociation.com";

// ============================================================================
// Admin server actions. Every one starts with requireAdmin() (reads the
// caller's session-based role — never trust client input for this) and,
// where it mutates a member, writes a member_events row with actor_id set
// to the acting admin. Follows admin-features.md.
// ============================================================================

export async function setMembershipStatus(memberId: string, status: string, reason?: string) {
  const admin = await requireAdmin();
  const db = createAdminClient();

  await db.from("profiles").update({ membership_status: status }).eq("id", memberId);
  await db.from("member_events").insert({
    member_id: memberId,
    actor_id: admin.id,
    event: "status_set",
    detail: { status, reason },
  });

  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/admin/members");
}

export async function grantFreeDays(memberId: string, days: number, reason?: string) {
  const admin = await requireAdmin();
  const db = createAdminClient();

  const { data: member } = await db.from("profiles").select("comp_until, current_period_end, billing_source").eq("id", memberId).single();
  const now = new Date();
  const base = [member?.comp_until, member?.current_period_end]
    .filter(Boolean)
    .map((d: string) => new Date(d))
    .reduce((max, d) => (d > max ? d : max), now);

  const newCompUntil = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

  await db
    .from("profiles")
    .update({
      comp_until: newCompUntil.toISOString(),
      billing_source: member?.billing_source === "stripe" ? "stripe" : "comp",
    })
    .eq("id", memberId);

  await db.from("member_events").insert({
    member_id: memberId,
    actor_id: admin.id,
    event: "free_days_granted",
    detail: { days, reason, new_comp_until: newCompUntil.toISOString() },
  });

  revalidatePath(`/admin/members/${memberId}`);
}

export async function setAdminNote(memberId: string, note: string) {
  const admin = await requireAdmin();
  const db = createAdminClient();
  await db.from("profiles").update({ admin_note: note }).eq("id", memberId);
  await db.from("member_events").insert({ member_id: memberId, actor_id: admin.id, event: "status_set", detail: { admin_note: true } });
  revalidatePath(`/admin/members/${memberId}`);
}

export async function toggleAdminRole(memberId: string, makeAdmin: boolean) {
  const admin = await requireAdmin();
  const db = createAdminClient();

  if (!makeAdmin) {
    const { count } = await db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) {
      throw new Error("Cannot remove the last remaining admin.");
    }
  }

  await db.from("profiles").update({ role: makeAdmin ? "admin" : "member" }).eq("id", memberId);
  await db.from("member_events").insert({
    member_id: memberId,
    actor_id: admin.id,
    event: makeAdmin ? "admin_granted" : "admin_revoked",
  });

  revalidatePath(`/admin/members/${memberId}`);
}

export async function cancelMembership(memberId: string) {
  const admin = await requireAdmin();
  const db = createAdminClient();
  await db.from("profiles").update({ membership_status: "canceled", comp_until: null }).eq("id", memberId);
  await db.from("member_events").insert({ member_id: memberId, actor_id: admin.id, event: "canceled", detail: { by: "admin" } });
  revalidatePath(`/admin/members/${memberId}`);
}

export interface CreateMemberInput {
  email: string;
  firstName: string;
  lastName: string;
  state?: string;
  compDays: number; // 0 = no access yet
  sendWelcome: boolean;
  passwordMode: "temp" | "link";
}

function randomTempPassword(): string {
  return Math.random().toString(36).slice(-6) + Math.random().toString(36).toUpperCase().slice(-4) + "!1";
}

// Hand-create a member without them going through /join or paying — the
// comp/partner-provided membership path.
export async function createMemberByAdmin(input: CreateMemberInput) {
  const admin = await requireAdmin();
  const db = createAdminClient();

  const tempPassword = input.passwordMode === "temp" ? randomTempPassword() : undefined;

  const { data: created, error } = await db.auth.admin.createUser({
    email: input.email,
    password: tempPassword,
    email_confirm: true,
  });
  if (error || !created.user) {
    throw new Error(error?.message || "Failed to create auth user.");
  }

  const compUntil = input.compDays > 0 ? new Date(Date.now() + input.compDays * 24 * 60 * 60 * 1000).toISOString() : null;

  const { data: member } = await db
    .from("profiles")
    .update({
      role: "member",
      first_name: input.firstName,
      last_name: input.lastName,
      state: input.state || null,
      plan: "comp",
      membership_status: compUntil ? "active" : "pending",
      billing_source: "comp",
      comp_until: compUntil,
    })
    .eq("id", created.user.id)
    .select()
    .single();

  await db.from("member_events").insert({
    member_id: created.user.id,
    actor_id: admin.id,
    event: "member_created_by_admin",
    detail: {
      compDays: input.compDays,
      passwordMode: input.passwordMode,
    },
  });

  let setPasswordLink: string | undefined;
  if (input.passwordMode === "link") {
    setPasswordLink = await setPasswordUrl(input.email);
  }

  if (input.sendWelcome && member) {
    await sendWelcomeEmail({
      to: member.email,
      firstName: member.first_name || "",
      memberNumber: member.member_number || "",
      tempPassword,
      setPasswordLink,
    }).catch((err) => console.error("Admin-created welcome email error:", err));

    await db.from("member_events").insert({ member_id: created.user.id, actor_id: admin.id, event: "welcome_email_sent" });
  }

  revalidatePath("/admin/members");
  return { id: created.user.id, memberNumber: member?.member_number };
}

// A recovery link that opens /auth/confirm (button-protected from mail
// scanners) and then /reset-password. Never use generateLink's action_link
// in an email: it is one-click and a scanner spends it before the member
// sees it.
async function setPasswordUrl(email: string): Promise<string | undefined> {
  const { data } = await createAdminClient().auth.admin.generateLink({ type: "recovery", email });
  const hash = data?.properties?.hashed_token;
  return hash ? `${SITE_URL}/auth/confirm?token_hash=${hash}&type=recovery&kind=recovery` : undefined;
}

// ── Account emails & verification (admin member page) ───────────────────────

async function memberEmail(memberId: string) {
  const { data } = await createAdminClient()
    .from("profiles")
    .select("email, first_name, member_number")
    .eq("id", memberId)
    .single();
  if (!data?.email) throw new Error("Member not found.");
  return data;
}

// Re-sends the "Confirm your PAWS account" email (Supabase template, so it
// goes through the same SMTP2GO setup as the original).
export async function resendVerificationEmail(memberId: string) {
  const admin = await requireAdmin();
  const member = await memberEmail(memberId);
  const db = createAdminClient();
  const { error } = await db.auth.resend({ type: "signup", email: member.email });
  if (error) throw new Error(error.message);
  await db.from("member_events").insert({ member_id: memberId, actor_id: admin.id, event: "verification_resent" });
  revalidatePath(`/admin/members/${memberId}`);
}

// For when the email never arrives (quarantine, typo'd spam filter) and the
// admin has confirmed the person's identity another way.
export async function markEmailVerified(memberId: string) {
  const admin = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.auth.admin.updateUserById(memberId, { email_confirm: true });
  if (error) throw new Error(error.message);
  await db.from("member_events").insert({ member_id: memberId, actor_id: admin.id, event: "email_verified_by_admin" });
  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/admin/members");
}

// Sends the "Reset your PAWS password" email (Supabase template).
export async function sendPasswordResetEmail(memberId: string) {
  const admin = await requireAdmin();
  const member = await memberEmail(memberId);
  const db = createAdminClient();
  const { error } = await db.auth.resetPasswordForEmail(member.email, {
    redirectTo: `${SITE_URL}/reset-password`,
  });
  if (error) throw new Error(error.message);
  await db.from("member_events").insert({ member_id: memberId, actor_id: admin.id, event: "password_reset_sent" });
  revalidatePath(`/admin/members/${memberId}`);
}

// Re-sends the PAWS welcome email, with a set-password link so it doubles as
// a "here's how to get in" email.
export async function resendWelcomeEmail(memberId: string) {
  const admin = await requireAdmin();
  const member = await memberEmail(memberId);
  await sendWelcomeEmail({
    to: member.email,
    firstName: member.first_name || "",
    memberNumber: member.member_number || "",
    setPasswordLink: await setPasswordUrl(member.email),
  });
  await createAdminClient()
    .from("member_events")
    .insert({ member_id: memberId, actor_id: admin.id, event: "welcome_email_sent", detail: { resent: true } });
  revalidatePath(`/admin/members/${memberId}`);
}

// ── Listing moderation (the directory review queue) ─────────────────────────

export async function setListingApproved(listingId: string, approved: boolean) {
  const admin = await requireAdmin();
  const db = createAdminClient();

  const { data: listing } = await db
    .from("listings")
    .update({ approved })
    .eq("id", listingId)
    .select("profile_id, business_name")
    .single();

  if (listing?.profile_id) {
    await db.from("member_events").insert({
      member_id: listing.profile_id,
      actor_id: admin.id,
      event: approved ? "profile_approved" : "profile_unapproved",
      detail: { business_name: listing.business_name },
    });
  }

  revalidatePath("/admin/listings");
  revalidatePath("/directory");
}

export async function setListingFeatured(listingId: string, featured: boolean) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("listings").update({ featured }).eq("id", listingId);
  revalidatePath("/admin/listings");
  revalidatePath("/directory");
}

export async function deleteListing(listingId: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("listings").delete().eq("id", listingId);
  revalidatePath("/admin/listings");
  revalidatePath("/directory");
}
