import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import { searchListings, getCitiesWithListings } from "@/lib/listings";
import { getCategory, stateFromSlug } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

// /directory/[category]/[state] — programmatic SEO page. Only linked from
// pages when the state actually has members (thin pages hurt), but the route
// itself still renders a useful empty state if visited directly.

function resolveCategory(slug: string) {
  if (slug === "all") return { slug: undefined, name: "Animal attractions", noun: "attractions" };
  const cat = getCategory(slug);
  return cat ? { slug: cat.slug, name: cat.name, noun: cat.name.toLowerCase() } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; state: string }> }): Promise<Metadata> {
  const { category, state } = await params;
  const cat = resolveCategory(category);
  const st = stateFromSlug(state);
  if (!cat || !st) return {};
  return {
    title: `${cat.name} in ${st.name}`,
    description: `${cat.name} available for events in ${st.name} — ${SITE.name} members who agree to our safety and animal-care standards. Free to search and contact.`,
  };
}

export default async function StatePage({ params }: { params: Promise<{ category: string; state: string }> }) {
  const { category, state } = await params;
  const cat = resolveCategory(category);
  const st = stateFromSlug(state);
  if (!cat || !st) notFound();

  const [results, cities] = await Promise.all([
    searchListings({ categorySlug: cat.slug, stateAbbr: st.abbr }),
    getCitiesWithListings(st.abbr, cat.slug),
  ]);

  return (
    <section className="section">
      <div className="wrap">
        <nav className="text-xs" style={{ color: "var(--ink-3)" }} aria-label="Breadcrumb">
          <Link href="/directory" style={{ color: "var(--blue)" }}>Directory</Link>
          {" / "}
          <Link href={`/directory/${category}`} style={{ color: "var(--blue)" }}>{cat.name}</Link>
          {" / "}{st.name}
        </nav>
        <h1 className="mt-3 text-3xl">{cat.name} in {st.name}</h1>
        <p className="lede mt-3">
          {results.length > 0
            ? `${results.length} ${SITE.name} member${results.length === 1 ? "" : "s"} serving ${st.name}. Every member agrees to our safety and animal-care standards.`
            : `No ${cat.noun} are listed in ${st.name} yet.`}
        </p>

        {cities.length > 1 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/directory/${category}/${state}/${c.slug}`}
                  className="inline-block rounded-full border px-3.5 py-1.5 text-sm font-medium"
                  style={{ borderColor: "var(--rule)", color: "var(--ink-2)" }}
                >
                  {c.city} ({c.count})
                </Link>
              </li>
            ))}
          </ul>
        )}

        {results.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="panel mx-auto mt-8 max-w-lg text-center">
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              Operate in {st.name}? <Link href="/join" className="font-semibold" style={{ color: "var(--blue)" }}>Join {SITE.name}</Link> and
              be the first listed here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
