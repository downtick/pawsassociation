import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireActiveMember } from "@/lib/access";
import { getStripe } from "@/lib/stripe";
import { findRefundableRenewal, type RefundableRenewal } from "@/lib/renewalRefund";
import { PRICE_DOLLARS, RENEWAL_REFUND_DAYS, TRIAL_DAYS } from "@/lib/membershipPolicy";
import CancelRefundButton from "@/components/CancelRefundButton";

export const metadata: Metadata = { title: "Billing" };
export const dynamic = "force-dynamic";

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", month: "long", day: "numeric", year: "numeric" });

export default async function BillingPage() {
  const profile = await requireActiveMember();

  // Comp/partner-provided members have no Stripe billing to manage — bounce
  // them to settings instead. (The dashboard nav already hides this link for
  // them; this is the server-side backstop.)
  if (profile.billing_source !== "stripe") {
    redirect("/dashboard/settings");
  }

  // Live facts from Stripe: trial, scheduled cancellation, and whether the
  // 30-day renewal refund applies right now. A Stripe hiccup must not break
  // the page, so each lookup degrades to "unknown".
  let trialEnd: Date | null = null;
  let cancelsAt: Date | null = null;
  let refundable: RefundableRenewal | null = null;
  if (profile.stripe_subscription_id) {
    try {
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      if (sub.status === "trialing" && sub.trial_end) trialEnd = new Date(sub.trial_end * 1000);
      if (sub.cancel_at) cancelsAt = new Date(sub.cancel_at * 1000);
      refundable = await findRefundableRenewal(stripe, profile.stripe_subscription_id);
    } catch (err) {
      console.error("Billing page Stripe lookup failed:", err);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl mb-2">Billing</h1>
      <p className="text-[var(--ink-3)] mb-8">
        Manage your payment method, view receipts, or cancel your membership.
      </p>

      <div className="card p-6 mb-6">
        <p className="text-sm text-[var(--ink-3)] mb-1">Plan</p>
        <p className="font-semibold mb-4">Annual Membership — ${PRICE_DOLLARS}/year, auto-renewing</p>

        {trialEnd && !cancelsAt && (
          <div className="note mb-4">
            <span>
              <strong>You&apos;re on your free trial until {fmt(trialEnd)}.</strong> You won&apos;t be
              charged before then. To cancel at no cost, choose <em>Manage billing &amp; cancel</em>{" "}
              below before that date; otherwise ${PRICE_DOLLARS} is charged on {fmt(trialEnd)}.
            </span>
          </div>
        )}

        {cancelsAt ? (
          <>
            <p className="text-sm text-[var(--ink-3)] mb-1">Membership ends</p>
            <p className="font-semibold mb-4">{fmt(cancelsAt)} (you won&apos;t be charged again)</p>
          </>
        ) : (
          <>
            <p className="text-sm text-[var(--ink-3)] mb-1">{trialEnd ? "First charge" : "Next renewal"}</p>
            <p className="font-semibold mb-4">
              {trialEnd ? fmt(trialEnd) : profile.current_period_end ? fmt(profile.current_period_end) : "—"}
            </p>
          </>
        )}

        <form action="/api/stripe/portal" method="POST">
          <button type="submit" className="btn-dark">Manage billing &amp; cancel (Stripe)</button>
        </form>
      </div>

      {refundable && (
        <div className="card p-6 mb-6">
          <CancelRefundButton amount={`$${(refundable.amountCents / 100).toFixed(2)}`} deadline={fmt(refundable.refundDeadline)} />
        </div>
      )}

      <p className="text-xs text-[var(--ink-3)]">
        New members get a {TRIAL_DAYS}-day free trial: cancel before it ends and you&apos;re never
        charged. Membership renews automatically each year, and we email you a reminder about 30
        days before. If you cancel within {RENEWAL_REFUND_DAYS} days after an automatic renewal
        charge, that renewal is refunded in full. Otherwise fees are non-refundable, and you can
        turn off future renewals anytime here.
      </p>
    </div>
  );
}
