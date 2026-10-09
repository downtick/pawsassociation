import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

// One canonical host for SEO: www and the production *.vercel.app alias
// 308 to the apex. Preview deployments (other *.vercel.app hosts) are left
// alone so they stay testable.
const CANONICAL_HOST = "pawsassociation.com";
const REDIRECT_HOSTS = new Set(["www.pawsassociation.com", "pawsassociation.vercel.app"]);

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase();
  if (host && REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
