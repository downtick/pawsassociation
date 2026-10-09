import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DirectorySearch from "@/components/DirectorySearch";
import ListingCard from "@/components/ListingCard";
import { searchListings, getStatesWithListings } from "@/lib/listings";
import { getCategory, DIRECTORY } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

// /directory/[category] — category landing page. The pseudo-category "all"
// renders the geo tree without a category filter (used by state links on the
// main directory page).

function resolve(categorySlug: string) {
  if (categorySlug === "all") return { slug: undefined, name: "All attractions", blurb: "", singular: "animal attraction" };
  const cat = getCategory(categorySlug);
  return cat ? { slug: cat.slug, name: cat.name, blurb: cat.blurb, singular: cat.singular } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = resolve(category);
  if (!cat) return {};
  return {
    title: `${cat.name} for hire — ${SITE.name} member directory`,
    description: `Find ${cat.name.toLowerCase()} for parties, schools, weddings, fairs, and events. Free to search and contact — requests go straight to the operator.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { category } = await params;
  const { q } = await searchParams;
  const cat = resolve(category);
  if (!cat) notFound();

  const [results, states] = await Promise.all([
    searchListings({ categorySlug: cat.slug, q }),
    getStatesWithListings(cat.slug),
  ]);

  return (
    <>
      <section className="px-6 py-12 text-center" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
        <div className="mx-auto max-w-2xl">
          <nav className="text-xs" style={{ color: "#93C5FD" }} aria-label="Breadcrumb">
            <Link href="/directory" style={{ color: "#DBEAFE" }}>Directory</Link> / {cat.name}
          </nav>
          <h1 className="mt-3 text-3xl text-white">{cat.name}</h1>
          {cat.blurb && <p className="mt-3 text-[15px]" style={{ color: "#DBEAFE" }}>{cat.blurb}</p>}
          <div className="mx-auto mt-6 max-w-xl">
            <DirectorySearch compact defaultCategory={cat.slug ?? ""} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="panel mx-auto max-w-lg text-center">
              <h2 className="text-xl">No {cat.name.toLowerCase()} listed yet</h2>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                Operate one? <Link href="/join" className="font-semibold" style={{ color: "var(--blue)" }}>Join {SITE.name}</Link> and
                be the first {cat.singular} listed in your area.
              </p>
            </div>
          )}

          {states.length > 0 && (
            <div className="mt-12">
              <p className="eyebrow">{cat.name} by state</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {states.map((s) => (
                  <li key={s.abbr}>
                    <Link
                      href={`/directory/${category}/${s.slug}`}
                      className="inline-block rounded-full border px-3.5 py-1.5 text-sm font-medium"
                      style={{ borderColor: "var(--rule)", color: "var(--ink-2)" }}
                    >
                      {s.name} ({s.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-2">
            {DIRECTORY.categories.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link key={c.slug} href={`/directory/${c.slug}`} className="btn btn-ghost">{c.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
