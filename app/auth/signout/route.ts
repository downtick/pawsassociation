import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Logs the current user out (clears the Supabase session cookies) and sends
// them home. POST-only, posted by the plain <form> in LogoutButton so it
// works without JavaScript; a GET would let any link or prefetch log people
// out.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
