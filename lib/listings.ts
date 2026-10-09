import { createClient } from "./supabase/server";
import { isAuthConfigured } from "./access";
import { STATE_NAMES, citySlug, stateSlug } from "./directory";
import type { PublicListing } from "./types";

// Read-only data access for the PUBLIC directory. Every query reads the
// public_listings view — the single visibility rule (approved AND owner has
// access, or an unclaimed pre-seeded listing). All functions degrade to
// empty results when Supabase env vars are absent, so an unconfigured
// deploy renders empty-state pages instead of 500s.

export interface DirectoryFilters {
  q?: string;
  categorySlug?: string;
  stateAbbr?: string;
  city?: string;
  limit?: number;
}

export async function searchListings(filters: DirectoryFilters = {}): Promise<PublicListing[]> {
  if (!isAuthConfigured()) return [];
  const supabase = await createClient();

  let query = supabase
    .from("public_listings")
    .select("*")
    .order("featured", { ascending: false })
    .order("business_name")
    .limit(filters.limit ?? 60);

  // Match the main type OR any "also offers" type.
  if (filters.categorySlug) query = query.contains("category_slugs", [filters.categorySlug]);
  if (filters.stateAbbr) query = query.eq("state", filters.stateAbbr.toUpperCase());
  if (filters.q) {
    // websearch_to_tsquery handles multi-word, quoted phrases, and is safe
    // against operator injection in user input.
    query = query.textSearch("search", filters.q, { type: "websearch", config: "english" });
  }

  const { data, error } = await query;
  if (error) {
    console.error("[directory] search failed:", error.message);
    return [];
  }
  let rows = (data as PublicListing[]) ?? [];
  if (filters.city) {
    const want = citySlug(filters.city);
    rows = rows.filter((l) => l.city && citySlug(l.city) === want);
  }
  return rows;
}

export async function getFeaturedListings(limit = 6): Promise<PublicListing[]> {
  if (!isAuthConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_listings")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as PublicListing[]) ?? [];
}

export async function getListingBySlug(slug: string): Promise<PublicListing | null> {
  if (!isAuthConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("public_listings").select("*").eq("slug", slug).maybeSingle();
  return (data as PublicListing) ?? null;
}

/** States that actually have ≥1 visible listing (thin geo pages hurt SEO). */
export async function getStatesWithListings(categorySlug?: string): Promise<{ abbr: string; name: string; slug: string; count: number }[]> {
  if (!isAuthConfigured()) return [];
  const supabase = await createClient();
  let query = supabase.from("public_listings").select("state");
  if (categorySlug) query = query.contains("category_slugs", [categorySlug]);
  const { data } = await query;
  const counts = new Map<string, number>();
  for (const row of (data as { state: string | null }[]) ?? []) {
    if (row.state && STATE_NAMES[row.state]) counts.set(row.state, (counts.get(row.state) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([abbr, count]) => ({ abbr, name: STATE_NAMES[abbr], slug: stateSlug(abbr), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Cities within a state that have ≥1 visible listing. */
export async function getCitiesWithListings(stateAbbr: string, categorySlug?: string): Promise<{ city: string; slug: string; count: number }[]> {
  if (!isAuthConfigured()) return [];
  const supabase = await createClient();
  let query = supabase.from("public_listings").select("city").eq("state", stateAbbr.toUpperCase());
  if (categorySlug) query = query.contains("category_slugs", [categorySlug]);
  const { data } = await query;
  const counts = new Map<string, number>();
  for (const row of (data as { city: string | null }[]) ?? []) {
    if (row.city) counts.set(row.city, (counts.get(row.city) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([city, count]) => ({ city, slug: citySlug(city), count }))
    .sort((a, b) => a.city.localeCompare(b.city));
}

/** Every visible listing slug — for the sitemap. */
export async function getAllListingSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (!isAuthConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("public_listings").select("slug, updated_at").limit(2000);
  return (data as { slug: string; updated_at: string }[]) ?? [];
}
