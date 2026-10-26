import { NextRequest, NextResponse } from "next/server";
import { getStripe, logStripeError } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findRefundableCharge } from "@/lib/renewalRefund";
import { sendRefundEmails } from "@/lib/emails";

// Member self-service: cancel now AND refund the latest charge when a refund
// rule covers it — a new member's first payment within 7 days (money-back
// guarantee) or an automatic renewal within 30 days (Terms §3). Everything
// is re-checked against Stripe here; the button on the Billing page is only
// a convenience.
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (process.env.NODE_ENV === "production" && (!origin || !host || new URL(origin).host !== host)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in again." }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, email, first_name, last_name, member_number, stripe_subscription_id")
    .eq("id", user.id)
    .single();
  if (!profile?.stripe_subscription_id) {
    return NextResponse.json({ error: "We couldn't find a subscription on your account." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const charge = await findRefundableCharge(stripe, profile.stripe_subscription_id);
    if (!charge) {
      return NextResponse.json(
        { error: "There's no charge on your account that's still within a refund window. You can still turn off future renewals with Manage billing." },
        { status: 400 }
      );
    }

    // Idempotency keys: a double-click or retry can never refund twice.
    const refund = await stripe.refunds.create(
      {
        payment_intent: charge.paymentIntentId,
        reason: "requested_by_customer",
        metadata: { profile_id: profile.id, invoice: charge.invoiceId, policy: charge.kind === "guarantee" ? "guarantee_7_day" : "renewal_30_day" },
      },
      { idempotencyKey: `refund-${charge.invoiceId}` }
    );
    await stripe.subscriptions.cancel(profile.stripe_subscription_id, {}, { idempotencyKey: `cancel-${charge.invoiceId}` });

    await admin.from("profiles").update({ membership_status: "canceled" }).eq("id", profile.id);
    await admin.from("member_events").insert({
      member_id: profile.id,
      event: charge.kind === "guarantee" ? "guarantee_refunded" : "renewal_refunded",
      detail: { refund: refund.id, invoice: charge.invoiceId, amount_cents: charge.amountCents },
    });

    await sendRefundEmails({
      kind: charge.kind,
      to: profile.email,
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      memberNumber: profile.member_number || "",
      amountCents: charge.amountCents,
      refundId: refund.id,
    }).catch((err) => console.error("Renewal refund email error:", err));

    return NextResponse.json({ ok: true, amountCents: charge.amountCents });
  } catch (err) {
    const friendly = logStripeError("cancel+refund", err);
    return NextResponse.json({ error: friendly || "We couldn't process that. Please contact us and we'll take care of it." }, { status: 500 });
  }
}
