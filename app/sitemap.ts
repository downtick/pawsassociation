import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";
import { DIRECTORY } from "@/lib/directory";
import { PUBLIC_ARTICLES } from "@/content/articles";
import { getAllListingSlugs, getStatesWithListings } from "@/lib/listings";

// Dynamic sitemap: static pages + category pages + member profiles + only
// the category/state geo pages that actually have members (thin pages hurt).
const STATIC_ROUTES = [
  "/", "/directory", "/join", "/benefits", "/get-listed", "/learn",
  "/about", "/faq", "/contact", "/terms", "/privacy", "/disclaimer", "/login",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: now,
  }));

  for (const c of DIRECTORY.categories) {
    entries.push({ url: `${SITE.url}/directory/${c.slug}`, lastModified: now });
  }

  for (const a of PUBLIC_ARTICLES) {
    entries.push({ url: `${SITE.url}/learn/${a.slug}`, lastModified: now });
  }

  // Geo pages with ≥1 member, per category and for the "all" pseudo-category.
  for (const c of [...DIRECTORY.categories.map((c) => c.slug), "all"] as string[]) {
    const states = await getStatesWithListings(c === "all" ? undefined : c);
    for (const s of states) {
      entries.push({ url: `${SITE.url}/directory/${c}/${s.slug}`, lastModified: now });
    }
  }

  for (const l of await getAllListingSlugs()) {
    entries.push({ url: `${SITE.url}/members/${l.slug}`, lastModified: new Date(l.updated_at) });
  }

  return entries;
}
