import { NextRequest, NextResponse } from "next/server";
import { RemovalSchema } from "@/lib/removalSchema";
import { sendRemovalRequest } from "@/lib/emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

// Listing removal requests (Terms §4). Same protections as /api/contact:
// same-origin check, per-IP rate limit, honeypot, Zod validation. The request
// is emailed to the admin, who removes the listing from /admin/listings —
// nothing is deleted automatically, so the form can't be used to take down
// someone else's listing.
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

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!checkRateLimit(`removal:${getClientIp(request)}`).allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = RemovalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const d = parsed.data;

  // Look the listing up server-side so the email shows what's really on the
  // site (the slug in the form is only a hint from the page they came from).
  let listing: { business_name: string; city: string | null; state: string | null; claimed: boolean } | null = null;
  if (d.listingSlug) {
    const { data } = await createAdminClient()
      .from("listings")
      .select("business_name, city, state, profile_id")
      .eq("slug", d.listingSlug)
      .maybeSingle();
    if (data) listing = { business_name: data.business_name, city: data.city, state: data.state, claimed: !!data.profile_id };
  }

  const result = await sendRemovalRequest({ ...d, listing });
  if (!result.ok) {
    return NextResponse.json({ error: "We couldn't send your request. Please try again, or use the contact form." }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
