import type Stripe from "stripe";
import { GUARANTEE_DAYS, RENEWAL_REFUND_DAYS } from "./membershipPolicy";

// The two self-service refund rules (Terms §3):
//  - "guarantee": a first-time member's first charge (billing_reason
//    subscription_create), within 7 days. Eligibility is stamped on the
//    subscription at checkout (metadata.guarantee = "1"), so a returning
//    member can't join-refund-rejoin indefinitely.
//  - "renewal": an automatic renewal (subscription_cycle), within 30 days.
// Either way the charge must be paid and not already refunded.
export interface RefundableCharge {
  kind: "guarantee" | "renewal";
  invoiceId: string;
  paymentIntentId: string;
  amountCents: number;
  paidAt: Date;
  refundDeadline: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function findRefundableCharge(stripe: Stripe, subscriptionId: string): Promise<RefundableCharge | null> {
  const [sub, invoices] = await Promise.all([
    stripe.subscriptions.retrieve(subscriptionId),
    stripe.invoices.list({ subscription: subscriptionId, status: "paid", limit: 10 }),
  ]);
  const now = Date.now();
  const guaranteeEligible = sub.metadata?.guarantee === "1";

  const latest = invoices.data
    .filter((inv) => inv.amount_paid > 0 && inv.status_transitions.paid_at)
    .sort((a, b) => (b.status_transitions.paid_at ?? 0) - (a.status_transitions.paid_at ?? 0))[0];
  if (!latest?.id) return null;

  let kind: RefundableCharge["kind"];
  let windowMs: number;
  if (latest.billing_reason === "subscription_cycle") {
    kind = "renewal";
    windowMs = RENEWAL_REFUND_DAYS * DAY_MS;
  } else if (latest.billing_reason === "subscription_create" && guaranteeEligible) {
    kind = "guarantee";
    windowMs = GUARANTEE_DAYS * DAY_MS;
  } else {
    return null;
  }

  const paidAt = new Date((latest.status_transitions.paid_at as number) * 1000);
  if (now - paidAt.getTime() > windowMs) return null;

  const payments = await stripe.invoicePayments.list({ invoice: latest.id, status: "paid", limit: 5 });
  const pi = payments.data.map((p) => p.payment.payment_intent).find(Boolean);
  const paymentIntentId = typeof pi === "string" ? pi : pi?.id;
  if (!paymentIntentId) return null;

  const refunds = await stripe.refunds.list({ payment_intent: paymentIntentId, limit: 5 });
  if (refunds.data.some((r) => r.status === "succeeded" || r.status === "pending")) return null;

  return {
    kind,
    invoiceId: latest.id,
    paymentIntentId,
    amountCents: latest.amount_paid,
    paidAt,
    refundDeadline: new Date(paidAt.getTime() + windowMs),
  };
}
