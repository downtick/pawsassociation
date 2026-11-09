import { NextRequest, NextResponse } from "next/server";
import { ClaimSchema } from "@/lib/claimSchema";
import { sendClaimRequest } from "@/lib/emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

// Listing claim requests. Same protections as /api/removal: same-origin check,
// per-IP rate limit, honeypot, Zod validation. The request is emailed to the
// admin, who verifies the owner before moving the listing — nothing changes
// automatically, so the form can't be used to take over someone's listing.
function checkOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originHost = new URL(origin).host;
    const requestHost = request.headers.get("host");
    return (!!requestHost && originHost === requestHost) || originHost.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

const digits = (s: string | null | undefined) => (s || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!checkRateLimit(`claim:${getClientIp(request)}`).allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = ClaimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const d = parsed.data;

  const db = createAdminClient();
  const { data: listing } = await db
    .from("listings")
    .select("id, business_name, city, state, profile_id, approved")
    .eq("slug", d.listingSlug)
    .maybeSingle();
  if (!listing || !listing.approved) {
    return NextResponse.json({ error: "We couldn't find that listing. Please use the contact form." }, { status: 404 });
  }
  if (listing.profile_id) {
    return NextResponse.json({ error: "This listing has already been claimed. If that's a mistake, please use the contact form." }, { status: 409 });
  }

  // Tells the admin whether the claimant matches what's on file, without
  // sending the private contact details anywhere.
  const { data: contacts } = await db.from("listing_private_contacts").select("email, phone").eq("listing_id", listing.id);
  const emails = (contacts || []).map((c) => (c.email || "").trim().toLowerCase()).filter(Boolean);
  const phones = (contacts || []).map((c) => digits(c.phone)).filter(Boolean);

  const result = await sendClaimRequest({
    ...d,
    listing: { business_name: listing.business_name, city: listing.city, state: listing.state },
    emailMatch: emails.length ? emails.includes(d.email) : null,
    phoneMatch: phones.length ? phones.includes(digits(d.phone)) : null,
  });
  if (!result.ok) {
    return NextResponse.json({ error: "We couldn't send your request. Please try again, or use the contact form." }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
