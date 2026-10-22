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
} from "@/lib/admin/actions";
import type { Profile } from "@/lib/types";
import Icon from "@/components/Icon";

export default function AdminMemberActions({ member, emailVerified }: { member: Profile; emailVerified: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState(member.admin_note || "");
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
        <p className="font-semibold mb-3">Grant free days (access only)</p>
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
    </div>
  );
}
