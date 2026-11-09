import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClaimForm from "@/components/ClaimForm";
import FoundingOffer from "@/components/FoundingOffer";
import Icon from "@/components/Icon";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/access";

export const metadata: Metadata = {
  title: "Claim your listing",
  description: "Claim your business's listing in the PAWS animal-attraction directory.",
  robots: { index: false },
};

// Linked from every unclaimed listing (?listing=<slug>). The slug only picks
// the listing to show; the API re-checks it.
export default async function ClaimPage({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing: param } = await searchParams;
  const slug = param && /^[a-z0-9-]{1,80}$/.test(param) ? param : "";
  if (!slug || !isAuthConfigured()) redirect("/get-listed");

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("public_listings")
    .select("business_name, city, state, claimed")
    .eq("slug", slug)
    .maybeSingle();
  if (!listing) redirect("/get-listed");

  const location = [listing.city, listing.state].filter(Boolean).join(", ");

  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">Claim your listing</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">{listing.business_name}</h1>
        <p className="lede mt-3">
          {location && <>{location} · </>}
          <Link href={`/members/${slug}`} style={{ color: "var(--blue)" }}>View the listing</Link>
        </p>

        {listing.claimed ? (
          <div className="note mt-8">
            <Icon name="info" />
            <span>
              This listing has already been claimed. If that doesn&apos;t look right,{" "}
              <Link href="/contact" className="font-semibold" style={{ color: "var(--blue)" }}>contact us</Link>.
            </span>
          </div>
        ) : (
          <>
            <FoundingOffer className="mt-8" />

            <div className="mt-8 grid gap-8 lg:grid-cols-2 items-start">
              <div className="panel">
                <ClaimForm listingSlug={slug} businessName={listing.business_name} />
              </div>
              <div className="panel">
                <h2 className="display" style={{ fontSize: 21 }}>What claiming gets you</h2>
                <ul className="ticks">
                  {[
                    "Your phone and website shown on your listing",
                    "Availability requests from planners sent to your inbox",
                    "Control of your description, services, and service area",
                    "Partner discounts, member guides, and the member badge",
                  ].map((t) => (
                    <li key={t}><Icon name="check" />{t}</li>
                  ))}
                </ul>
                <p className="fineprint">
                  Rather not be listed?{" "}
                  <Link href={`/request-removal?listing=${slug}`} rel="nofollow" style={{ color: "var(--blue)" }}>Request removal</Link>.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
