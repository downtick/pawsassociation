import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import ListingActions from "@/components/admin/ListingActions";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = { title: "Listings" };
export const dynamic = "force-dynamic";

// Directory moderation: the review queue (unapproved first), then everything
// else. Uses the service-role client so unapproved rows are visible.
export default async function AdminListingsPage() {
  await requireAdmin();
  const db = createAdminClient();

  const { data } = await db
    .from("listings")
    .select("*, categories(name)")
    .order("approved", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(200);

  const listings = (data ?? []) as (Listing & { categories: { name: string } | null })[];
  const pending = listings.filter((l) => !l.approved);
  const live = listings.filter((l) => l.approved);

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
        that doesn&apos;t meet the standards.
      </p>

      <h2 className="mb-3 text-xl">Awaiting review ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="mb-8 text-sm" style={{ color: "var(--ink-3)" }}>Queue is clear.</p>
      ) : (
        <div className="card mb-10 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>{pending.map((l) => <Row key={l.id} l={l} />)}</tbody>
          </table>
        </div>
      )}

      <h2 className="mb-3 text-xl">Live ({live.length})</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>{live.map((l) => <Row key={l.id} l={l} />)}</tbody>
        </table>
      </div>
    </div>
  );
}
