"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setMembershipStatus,
  grantFreeDays,
  toggleAdminRole,
  cancelMembership,
  setAdminNote,
  resendVerificationEmail,
  markEmailVerified,
  sendPasswordResetEmail,
  resendWelcomeEmail,
  grantFreeMembership,
  deleteMemberAccount,
} from "@/lib/admin/actions";
import type { Profile } from "@/lib/types";
import Icon from "@/components/Icon";

export default function AdminMemberActions({ member, emailVerified }: { member: Profile; emailVerified: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState(member.admin_note || "");
  const [freeDays, setFreeDays] = useState(365);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function run(fn: () => Promise<unknown>, done?: string) {
    setError("");
    setNotice("");
    startTransition(async () => {
      try {
        await fn();
        if (done) setNotice(done);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {error && <p className="form-error"><Icon name="info" />{error}</p>}
      {notice && <p className="text-sm font-semibold" style={{ color: "var(--good)" }}>{notice}</p>}

      <div className="card p-5">
        <p className="font-semibold mb-1">Account emails</p>
        <p className="text-xs text-[var(--ink-3)] mb-3">Sent to {member.email}. Each send is logged in the timeline.</p>
        <div className="flex flex-wrap gap-2">
          {!emailVerified && (
            <>
              <button
                disabled={pending}
                onClick={() => run(() => resendVerificationEmail(member.id), "Verification email sent.")}
                className="btn-primary !py-2 !px-4 text-sm"
              >
                Resend verification email
              </button>
              <button
                disabled={pending}
                onClick={() => {
                  if (confirm(`Mark ${member.email} as verified without them clicking the email? Only do this if you know the address is theirs.`)) {
                    run(() => markEmailVerified(member.id), "Email marked as verified.");
                  }
                }}
                className="btn-outline !py-2 !px-4 text-sm"
              >
                Mark email verified
              </button>
            </>
          )}
          <button
            disabled={pending}
            onClick={() => run(() => sendPasswordResetEmail(member.id), "Password-reset email sent.")}
            className="btn-outline !py-2 !px-4 text-sm"
          >
            Send password-reset email
          </button>
          <button
            disabled={pending}
            onClick={() => run(() => resendWelcomeEmail(member.id), "Welcome email sent.")}
            className="btn-outline !py-2 !px-4 text-sm"
          >
            Resend welcome email
          </button>
        </div>
      </div>

      <div className="card p-5">
        <p className="font-semibold mb-3">Status</p>
        <div className="flex flex-wrap gap-2">
          {["active", "past_due", "lapsed", "canceled", "pending"].map((s) => (
            <button
              key={s}
              disabled={pending}
              onClick={() => run(() => setMembershipStatus(member.id, s))}
              className="btn-outline !py-1.5 !px-3 !text-xs capitalize"
            >
              Set {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <p className="font-semibold mb-1">Free membership (upgrade)</p>
        <p className="text-xs text-[var(--ink-3)] mb-3">
          Gives this account full member access without paying: listing, course, downloads, perks.
          No card, no charge, nothing in Stripe. Access ends on its own when the free period runs out.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="form-label" htmlFor="freeDays">Length</label>
            <select id="freeDays" className="form-input w-40" value={freeDays} onChange={(e) => setFreeDays(Number(e.target.value))}>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
              <option value={3650}>10 years</option>
            </select>
          </div>
          <button
            disabled={pending}
            onClick={() => run(() => grantFreeMembership(member.id, freeDays), "Free membership granted.")}
            className="btn-primary !py-2 !px-4 text-sm"
          >
            Give free membership
          </button>
        </div>
      </div>

      <div className="card p-5">
        <p className="font-semibold mb-3">Add free days (custom)</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="form-label" htmlFor="days">Days</label>
            <input id="days" type="number" min={1} className="form-input w-28" value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="form-label" htmlFor="reason">Reason</label>
            <input id="reason" className="form-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. goodwill" />
          </div>
          <button disabled={pending} onClick={() => run(() => grantFreeDays(member.id, days, reason))} className="btn-primary !py-2 !px-4 text-sm">
            Grant
          </button>
        </div>
      </div>

      <div className="card p-5">
        <p className="font-semibold mb-3">Admin note (internal only)</p>
        <textarea className="form-input mb-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        <button disabled={pending} onClick={() => run(() => setAdminNote(member.id, note))} className="btn-outline !py-2 !px-4 text-sm">
          Save note
        </button>
      </div>

      <div className="card p-5">
        <p className="font-semibold mb-3">Admin access</p>
        <button
          disabled={pending}
          onClick={() => run(() => toggleAdminRole(member.id, member.role !== "admin"))}
          className="btn-outline !py-2 !px-4 text-sm"
        >
          {member.role === "admin" ? "Revoke admin" : "Grant admin"}
        </button>
      </div>

      <div className="card p-5" style={{ borderColor: "var(--danger)" }}>
        <p className="font-semibold mb-3" style={{ color: "var(--danger)" }}>Cancel membership</p>
        <button disabled={pending} onClick={() => run(() => cancelMembership(member.id))} className="btn-outline !py-2 !px-4 text-sm" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          Cancel membership
        </button>
      </div>

      <div className="card p-5" style={{ borderColor: "var(--danger)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--danger)" }}>Delete user</p>
        <p className="text-xs text-[var(--ink-3)] mb-3">
          Permanently deletes the login, profile, timeline, leads, and their listing. This can&apos;t be undone.
          Members with an active Stripe subscription must be cancelled first. To confirm, type their email.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <input
            className="form-input max-w-xs"
            placeholder={member.email}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            aria-label="Type the member's email to confirm"
          />
          <button
            disabled={pending || confirmEmail.trim().toLowerCase() !== member.email.toLowerCase()}
            onClick={() => {
              if (!confirm(`Permanently delete ${member.email}? This can't be undone.`)) return;
              setError("");
              startTransition(async () => {
                try {
                  await deleteMemberAccount(member.id, confirmEmail);
                  router.push("/admin/members");
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Delete failed.");
                }
              });
            }}
            className="btn-outline !py-2 !px-4 text-sm"
            style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  );
}
