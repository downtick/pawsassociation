"use client";
import Link from "next/link";
import { AUTO_RENEW_CONSENT_TEXT } from "@/lib/membershipPolicy";

// Required before checkout (the API refuses without it). The exact text is
// recorded with the member's timeline when they start checkout.
export default function AutoRenewConsent({ checked, onChange, invalid }: { checked: boolean; onChange: (v: boolean) => void; invalid?: boolean }) {
  return (
    <label
      className="flex items-start gap-2.5 text-sm rounded-lg p-3"
      style={{ color: "var(--ink-2)", border: `1px solid ${invalid ? "var(--danger)" : "var(--rule)"}`, background: "var(--ground-2)", lineHeight: 1.5 }}
    >
      <input type="checkbox" className="mt-1 shrink-0" checked={checked} onChange={(e) => onChange(e.target.checked)} required />
      <span>
        {AUTO_RENEW_CONSENT_TEXT} See the <Link href="/terms" target="_blank" style={{ color: "var(--blue)" }}>Terms</Link>.
      </span>
    </label>
  );
}
