import { NextRequest, NextResponse } from "next/server";
import { LeadSchema } from "@/lib/schemas";
import { sendLeadNotification, sendLeadAdminNotice } from "@/lib/emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

// Public directory lead form → store the lead + email the member (Reply-To
// the inquirer) + silent admin copy. Uses the service-role client because
// anonymous visitors have no insert policy on leads (bot protection happens
// here, before any write).

function checkOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originHost = new URL(origin).host;
    const requestHost = request.headers.get("host");
    if (requestHost && originHost === requestHost) return true;
    if (originHost.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!checkRateLimit(getClientIp(request)).allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { listingId, name, email, phone, eventDate, message, referrer, pageUrl } = parsed.data;
  const db = createAdminClient();

  // The listing must be publicly visible — otherwise the form is being
  // replayed against a hidden/unapproved listing id.
  const { data: listing } = await db
    .from("public_listings")
    .select("id, business_name, category_name, contact_name, profile_id")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing) {
    return NextResponse.json({ error: "This listing is not accepting requests." }, { status: 404 });
  }

  const { error: insertError } = await db.from("leads").insert({
    listing_id: listingId,
    name,
    email,
    phone: phone || null,
    event_date: eventDate || null,
    message,
    referrer: referrer || null,
    page_url: pageUrl || null,
  });
  if (insertError) {
    console.error("Lead insert error:", insertError.message);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  // Email the member (claimed listings only — unclaimed have no account yet;
  // their leads accrue as the claim-your-listing pitch).
  let memberEmail: string | null = null;
  if (listing.profile_id) {
    const { data: member } = await db
      .from("profiles")
      .select("email, first_name")
      .eq("id", listing.profile_id)
      .maybeSingle();
    if (member?.email) {
      memberEmail = member.email;
      await sendLeadNotification({
        to: member.email,
        memberFirstName: member.first_name || listing.contact_name || "",
        businessName: listing.business_name,
        lead: { name, email, phone, eventDate, message },
      }).catch((err) => console.error("Lead notification error:", err));
    }
  }

  await sendLeadAdminNotice({
    businessName: listing.business_name,
    categoryName: listing.category_name,
    memberEmail,
    lead: { name, email, phone, eventDate, message },
    referrer,
    pageUrl,
  }).catch((err) => console.error("Lead admin notice error:", err));

  return NextResponse.json({ success: true });
}
