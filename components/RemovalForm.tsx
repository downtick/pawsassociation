"use client";
import { useState, FormEvent } from "react";
import { formatPhoneInput } from "@/lib/phone";
import { RELATIONSHIPS } from "@/lib/removalSchema";
import Icon from "./Icon";

export default function RemovalForm({
  listingSlug = "",
  businessName = "",
  cityState = "",
}: {
  listingSlug?: string;
  businessName?: string;
  cityState?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({ businessName, cityState });
  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  function set(name: string, value: string) {
    setValues((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const e = { ...p }; delete e[name]; return e; });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/removal", {
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
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <span className="icbox" style={{ margin: "0 auto 14px" }}><Icon name="check" /></span>
        <h2 className="text-xl mb-2" style={{ color: "var(--blue)" }}>Request received</h2>
        <p className="text-[var(--ink-2)]">
          We&apos;ll review it and reply by email, usually within 5 business days. If we need to
          confirm you&apos;re connected to the business, we&apos;ll ask before removing anything.
        </p>
      </div>
    );
  }

  const err = (n: string) => errors[n] && <p className="form-error"><Icon name="info" />{errors[n][0]}</p>;
  const eb = (n: string) => (errors[n] ? "var(--danger)" : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)} aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <label className="form-label" htmlFor="r-biz">Business name *</label>
          <input id="r-biz" className="form-input" maxLength={120} value={values.businessName || ""}
            onChange={(e) => set("businessName", e.target.value)} style={{ borderColor: eb("businessName") }} />
          {err("businessName")}
        </div>
        <div>
          <label className="form-label" htmlFor="r-city">City and state</label>
          <input id="r-city" className="form-input" maxLength={120} placeholder="e.g. Henderson, NV" value={values.cityState || ""}
            onChange={(e) => set("cityState", e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="r-name">Your name *</label>
          <input id="r-name" className="form-input" autoComplete="name" maxLength={100} value={values.requesterName || ""}
            onChange={(e) => set("requesterName", e.target.value)} style={{ borderColor: eb("requesterName") }} />
          {err("requesterName")}
        </div>
        <div>
          <label className="form-label" htmlFor="r-email">Your email *</label>
          <input id="r-email" type="email" className="form-input" autoComplete="email" value={values.email || ""}
            onChange={(e) => set("email", e.target.value)} style={{ borderColor: eb("email") }} />
          {err("email")}
        </div>
        <div>
          <label className="form-label" htmlFor="r-phone">Phone</label>
          <input id="r-phone" type="tel" inputMode="tel" className="form-input" autoComplete="tel" placeholder="xxx-xxx-xxxx" maxLength={12}
            value={values.phone || ""} onChange={(e) => set("phone", formatPhoneInput(e.target.value).formatted)} />
          {err("phone")}
        </div>
        <div>
          <label className="form-label" htmlFor="r-rel">Your connection to the business *</label>
          <select id="r-rel" className="form-input" value={values.relationship || ""}
            onChange={(e) => set("relationship", e.target.value)} style={{ borderColor: eb("relationship") }}>
            <option value="">Choose one</option>
            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {err("relationship")}
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="r-reason">Anything we should know? <span className="font-normal" style={{ color: "var(--ink-3)" }}>(optional)</span></label>
        <textarea id="r-reason" className="form-input" rows={4} maxLength={1000} style={{ resize: "vertical" }}
          placeholder="For example: we've closed, or we'd rather not be listed."
          value={values.reason || ""} onChange={(e) => set("reason", e.target.value)} />
      </div>

      <label className="flex items-start gap-2.5 mb-5 text-sm" style={{ color: "var(--ink-2)" }}>
        <input type="checkbox" className="mt-1" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
        <span>I own this business or am authorized to act for it, and I&apos;m asking for its listing to be removed. *</span>
      </label>
      {err("confirm")}

      {submitError && (
        <div className="mb-5 p-3.5 rounded-lg text-sm" style={{ background: "var(--danger-wash)", border: "1px solid var(--danger)", color: "var(--danger)" }}>
          <Icon name="info" />{submitError}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center" style={{ opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "Sending…" : "Send removal request"}
      </button>
    </form>
  );
}
