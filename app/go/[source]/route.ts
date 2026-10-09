import { NextRequest, NextResponse } from "next/server";

// Short, printable campaign links. Each one lands on /start with UTM tags so
// GA4 attributes visits — and the purchase that follows — to its channel.
//   pawsassociation.com/go/brochure  → printed brochure / QR code
//   pawsassociation.com/go/email     → mailing-list emails
// Add a channel by adding a row here; unknown sources still land on /start.
const CAMPAIGNS: Record<string, { source: string; medium: string }> = {
  brochure: { source: "brochure", medium: "print" },
  email: { source: "mailing_list", medium: "email" },
};

export function GET(request: NextRequest, { params }: { params: Promise<{ source: string }> }) {
  return params.then(({ source }) => {
    const c = CAMPAIGNS[source.toLowerCase()];
    const url = new URL("/start", request.url);
    if (c) {
      url.searchParams.set("utm_source", c.source);
      url.searchParams.set("utm_medium", c.medium);
      url.searchParams.set("utm_campaign", "member_addon");
    }
    return NextResponse.redirect(url, 302);
  });
}
