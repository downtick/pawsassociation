import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import ListingForm from "@/components/ListingForm";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = { title: "My listing", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ProfileEditorPage() {
  const profile = await requireActiveMember();
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle<Listing>();

  let categorySlug: string | null = null;
  if (listing?.category_id) {
    const { data: cat } = await supabase
      .from("categories")
      .select("slug")
      .eq("id", listing.category_id)
      .maybeSingle();
    categorySlug = cat?.slug ?? null;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display" style={{ fontSize: 24 }}>My listing</h1>
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            This is your public profile in the member directory.
          </p>
        </div>
        {listing && (
          listing.approved ? (
            <Link href={`/members/${listing.slug}`} className="btn btn-ghost">View public page</Link>
          ) : (
            <span className="pill soon">Awaiting review</span>
          )
        )}
      </div>
      <ListingForm listing={listing ?? null} categorySlug={categorySlug} />
    </div>
  );
}
