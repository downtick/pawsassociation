import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";
import { DIRECTORY } from "@/lib/directory";
import { ARTICLES } from "@/content/articles";
import { DOWNLOADS } from "@/content/downloads";
import { getAllListingSlugs, getStatesWithListings } from "@/lib/listings";

// Dynamic sitemap: static pages + category pages + member profiles + only
// the category/state geo pages that actually have members (thin pages hurt).
const STATIC_ROUTES = [
  "/", "/directory", "/join", "/benefits", "/get-listed", "/learn", "/downloads",
  "/about", "/faq", "/contact", "/terms", "/privacy", "/disclaimer", "/login",
];

// lastmod must be truthful or Google ignores it site-wide. Member pages use
// the listing's own updated_at; directory pages use the newest listing they
// could show (approximated by the newest listing overall); pages with no
// stored edit date omit lastmod rather than claiming "changed today".
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getAllListingSlugs();
  const newest = listings.reduce<number>((max, l) => Math.max(max, Date.parse(l.updated_at) || 0), 0);
  const directoryMod = newest > 0 ? new Date(newest) : undefined;
  const DIRECTORY_ROUTES = new Set(["/", "/directory"]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    ...(DIRECTORY_ROUTES.has(route) && directoryMod ? { lastModified: directoryMod } : {}),
  }));

  // Category pages: featured types always; the rest only once they have a
  // listing, so 16 empty type pages don't read as thin content.
  for (const c of DIRECTORY.categories) {
    const hasListings = c.featured || (await getStatesWithListings(c.slug)).length > 0;
    if (hasListings) entries.push({ url: `${SITE.url}/directory/${c.slug}`, ...(directoryMod ? { lastModified: directoryMod } : {}) });
  }

  // Every article, including course lessons: their public teaser pages are
  // indexable (the full lesson renders only for members).
  for (const a of ARTICLES) {
    entries.push({ url: `${SITE.url}/learn/${a.slug}` });
  }

  for (const d of DOWNLOADS) {
    entries.push({ url: `${SITE.url}/downloads/${d.slug}` });
  }

  // Geo pages with ≥1 member, per category and for the "all" pseudo-category.
  for (const c of [...DIRECTORY.categories.map((c) => c.slug), "all"] as string[]) {
    const states = await getStatesWithListings(c === "all" ? undefined : c);
    for (const s of states) {
      entries.push({ url: `${SITE.url}/directory/${c}/${s.slug}`, ...(directoryMod ? { lastModified: directoryMod } : {}) });
    }
  }

  for (const l of listings) {
    entries.push({ url: `${SITE.url}/members/${l.slug}`, lastModified: new Date(l.updated_at) });
  }

  return entries;
}
