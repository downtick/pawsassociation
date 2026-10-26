"use client";

import { useState } from "react";
import AutoRenewConsent from "./AutoRenewConsent";

// For a SIGNED-IN member without access: starts Stripe Checkout directly.
// (JoinButton is the signed-out path; it creates the account first.)
export default function ResumeCheckoutButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentMissing, setConsentMissing] = useState(false);
  async function go() {
    if (!consent) {
      setConsentMissing(true);
      setError("Please check the box to confirm you understand the automatic renewal.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoRenewConsent: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Unable to start checkout.");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <AutoRenewConsent checked={consent} invalid={consentMissing && !consent} onChange={(v) => { setConsent(v); if (v) { setConsentMissing(false); setError(""); } }} />
      <button type="button" onClick={go} disabled={busy} className="btn btn-primary">
        {busy ? "Redirecting to checkout…" : label}
      </button>
      {error && <p className="form-error" style={{ marginTop: 10 }}>{error}</p>}
    </div>
  );
}
