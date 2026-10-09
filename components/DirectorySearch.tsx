"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { DIRECTORY, FEATURED_CATEGORIES } from "@/lib/directory";

// The hero/directory search control. Submits to /directory with query params
// (server-rendered results — no client search index needed at this scale).
function SearchForm({ compact = false, defaultCategory = "" }: { compact?: boolean; defaultCategory?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(defaultCategory || (params.get("category") ?? ""));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const search = new URLSearchParams();
    if (q.trim()) search.set("q", q.trim());
    const dest = category ? `/directory/${category}` : "/directory";
    router.push(search.size ? `${dest}?${search}` : dest);
  }

  return (
    <form onSubmit={submit} className="w-full" role="search" aria-label="Search the member directory">
      <div
        className="flex w-full overflow-hidden rounded-xl bg-white"
        style={{ border: "1px solid var(--rule)", boxShadow: "var(--shadow-sm)" }}
      >
        <label htmlFor="dir-q" className="sr-only">Search by name, city, or ZIP</label>
        <input
          id="dir-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={compact ? "Search members…" : "Search by business, city, or state…"}
          className="min-w-0 flex-1 px-4 py-3 text-[15px] outline-none"
          style={{ color: "var(--ink)" }}
        />
        <label htmlFor="dir-cat" className="sr-only">Attraction type</label>
        <select
          id="dir-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="hidden sm:block border-l px-3 text-sm outline-none bg-white"
          style={{ borderColor: "var(--rule)", color: "var(--ink-2)" }}
        >
          <option value="">All types</option>
          {DIRECTORY.categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary !rounded-none px-6">Search</button>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {FEATURED_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => router.push(`/directory/${c.slug}`)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.25)" }}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

export default function DirectorySearch(props: { compact?: boolean; defaultCategory?: string }) {
  // useSearchParams requires a Suspense boundary during prerender.
  return (
    <Suspense fallback={null}>
      <SearchForm {...props} />
    </Suspense>
  );
}
