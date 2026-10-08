import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import { searchListings } from "@/lib/listings";
import { getCategory, stateFromSlug } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

// /directory/[category]/[state]/[city] — the deepest long-tail SEO page
// ("pony rides in fort worth"). City display name is recovered from the
// matching listings (their city field), not from the slug.

function resolveCategory(slug: string) {
  if (slug === "all") return { slug: undefined, name: "Animal attractions" };
  const cat = getCategory(slug);
  return cat ? { slug: cat.slug, name: cat.name } : null;
}

function titleCaseSlug(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; state: string; city: string }> }): Promise<Metadata> {
  const { category, state, city } = await params;
  const cat = resolveCategory(category);
  const st = stateFromSlug(state);
  if (!cat || !st) return {};
  const cityName = titleCaseSlug(city);
  return {
    title: `${cat.name} in ${cityName}, ${st.abbr}`,
    description: `Hire ${cat.name.toLowerCase()} in ${cityName}, ${st.name} for birthday parties, schools, weddings, and events — from the ${SITE.name} member directory.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ category: string; state: string; city: string }> }) {
  const { category, state, city } = await params;
  const cat = resolveCategory(category);
  const st = stateFromSlug(state);
  if (!cat || !st) notFound();

  const results = await searchListings({ categorySlug: cat.slug, stateAbbr: st.abbr, city });
  const cityName = results[0]?.city ?? titleCaseSlug(city);

  return (
    <section className="section">
      <div className="wrap">
        <nav className="text-xs" style={{ color: "var(--ink-3)" }} aria-label="Breadcrumb">
          <Link href="/directory" style={{ color: "var(--blue)" }}>Directory</Link>
          {" / "}
          <Link href={`/directory/${category}`} style={{ color: "var(--blue)" }}>{cat.name}</Link>
          {" / "}
          <Link href={`/directory/${category}/${state}`} style={{ color: "var(--blue)" }}>{st.name}</Link>
          {" / "}{cityName}
        </nav>
        <h1 className="mt-3 text-3xl">{cat.name} in {cityName}, {st.abbr}</h1>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="panel mx-auto mt-8 max-w-lg text-center">
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              No members listed in {cityName} yet — try the{" "}
              <Link href={`/directory/${category}/${state}`} className="font-semibold" style={{ color: "var(--blue)" }}>
                {st.name} page
              </Link>{" "}
              for nearby operators, since most travel to events.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
