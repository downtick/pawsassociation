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
export default function ListingForm({
  listing,
  categorySlug,
  alsoOfferSlugs = [],
}: {
  listing: Listing | null;
  categorySlug: string | null;
  alsoOfferSlugs?: string[];
}) {
  const [values, setValues] = useState<Record<string, string>>({
    businessName: listing?.business_name ?? "",
    contactName: listing?.contact_name ?? "",
    categorySlug: categorySlug ?? "",
    bio: listing?.bio ?? "",
    notes: listing?.notes ?? "",
    city: listing?.city ?? "",
    state: listing?.state ?? "",
    zip: listing?.zip ?? "",
    serviceArea: listing?.service_area ?? "",
    phone: listing?.phone ?? "",
    website: listing?.website ?? "",
  });
  const [services, setServices] = useState<string[]>(listing?.services ?? []);
  // Every attraction type offered (main + extras). The main type must be
  // one of the checked ones.
  const [offered, setOffered] = useState<string[]>(
    [categorySlug, ...alsoOfferSlugs].filter((x): x is string => Boolean(x))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [leadingOneNotice, setLeadingOneNotice] = useState(false);

  function set(name: string, value: string) {
    setValues((p) => ({ ...p, [name]: value }));
  }

  function toggleOffered(slug: string) {
    const next = offered.includes(slug) ? offered.filter((x) => x !== slug) : [...offered, slug];
    setOffered(next);
    // Keep the main type valid: default it to the first checked type.
    setValues((v) => ({
      ...v,
      categorySlug: next.includes(v.categorySlug) ? v.categorySlug : next[0] ?? "",
    }));
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
        alsoOffer: offered.filter((x) => x !== values.categorySlug),
        bio: values.bio,
        notes: values.notes,
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
      </div>

      <fieldset className="mb-5">
        <legend className="form-label">What do you offer? * <span className="font-normal" style={{ color: "var(--ink-3)" }}>(check all that apply)</span></legend>
        <p className="mb-3 text-xs" style={{ color: "var(--ink-3)" }}>
          You&apos;ll appear in the directory under every type you check.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {DIRECTORY.categories.map((c) => {
            const on = offered.includes(c.slug);
            return (
              <label
                key={c.slug}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors"
                style={on
                  ? { background: "var(--blue-wash)", borderColor: "var(--blue)", color: "var(--ink)" }
                  : { background: "var(--ground-2)", borderColor: "var(--rule)", color: "var(--ink-2)" }}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleOffered(c.slug)}
                  style={{ accentColor: "var(--blue)", width: 16, height: 16 }}
                />
                {c.name}
              </label>
            );
          })}
        </div>
        {offered.length > 1 && (
          <div className="mt-4 max-w-sm">
            <label className="form-label" htmlFor="p-cat">Your main attraction type</label>
            <select id="p-cat" className="form-input" value={values.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}>
              {DIRECTORY.categories.filter((c) => offered.includes(c.slug)).map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>Shown first on your profile.</p>
          </div>
        )}
        <p className="mt-3 text-xs" style={{ color: "var(--ink-3)" }}>
          Offer something not listed? Tell us on the{" "}
          <a href="/contact" style={{ color: "var(--blue)" }}>contact page</a> and we&apos;ll consider adding it.
        </p>
      </fieldset>

      <div className="mb-4">
        <label className="form-label" htmlFor="p-bio">About your attraction</label>
        <textarea id="p-bio" className="form-input" rows={4} style={{ resize: "vertical" }}
          placeholder="What you bring, which animals, what events you serve…"
          value={values.bio} onChange={(e) => set("bio", e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="p-notes">
          Additional services &amp; notes <span className="font-normal" style={{ color: "var(--ink-3)" }}>(optional)</span>
        </label>
        <textarea id="p-notes" className="form-input" rows={4} maxLength={1000} style={{ resize: "vertical" }}
          placeholder="Anything else planners should know: add-ons, seasonal offerings, travel range, setup needs, insurance certificates on request…"
          value={values.notes} onChange={(e) => set("notes", e.target.value)} />
        <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>
          Plain text only, no links ({1000 - values.notes.length} characters left). Shown on your public profile.
        </p>
      </div>

      <div className="mb-5">
        <p className="form-label">Events you serve and extras <span className="font-normal" style={{ color: "var(--ink-3)" }}>(check all that apply)</span></p>
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
