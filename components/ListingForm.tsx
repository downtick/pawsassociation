"use client";
import { useState, FormEvent } from "react";
import { saveMyListing } from "@/lib/listing-actions";
import { formatPhoneInput, formatZipInput } from "@/lib/phone";
import { STATES } from "@/lib/schemas";
import { DIRECTORY } from "@/lib/directory";
import Icon from "./Icon";
import type { Listing } from "@/lib/types";

// The member's listing editor. Service tags render as chips (check-all-that-
// apply convention); phone/ZIP auto-format per websites/CLAUDE.md.
export default function ListingForm({ listing, categorySlug }: { listing: Listing | null; categorySlug: string | null }) {
  const [values, setValues] = useState<Record<string, string>>({
    businessName: listing?.business_name ?? "",
    contactName: listing?.contact_name ?? "",
    categorySlug: categorySlug ?? "",
    bio: listing?.bio ?? "",
    city: listing?.city ?? "",
    state: listing?.state ?? "",
    zip: listing?.zip ?? "",
    serviceArea: listing?.service_area ?? "",
    phone: listing?.phone ?? "",
    website: listing?.website ?? "",
  });
  const [services, setServices] = useState<string[]>(listing?.services ?? []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [leadingOneNotice, setLeadingOneNotice] = useState(false);

  function set(name: string, value: string) {
    setValues((p) => ({ ...p, [name]: value }));
  }

  function toggleService(tag: string) {
    setServices((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const result = await saveMyListing({
        businessName: values.businessName,
        contactName: values.contactName,
        categorySlug: values.categorySlug,
        bio: values.bio,
        services,
        city: values.city,
        state: values.state,
        zip: values.zip,
        serviceArea: values.serviceArea,
        phone: values.phone,
        website: values.website,
      });
      setMessage(
        result.ok
          ? { kind: "ok", text: listing?.approved
              ? "Saved — your public listing is updated."
              : "Saved. Your listing goes live once our team reviews it (usually within a business day)." }
          : { kind: "err", text: result.error ?? "Could not save. Please try again." }
      );
    } catch {
      setMessage({ kind: "err", text: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <label className="form-label" htmlFor="p-biz">Business name *</label>
          <input id="p-biz" className="form-input" value={values.businessName} onChange={(e) => set("businessName", e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="p-contact">Contact name</label>
          <input id="p-contact" className="form-input" autoComplete="name" value={values.contactName} onChange={(e) => set("contactName", e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="p-cat">Attraction type *</label>
          <select id="p-cat" className="form-input" value={values.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}>
            <option value="">Choose…</option>
            {DIRECTORY.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="p-bio">About your attraction</label>
        <textarea id="p-bio" className="form-input" rows={4} style={{ resize: "vertical" }}
          placeholder="What you bring, which animals, what events you serve…"
          value={values.bio} onChange={(e) => set("bio", e.target.value)} />
      </div>

      <div className="mb-5">
        <p className="form-label">Services (check all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {DIRECTORY.serviceTags.map((tag) => {
            const on = services.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleService(tag)}
                aria-pressed={on}
                className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
                style={on
                  ? { background: "var(--blue-wash)", borderColor: "var(--blue)", color: "var(--blue)" }
                  : { background: "var(--ground-2)", borderColor: "var(--rule)", color: "var(--ink-2)" }}
              >
                {on ? "✓ " : ""}{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <div>
          <label className="form-label" htmlFor="p-city">City *</label>
          <input id="p-city" className="form-input" autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="p-state">State *</label>
          <select id="p-state" className="form-input" value={values.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">—</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="p-zip">ZIP *</label>
          <input id="p-zip" className="form-input" inputMode="numeric" maxLength={5} autoComplete="postal-code"
            value={values.zip} onChange={(e) => set("zip", formatZipInput(e.target.value))} />
        </div>
      </div>

      <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <label className="form-label" htmlFor="p-area">Service area</label>
          <input id="p-area" className="form-input" placeholder="e.g. Greater Phoenix, up to 60 miles"
            value={values.serviceArea} onChange={(e) => set("serviceArea", e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="p-phone">Public phone</label>
          <input id="p-phone" type="tel" inputMode="tel" className="form-input" placeholder="xxx-xxx-xxxx" maxLength={12}
            value={values.phone}
            onChange={(e) => {
              const { formatted, hadLeadingOne } = formatPhoneInput(e.target.value);
              setLeadingOneNotice(hadLeadingOne);
              set("phone", formatted);
            }} />
          {leadingOneNotice && <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>We dropped the leading 1 — just enter the 10-digit number.</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="p-web">Website</label>
          <input id="p-web" type="url" className="form-input" placeholder="https://…"
            value={values.website} onChange={(e) => set("website", e.target.value)} />
        </div>
      </div>

      {message && (
        <div
          className="mb-5 flex items-start gap-2 rounded-lg p-3.5 text-sm"
          style={message.kind === "ok"
            ? { background: "var(--good-wash)", border: "1px solid #BBF7D0", color: "var(--good)" }
            : { background: "var(--danger-wash)", border: "1px solid var(--danger)", color: "var(--danger)" }}
        >
          <Icon name={message.kind === "ok" ? "check" : "info"} />
          {message.text}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : listing ? "Save changes" : "Create my listing"}
      </button>
    </form>
  );
}
