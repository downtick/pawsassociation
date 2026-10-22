"use server";

import { revalidatePath } from "next/cache";
import { requireActiveMember } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { ListingSchema, type ListingFormData } from "@/lib/schemas";

// Member self-service listing editor. Runs under the member's OWN session
// (RLS-governed): the owner insert/update policies allow exactly their row,
// and the column-level grants in schema.sql leave out approved/featured, so a
// member can never approve or feature themselves.

function slugify(v: string): string {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export async function saveMyListing(input: ListingFormData): Promise<{ ok: boolean; error?: string }> {
  const profile = await requireActiveMember();

  const parsed = ListingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form for errors." };
  }
  const d = parsed.data;

  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", d.categorySlug)
    .maybeSingle();
  if (!category) return { ok: false, error: "Pick a valid attraction type." };

  const { data: existing } = await supabase
    .from("listings")
    .select("id, slug")
    .eq("profile_id", profile.id)
    .maybeSingle();

  // Resolve the "also offers" slugs to category ids (main type excluded).
  const extraSlugs = [...new Set(d.alsoOffer)].filter((sl) => sl !== d.categorySlug);
  const { data: extraCats } = extraSlugs.length
    ? await supabase.from("categories").select("id").in("slug", extraSlugs)
    : { data: [] as { id: string }[] };

  const fields = {
    category_id: category.id,
    business_name: d.businessName,
    contact_name: d.contactName || null,
    bio: d.bio || null,
    services: d.services,
    city: d.city,
    state: d.state.toUpperCase(),
    zip: d.zip,
    service_area: d.serviceArea || null,
    phone: d.phone || null,
    website: d.website ? (d.website.startsWith("http") ? d.website : `https://${d.website}`) : null,
  };

  let listingId: string | null = existing?.id ?? null;

  if (existing) {
    const { error } = await supabase.from("listings").update(fields).eq("id", existing.id);
    if (error) return { ok: false, error: "Could not save your listing. Please try again." };
  } else {
    // Unique slug: business name + city, with a short random suffix on collision.
    const base = slugify(`${d.businessName}-${d.city}`) || `member-${profile.id.slice(0, 6)}`;
    let slug = base;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: inserted, error } = await supabase.from("listings").insert({
        ...fields,
        profile_id: profile.id,
        slug,
        // approved/featured are left to their false defaults — members have
        // no INSERT grant on those columns, so sending them would fail.
      }).select("id").single();
      if (!error) { listingId = inserted?.id ?? null; break; }
      if (error.code === "23505") {
        slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
        if (attempt === 2) return { ok: false, error: "Could not save your listing. Please try again." };
        continue;
      }
      console.error("[listing] insert failed:", error.message);
      return { ok: false, error: "Could not save your listing. Please try again." };
    }
  }

  // Replace the "also offers" set with exactly what's checked now.
  if (listingId) {
    await supabase.from("listing_categories").delete().eq("listing_id", listingId);
    const rows = (extraCats ?? []).map((c) => ({ listing_id: listingId, category_id: c.id }));
    if (rows.length) {
      const { error } = await supabase.from("listing_categories").insert(rows);
      if (error) {
        console.error("[listing] categories save failed:", error.message);
        return { ok: false, error: "Your listing saved, but the attraction types didn't. Please try again." };
      }
    }
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
