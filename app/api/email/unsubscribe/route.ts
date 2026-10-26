import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribeToken } from "@/lib/emailTokens";

// POST only (from the button on /unsubscribe). A GET link would be "clicked"
// by mail scanners like Microsoft Safe Links and unsubscribe people silently.
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const u = String(form?.get("u") ?? "");
  const t = String(form?.get("t") ?? "");
  const resubscribe = form?.get("resubscribe") === "1";
  const back = new URL("/unsubscribe", request.url);
  back.searchParams.set("u", u);
  back.searchParams.set("t", t);

  if (!/^[0-9a-f-]{36}$/i.test(u) || !verifyUnsubscribeToken(u, t)) {
    back.searchParams.set("status", "invalid");
    return NextResponse.redirect(back, 303);
  }

  const db = createAdminClient();
  await db.from("profiles").update({ email_opt_out: !resubscribe }).eq("id", u);
  await db.from("member_events").insert({ member_id: u, event: resubscribe ? "email_resubscribed" : "email_unsubscribed" });
  back.searchParams.set("status", resubscribe ? "resubscribed" : "done");
  return NextResponse.redirect(back, 303);
}
