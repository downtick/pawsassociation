import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import ListingActions from "@/components/admin/ListingActions";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = { title: "Listings" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

// Directory moderation. Tabs: review queue (unapproved) and live; search by
// business name, city or state; 100 per page. Uses the service-role client so
// unapproved rows are visible.
//
// The category embed MUST name the FK column (`!category_id`): listings reach
// categories two ways (category_id, and the listing_categories join table), so
// a bare `categories(name)` is ambiguous and PostgREST returns an error — which
// rendered as an empty page ("0 listings") before this was fixed.
export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; page?: string }>;
}) {
  await requireAdmin();
  const db = createAdminClient();
  const { tab = "pending", q = "", page = "1" } = await searchParams;
  const showPending = tab !== "live";
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const term = q.trim().replace(/[%,()*]/g, " ").slice(0, 80);

  const [pendingCount, liveCount] = await Promise.all([
    db.from("listings").select("id", { count: "exact", head: true }).eq("approved", false),
    db.from("listings").select("id", { count: "exact", head: true }).eq("approved", true),
  ]);

  let query = db
    .from("listings")
    .select("*, categories!category_id(name)", { count: "exact" })
    .eq("approved", !showPending)
    .order("business_name", { ascending: true })
    .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
  if (term) query = query.or(`business_name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`);
  const { data, count, error } = await query;
  if (error) console.error("Admin listings query failed:", error);

  const listings = (data ?? []) as (Listing & { categories: { name: string } | null })[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const href = (over: Record<string, string>) => {
    const p = new URLSearchParams({ tab: showPending ? "pending" : "live", ...(term ? { q: term } : {}), ...over });
    return `/admin/listings?${p.toString()}`;
  };

  const Row = ({ l }: { l: (typeof listings)[number] }) => (
    <tr className="border-b align-top" style={{ borderColor: "var(--rule)" }}>
      <td className="p-3">
        <p className="font-semibold">{l.business_name}</p>
        <p className="text-xs" style={{ color: "var(--ink-3)" }}>
          {l.categories?.name ?? "No category"} · {l.city ? `${l.city}, ${l.state}` : l.state ?? "—"}
        </p>
        {l.approved && (
          <Link href={`/members/${l.slug}`} className="text-xs font-semibold" style={{ color: "var(--blue)" }}>
            View public page
          </Link>
        )}
      </td>
      <td className="p-3 text-xs" style={{ color: "var(--ink-3)" }}>
        {l.profile_id ? "Claimed" : "Unclaimed (pre-seeded)"}
        {l.featured && <span className="pill on ml-2">Featured</span>}
      </td>
      <td className="p-3">
        <ListingActions listingId={l.id} approved={l.approved} featured={l.featured} />
      </td>
    </tr>
  );

  return (
    <div>
      <h1 className="mb-2 text-3xl">Listings</h1>
      <p className="mb-8 text-sm" style={{ color: "var(--ink-3)" }}>
        Approve new and edited listings, feature standouts, and remove anything
        that shouldn&apos;t be listed.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/listings?tab=pending" className={showPending ? "btn btn-primary !px-3 !py-1.5 !text-sm" : "btn btn-ghost !px-3 !py-1.5 !text-sm"}>
          Awaiting review ({pendingCount.count ?? 0})
        </Link>
        <Link href="/admin/listings?tab=live" className={!showPending ? "btn btn-primary !px-3 !py-1.5 !text-sm" : "btn btn-ghost !px-3 !py-1.5 !text-sm"}>
          Live ({liveCount.count ?? 0})
        </Link>
        <form action="/admin/listings" className="ml-auto flex gap-2">
          <input type="hidden" name="tab" value={showPending ? "pending" : "live"} />
          <input name="q" defaultValue={term} placeholder="Search name, city, or state" className="form-input max-w-xs !py-1.5 text-sm" />
          <button type="submit" className="btn btn-ghost !px-3 !py-1.5 !text-sm">Search</button>
        </form>
      </div>

      {error && (
        <p className="form-error mb-4">Couldn&apos;t load listings: {error.message}</p>
      )}

      {listings.length === 0 ? (
        <p className="mb-8 text-sm" style={{ color: "var(--ink-3)" }}>
          {term ? "No listings match that search." : showPending ? "Queue is clear." : "No live listings."}
        </p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <tbody>{listings.map((l) => <Row key={l.id} l={l} />)}</tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          {pageNum > 1 && <Link href={href({ page: String(pageNum - 1) })} className="btn btn-ghost !px-3 !py-1.5 !text-sm">← Previous</Link>}
          <span style={{ color: "var(--ink-3)" }}>Page {pageNum} of {totalPages} · {count} listings</span>
          {pageNum < totalPages && <Link href={href({ page: String(pageNum + 1) })} className="btn btn-ghost !px-3 !py-1.5 !text-sm">Next →</Link>}
        </div>
      )}
    </div>
  );
}
