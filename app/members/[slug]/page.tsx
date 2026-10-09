import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import ListingCard from "@/components/ListingCard";
import { getListingBySlug, searchListings } from "@/lib/listings";
import { stateSlug, STATE_NAMES, getCategory } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

// Public member profile — the indexable lead-gen asset. LocalBusiness +
// BreadcrumbList JSON-LD; lead form is the killer member benefit.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  const place = listing.city ? `${listing.city}, ${listing.state}` : listing.state || "";
  return {
    title: `${listing.business_name}${place ? ` — ${listing.category_name ?? "Animal attraction"} in ${place}` : ""}`,
    description:
      listing.bio ??
      `${listing.business_name} is a ${SITE.name} member${place ? ` serving ${place}` : ""}. Request availability for your event.`,
  };
}

export default async function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const related = listing.state
    ? (await searchListings({ stateAbbr: listing.state, limit: 4 })).filter((l) => l.id !== listing.id).slice(0, 3)
    : [];

  const stateName = listing.state ? STATE_NAMES[listing.state] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: listing.business_name,
        description: listing.bio ?? undefined,
        url: `${SITE.url}/members/${listing.slug}`,
        telephone: listing.phone ?? undefined,
        address: listing.city
          ? { "@type": "PostalAddress", addressLocality: listing.city, addressRegion: listing.state, postalCode: listing.zip ?? undefined, addressCountry: "US" }
          : undefined,
        areaServed: listing.service_area ?? undefined,
        memberOf: { "@type": "Organization", name: SITE.fullName, url: SITE.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Directory", item: `${SITE.url}/directory` },
          ...(listing.category_slug
            ? [{ "@type": "ListItem", position: 2, name: listing.category_name, item: `${SITE.url}/directory/${listing.category_slug}` }]
            : []),
          { "@type": "ListItem", position: listing.category_slug ? 3 : 2, name: listing.business_name, item: `${SITE.url}/members/${listing.slug}` },
        ],
      },
    ],
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <nav className="text-xs" style={{ color: "var(--ink-3)" }} aria-label="Breadcrumb">
          <Link href="/directory" style={{ color: "var(--blue)" }}>Directory</Link>
          {listing.category_slug && (
            <>
              {" / "}
              <Link href={`/directory/${listing.category_slug}`} style={{ color: "var(--blue)" }}>{listing.category_name}</Link>
            </>
          )}
          {" / "}{listing.business_name}
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl">{listing.business_name}</h1>
              <span className="badge"><Icon name="badge" /> {SITE.name} member directory</span>
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--ink-3)" }}>
              {listing.category_name && <>{listing.category_name} · </>}
              {listing.city ? `${listing.city}, ${stateName ?? listing.state}` : stateName ?? ""}
              {listing.service_area && <> · Serves {listing.service_area}</>}
            </p>

            {listing.category_slugs.length > 1 && (
              <div className="mt-5">
                <p className="eyebrow">Attractions offered</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {listing.category_slugs.map((sl) => {
                    const c = getCategory(sl);
                    return c ? (
                      <Link key={sl} href={`/directory/${sl}`} className="rounded-full px-3.5 py-1.5 text-sm font-semibold"
                        style={{ background: "var(--blue-wash)", color: "var(--blue)", border: "1px solid #BFDBFE" }}>
                        {c.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {listing.bio && <p className="lede mt-6 !max-w-none">{listing.bio}</p>}

            {listing.services.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow">Services</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.services.map((s) => (
                    <span key={s} className="rounded-full border px-3.5 py-1.5 text-sm" style={{ borderColor: "var(--rule)", color: "var(--ink-2)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct contact details are a MEMBER benefit: unclaimed listings
                show no phone/website (the claim incentive) — the request form
                still works, so the business accrues leads either way. */}
            {listing.claimed ? (
              <div className="mt-8 flex flex-wrap gap-4 text-sm">
                {listing.website && (
                  <a href={listing.website} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--blue)" }}>
                    <Icon name="window" /> Website
                  </a>
                )}
                {listing.phone && (
                  <a href={`tel:${listing.phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--blue)" }}>
                    <Icon name="phone" /> {listing.phone}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-8 text-sm" style={{ color: "var(--ink-3)" }}>
                Phone and website appear when the operator claims this listing —
                you can still send a request below.
              </p>
            )}

            {!listing.claimed && (
              <div className="note mt-8">
                <Icon name="info" />
                <span>
                  This listing was added by the association and hasn&apos;t been claimed yet.
                  Is this your business? <Link href="/get-listed" className="font-semibold" style={{ color: "var(--blue)" }}>Claim your listing</Link> to
                  show your phone and website, manage the profile, and receive
                  leads by email.
                </span>
              </div>
            )}
          </div>

          <aside className="panel h-fit">
            <h2 className="text-xl">Request availability</h2>
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              Tell {listing.business_name} about your event. Free, no account needed.
            </p>
            <LeadForm listingId={listing.id} businessName={listing.business_name} />
          </aside>
        </div>

        {related.length > 0 && listing.state && (
          <div className="mt-16">
            <p className="eyebrow">More members in {stateName}</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
            <Link href={`/directory/all/${stateSlug(listing.state)}`} className="mt-5 inline-block text-sm font-semibold" style={{ color: "var(--blue)" }}>
              All {stateName} members →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
