import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_ANNUAL, logStripeError } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TRIAL_DAYS, AUTO_RENEW_CONSENT_TEXT, AUTO_RENEW_CONSENT_VERSION } from "@/lib/membershipPolicy";

// Starts a Stripe Checkout subscription for the $149/yr retail plan. Real
// integration code against env vars — inert until STRIPE_SECRET_KEY and
// STRIPE_PRICE_ANNUAL are set (Phase 1: no live keys yet).
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to join." }, { status: 401 });
  }

  // The auto-renewal checkbox is required; refuse checkout without it so the
  // consent can't be skipped by calling this route directly.
  const body = (await request.json().catch(() => ({}))) as { autoRenewConsent?: unknown };
  if (body.autoRenewConsent !== true) {
    return NextResponse.json(
      { error: "Please check the box to confirm you understand the automatic renewal." },
      { status: 400 }
    );
  }

  if (!STRIPE_PRICE_ANNUAL) {
    return NextResponse.json(
      { error: "Membership checkout isn't configured yet. Set STRIPE_PRICE_ANNUAL." },
      { status: 501 }
    );
  }

  try {
    const stripe = getStripe();
    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single();

    // Don't sell a second subscription to someone who already has one.
    if (profile?.stripe_subscription_id && ["active", "past_due"].includes(profile.membership_status)) {
      return NextResponse.json(
        { error: "You already have an active membership. Manage it from your dashboard's Billing page." },
        { status: 409 }
      );
    }

    // Free trial only for a first-time member — anyone who has ever had a
    // Stripe customer record (a past member) pays from day one.
    const trialEligible = !profile?.stripe_customer_id;

    await admin.from("member_events").insert({
      member_id: user.id,
      event: "auto_renew_consent",
      detail: {
        version: AUTO_RENEW_CONSENT_VERSION,
        text: AUTO_RENEW_CONSENT_TEXT,
        trial_days: trialEligible ? TRIAL_DAYS : 0,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        user_agent: request.headers.get("user-agent")?.slice(0, 200) || null,
      },
    });

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://pawsassociation.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      // Reuse the Stripe customer for a returning member so their billing
      // history stays in one place; otherwise Checkout creates one.
      ...(profile?.stripe_customer_id
        ? { customer: profile.stripe_customer_id }
        : { customer_email: profile?.email || user.email || undefined }),
      line_items: [{ price: STRIPE_PRICE_ANNUAL, quantity: 1 }],
      allow_promotion_codes: true,
      payment_method_collection: "always",
      ...(trialEligible
        ? {
            subscription_data: {
              trial_period_days: TRIAL_DAYS,
              // No card on file at trial end → cancel rather than leave an
              // unpaid "active" membership behind.
              trial_settings: { end_behavior: { missing_payment_method: "cancel" as const } },
              metadata: { profile_id: user.id },
            },
          }
        : { subscription_data: { metadata: { profile_id: user.id } } }),
      success_url: `${origin}/dashboard?welcome=1`,
      cancel_url: `${origin}/join`,
      metadata: { profile_id: user.id, plan: "retail_annual" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const friendly = logStripeError("checkout session", err);
    return NextResponse.json(
      { error: friendly || "Unable to start checkout." },
      { status: 500 }
    );
  }
}
