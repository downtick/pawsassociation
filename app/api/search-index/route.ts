import { NextResponse } from "next/server";
import { ARTICLES } from "@/content/articles";
import { RESOURCES_SEED } from "@/lib/data/resourcesSeed";
import { DOWNLOADS } from "@/content/downloads";

// Simple preloaded search index for the header omni-search — filters
// resources + articles by title, client-side. No search-index service.
// This route is auth-gated implicitly by the header only rendering
// OmniSearch for signed-in users, but the data itself isn't secret (it's
// the same directory shown at /dashboard/perks and /dashboard/articles).
export async function GET() {
  const items = [
    ...ARTICLES.map((a) => ({
      type: "article" as const,
      title: a.title,
      subtitle: a.summary,
      href: a.memberOnly ? `/dashboard/articles/${a.slug}` : `/learn/${a.slug}`,
    })),
    ...DOWNLOADS.map((d) => ({
      type: "article" as const,
      title: d.title,
      subtitle: `Download — ${d.summary}`,
      href: `/downloads/${d.slug}`,
    })),
    ...RESOURCES_SEED.map((r) => ({
      type: "resource" as const,
      title: r.name,
      subtitle: `${r.category} benefit — ${r.description}`,
      href: `/dashboard/perks`,
    })),
  ];

  return NextResponse.json({ items });
}
