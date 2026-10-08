import type { Metadata } from "next";
import Link from "next/link";
import DirectorySearch from "@/components/DirectorySearch";
import ListingCard from "@/components/ListingCard";
import { searchListings, getStatesWithListings } from "@/lib/listings";
import { DIRECTORY } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Member directory — petting zoos, pony rides, beer burros & mobile farms",
  description:
    "Search the PAWS member directory of animal attractions and amusement operators. Filter by attraction type, state, and city. Free to search and contact.",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [results, states] = await Promise.all([
    searchListings({ q }),
    getStatesWithListings(),
  ]);

  return (
    <>
      <section className="px-6 py-12 text-center" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl text-white">Member directory</h1>
          <p className="mt-3 text-[15px]" style={{ color: "#DBEAFE" }}>
            {SITE.name} member operators and pre-listed businesses invited to
            claim their listing. Free to search — requests go straight to the operator.
          </p>
          <div className="mx-auto mt-6 max-w-xl"><DirectorySearch /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {q && (
            <p className="mb-6 text-sm" style={{ color: "var(--ink-3)" }}>
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
              {" · "}
              <Link href="/directory" className="font-semibold" style={{ color: "var(--blue)" }}>Clear search</Link>
            </p>
          )}
          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="panel mx-auto max-w-lg text-center">
              <h2 className="text-xl">No members found{q ? ` for “${q}”` : " yet"}</h2>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                Try a broader search, or browse by attraction type below. Run an
                attraction yourself? <Link href="/join" className="font-semibold" style={{ color: "var(--blue)" }}>Join the association</Link> and
                be the first listed in your area.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: "var(--ground-2)" }}>
        <div className="wrap grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">By attraction</p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {DIRECTORY.categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/directory/${c.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>{c.name}</Link>
                  <span className="text-sm" style={{ color: "var(--ink-3)" }}> — {c.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">By state</p>
            {states.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {states.map((s) => (
                  <li key={s.abbr}>
                    <Link
                      href={`/directory/all/${s.slug}`}
                      className="inline-block rounded-full border px-3.5 py-1.5 text-sm font-medium"
                      style={{ borderColor: "var(--rule)", color: "var(--ink-2)" }}
                    >
                      {s.name} ({s.count})
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm" style={{ color: "var(--ink-3)" }}>
                State pages appear as members join in each state.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
