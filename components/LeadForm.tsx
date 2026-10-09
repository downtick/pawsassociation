"use client";
import { useState, FormEvent } from "react";
import { formatPhoneInput } from "@/lib/phone";
import Icon from "./Icon";
import { track } from "@/lib/track";

// "Request availability" form on public member profiles. Same conventions as
// ContactForm: honeypot, phone auto-format, tracking metadata submitted last.
export default function LeadForm({ listingId, businessName }: { listingId: string; businessName: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
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
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          listingId,
          company_website: honeypot,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details) setErrors(data.details);
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      track("generate_lead", { lead_type: "directory_request", business_name: businessName });
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <span className="icbox" style={{ margin: "0 auto 14px" }}><Icon name="check" /></span>
        <h3 className="mb-2 text-xl" style={{ color: "var(--blue)" }}>Request sent!</h3>
        <p style={{ color: "var(--ink-2)" }}>
          Your message is on its way to {businessName}. They&apos;ll reply to you directly by email.
        </p>
      </div>
    );
  }

  const eb = (n: string) => (errors[n] ? "var(--danger)" : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div>
          <label className="form-label" htmlFor="l-name">Your name *</label>
          <input id="l-name" className="form-input" autoComplete="name" value={values.name || ""} onChange={(e) => set("name", e.target.value)} style={{ borderColor: eb("name") }} />
          {errors.name && <p className="form-error"><Icon name="info" />{errors.name[0]}</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="l-email">Email *</label>
          <input id="l-email" type="email" className="form-input" autoComplete="email" value={values.email || ""} onChange={(e) => set("email", e.target.value)} style={{ borderColor: eb("email") }} />
          {errors.email && <p className="form-error"><Icon name="info" />{errors.email[0]}</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="l-phone">Phone</label>
          <input id="l-phone" type="tel" inputMode="tel" className="form-input" autoComplete="tel" placeholder="xxx-xxx-xxxx" maxLength={12}
            value={values.phone || ""} onChange={(e) => setPhone(e.target.value)} />
          {leadingOneNotice && <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>We dropped the leading 1 — just enter the 10-digit number.</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="l-date">Event date</label>
          <input id="l-date" type="date" className="form-input" value={values.eventDate || ""} onChange={(e) => set("eventDate", e.target.value)} />
        </div>
      </div>

      <div className="mb-5">
        <label className="form-label" htmlFor="l-msg">Tell them about your event *</label>
        <textarea id="l-msg" className="form-input" rows={4} style={{ resize: "vertical", borderColor: eb("message") }}
          placeholder="Type of event, location, expected number of kids/guests…"
          value={values.message || ""} onChange={(e) => set("message", e.target.value)} />
        {errors.message && <p className="form-error"><Icon name="info" />{errors.message[0]}</p>}
      </div>

      {submitError && (
        <div className="mb-5 rounded-lg p-3.5 text-sm" style={{ background: "var(--danger-wash)", border: "1px solid var(--danger)", color: "var(--danger)" }}>
          {submitError}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn btn-primary w-full justify-center" style={{ opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "Sending…" : "Request availability"}
      </button>
      <p className="fineprint mt-3 text-center">
        Free to send. Your message goes straight to the operator — {`we don't`} charge either side.
      </p>
    </form>
  );
}
