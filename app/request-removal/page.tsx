import type { Metadata } from "next";
import Link from "next/link";
import RemovalForm from "@/components/RemovalForm";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/access";

export const metadata: Metadata = {
  title: "Request Listing Removal",
  description: "Ask PAWS to remove a business from the animal-attraction directory.",
  robots: { index: false },
};

// Linked from every unclaimed listing (?listing=<slug>) plus Terms, Privacy
// and the footer. The slug only pre-fills the form; the API re-checks it.
export default async function RequestRemovalPage({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing } = await searchParams;
  const slug = listing && /^[a-z0-9-]{1,80}$/.test(listing) ? listing : "";

  let businessName = "";
  let cityState = "";
  if (slug && isAuthConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.from("public_listings").select("business_name, city, state").eq("slug", slug).maybeSingle();
    if (data) {
      businessName = data.business_name;
      cityState = [data.city, data.state].filter(Boolean).join(", ");
    }
  }

  return (
    <section className="section flex-1">
      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl mb-3">Request listing removal</h1>
        <p className="text-[var(--ink-2)] mb-3">
          Some businesses appear in the PAWS directory because we added them from public
          business information. If one of them is yours and you&apos;d rather not be listed,
          send this form and we&apos;ll remove it.
        </p>
        <p className="text-sm text-[var(--ink-3)] mb-8">
          Want to keep the listing instead? You can{" "}
          <Link href="/get-listed" style={{ color: "var(--blue)" }}>claim it</Link> to control what
          it shows. Members can delete their own listing from their dashboard.
        </p>
        <div className="card p-8">
          <RemovalForm listingSlug={slug} businessName={businessName} cityState={cityState} />
        </div>
      </div>
    </section>
  );
}
