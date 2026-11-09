"use client";
import { useState, FormEvent } from "react";
import { formatPhoneInput } from "@/lib/phone";
import { GUARANTEE_DAYS } from "@/lib/membershipPolicy";
import { track } from "@/lib/track";
import Icon from "./Icon";
import JoinButton from "./JoinButton";

// Two steps on one page: send the claim (so the admin hears about it even if
// the visitor stops here), then join with the same email.
export default function ClaimForm({ listingSlug, businessName }: { listingSlug: string; businessName: string }) {
  const [values, setValues] = useState<Record<string, string>>({ name: "", email: "", phone: "" });
  const [confirm, setConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [leadingOneNotice, setLeadingOneNotice] = useState(false);

  function set(name: string, value: string) {
    setValues((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const e = { ...p }; delete e[name]; return e; });
  }

  function setPhone(raw: string) {
    const { formatted, hadLeadingOne } = formatPhoneInput(raw);
    setLeadingOneNotice(hadLeadingOne);
    set("phone", formatted);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          listingSlug,
          confirm,
          company_website: honeypot,
          referrer: document.referrer,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details) setErrors(data.details);
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      track("generate_lead", { lead_type: "claim_listing" });
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="grid gap-4">
        <div>
          <span className="badge">Step 2 of 2</span>
          <h2 className="display mt-3" style={{ fontSize: 21 }}>Claim received. Now finish joining.</h2>
          <p className="text-sm mt-2" style={{ color: "var(--ink-2)" }}>
            Create your login and join. We&apos;ll confirm by email or phone that {businessName} is
            yours, then move the listing to your account. You won&apos;t need to create a new one.
          </p>
        </div>
        <div>
          <label className="form-label" htmlFor="cl-join-email">Email</label>
          <input id="cl-join-email" type="email" autoComplete="email" className="form-input" value={values.email || ""} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="cl-password">Create a password</label>
          <input id="cl-password" type="password" autoComplete="new-password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <JoinButton email={values.email || ""} password={password} />
        <p className="fineprint">
          If we can&apos;t confirm the business is yours, you can cancel online within {GUARANTEE_DAYS} days for a full refund.
        </p>
      </div>
    );
  }

  const err = (n: string) => errors[n] && <p className="form-error"><Icon name="info" />{errors[n][0]}</p>;
  const eb = (n: string) => (errors[n] ? "var(--danger)" : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)} aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

      <div>
        <span className="badge">Step 1 of 2</span>
        <h2 className="display mt-3" style={{ fontSize: 21 }}>Tell us who you are</h2>
      </div>

      <div>
        <label className="form-label" htmlFor="cl-name">Your name *</label>
        <input id="cl-name" className="form-input" autoComplete="name" maxLength={100} value={values.name || ""}
          onChange={(e) => set("name", e.target.value)} style={{ borderColor: eb("name") }} />
        {err("name")}
      </div>
      <div>
        <label className="form-label" htmlFor="cl-email">Business email *</label>
        <input id="cl-email" type="email" className="form-input" autoComplete="email" value={values.email || ""}
          onChange={(e) => set("email", e.target.value)} style={{ borderColor: eb("email") }} />
        {err("email")}
      </div>
      <div>
        <label className="form-label" htmlFor="cl-phone">Business phone *</label>
        <input id="cl-phone" type="tel" inputMode="tel" className="form-input" autoComplete="tel" placeholder="xxx-xxx-xxxx" maxLength={12}
          value={values.phone || ""} onChange={(e) => setPhone(e.target.value)} style={{ borderColor: eb("phone") }} />
        {leadingOneNotice && <p className="text-xs text-[var(--ink-3)] mt-1">We dropped the leading 1 — just enter the 10-digit number.</p>}
        {err("phone")}
      </div>

      <label className="flex items-start gap-2.5 text-sm" style={{ color: "var(--ink-2)" }}>
        <input type="checkbox" className="mt-1" checked={confirm} onChange={(e) => { setConfirm(e.target.checked); if (errors.confirm) setErrors((p) => { const c = { ...p }; delete c.confirm; return c; }); }} />
        <span>I own {businessName} or am authorized to act for it. *</span>
      </label>
      {err("confirm")}

      {submitError && (
        <div className="p-3.5 rounded-lg text-sm" style={{ background: "var(--danger-wash)", border: "1px solid var(--danger)", color: "var(--danger)" }}>
          <Icon name="info" />{submitError}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary btn-join w-full justify-center" style={{ opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "Sending…" : "Continue"}
      </button>
    </form>
  );
}
