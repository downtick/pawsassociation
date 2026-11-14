import { NextRequest, NextResponse } from "next/server";
import { getCurrentAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { buildMemberSign } from "@/lib/pdf/memberSign";
import { SITE } from "@/lib/siteConfig";

// Member-only "Proud PAWS member" booth sign, generated per request with the
// member's business name and a QR code to their own listing.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const access = await getCurrentAccess();
  if (!access || !(access.has_access || access.role === "admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("business_name, slug")
    .eq("profile_id", access.id)
    .maybeSingle();
  if (!listing?.slug) {
    return NextResponse.redirect(new URL("/dashboard/profile", request.url));
  }

  const listingUrl = `${SITE.url}/members/${listing.slug}?utm_source=booth_sign&utm_medium=print&utm_campaign=member_badge`;
  const bytes = await buildMemberSign({ businessName: listing.business_name, listingUrl });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="PAWS-member-sign.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
