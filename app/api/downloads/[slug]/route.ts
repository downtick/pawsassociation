import { NextRequest, NextResponse } from "next/server";
import { getCurrentAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { getDownload } from "@/content/downloads";
import { buildDownload } from "@/lib/pdf/downloads";

// Member-only PDF generation. Non-members are bounced to the public preview
// page. Each file is generated on request and stamped with the member's
// business name (or their name), so there is no shareable public file.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getDownload(slug);
  if (!meta) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const access = await getCurrentAccess();
  if (!access || !(access.has_access || access.role === "admin")) {
    return NextResponse.redirect(new URL(`/downloads/${slug}?locked=1`, request.url));
  }

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("business_name")
    .eq("profile_id", access.id)
    .maybeSingle();
  const preparedFor =
    listing?.business_name ||
    [access.first_name, access.last_name].filter(Boolean).join(" ") ||
    undefined;

  const bytes = await buildDownload(slug, { preparedFor });
  if (!bytes) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="PAWS-${slug}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
