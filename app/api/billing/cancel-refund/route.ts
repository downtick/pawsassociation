import { NextRequest, NextResponse } from "next/server";
import { getStripe, logStripeError } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findRefundableRenewal } from "@/lib/renewalRefund";
import { sendRenewalRefundEmails } from "@/lib/emails";

// Member self-service: cancel now AND refund the most recent automatic
// renewal, if it was charged within the last 30 days (Terms §3). Everything
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
    const renewal = await findRefundableRenewal(stripe, profile.stripe_subscription_id);
    if (!renewal) {
      return NextResponse.json(
        { error: "There's no renewal charge from the last 30 days to refund. You can still turn off future renewals with Manage billing." },
        { status: 400 }
      );
    }

    // Idempotency keys: a double-click or retry can never refund twice.
    const refund = await stripe.refunds.create(
      {
        payment_intent: renewal.paymentIntentId,
        reason: "requested_by_customer",
        metadata: { profile_id: profile.id, invoice: renewal.invoiceId, policy: "renewal_30_day" },
      },
      { idempotencyKey: `renewal-refund-${renewal.invoiceId}` }
    );
    await stripe.subscriptions.cancel(profile.stripe_subscription_id, {}, { idempotencyKey: `renewal-cancel-${renewal.invoiceId}` });

    await admin.from("profiles").update({ membership_status: "canceled" }).eq("id", profile.id);
    await admin.from("member_events").insert({
      member_id: profile.id,
      event: "renewal_refunded",
      detail: { refund: refund.id, invoice: renewal.invoiceId, amount_cents: renewal.amountCents },
    });

    await sendRenewalRefundEmails({
      to: profile.email,
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      memberNumber: profile.member_number || "",
      amountCents: renewal.amountCents,
      refundId: refund.id,
    }).catch((err) => console.error("Renewal refund email error:", err));

    return NextResponse.json({ ok: true, amountCents: renewal.amountCents });
  } catch (err) {
    const friendly = logStripeError("renewal cancel+refund", err);
    return NextResponse.json({ error: friendly || "We couldn't process that. Please contact us and we'll take care of it." }, { status: 500 });
  }
}
