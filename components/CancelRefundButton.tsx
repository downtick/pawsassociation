"use client";
import { useState } from "react";
import Icon from "./Icon";

export default function CancelRefundButton({ amount, deadline }: { amount: string; deadline: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    if (!confirm(`Cancel your membership now and refund your ${amount} renewal? Your listing will be hidden right away.`)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/billing/cancel-refund", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please contact us.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm font-semibold" style={{ color: "var(--good)" }}>
        Done. Your membership is cancelled and {amount} is on its way back to your card (usually 5–10 business days). We emailed you a confirmation.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm mb-3" style={{ color: "var(--ink-2)" }}>
        Your membership renewed recently. You can cancel and get the full {amount} back until <strong>{deadline}</strong>.
      </p>
      <button type="button" onClick={go} disabled={busy} className="btn-outline" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
        {busy ? "Processing…" : `Cancel and refund my ${amount} renewal`}
      </button>
      {error && <p className="form-error mt-2"><Icon name="info" />{error}</p>}
    </div>
  );
}
