import type Stripe from "stripe";
import { RENEWAL_REFUND_DAYS } from "./membershipPolicy";

// The "cancel within 30 days after an automatic renewal for a full refund"
// rule. Only a RENEWAL (billing_reason subscription_cycle) qualifies — not the
// first charge after the free trial — and only if it hasn't been refunded.
export interface RefundableRenewal {
  invoiceId: string;
  paymentIntentId: string;
  amountCents: number;
  paidAt: Date;
  refundDeadline: Date;
}

export async function findRefundableRenewal(stripe: Stripe, subscriptionId: string): Promise<RefundableRenewal | null> {
  const invoices = await stripe.invoices.list({ subscription: subscriptionId, status: "paid", limit: 10 });
  const now = Date.now();
  const windowMs = RENEWAL_REFUND_DAYS * 24 * 60 * 60 * 1000;

  const renewal = invoices.data
    .filter((inv) => inv.billing_reason === "subscription_cycle" && inv.amount_paid > 0 && inv.status_transitions.paid_at)
    .sort((a, b) => (b.status_transitions.paid_at ?? 0) - (a.status_transitions.paid_at ?? 0))[0];
  if (!renewal?.id) return null;

  const paidAt = new Date((renewal.status_transitions.paid_at as number) * 1000);
  if (now - paidAt.getTime() > windowMs) return null;

  const payments = await stripe.invoicePayments.list({ invoice: renewal.id, status: "paid", limit: 5 });
  const pi = payments.data.map((p) => p.payment.payment_intent).find(Boolean);
  const paymentIntentId = typeof pi === "string" ? pi : pi?.id;
  if (!paymentIntentId) return null;

  const refunds = await stripe.refunds.list({ payment_intent: paymentIntentId, limit: 5 });
  if (refunds.data.some((r) => r.status === "succeeded" || r.status === "pending")) return null;

  return {
    invoiceId: renewal.id,
    paymentIntentId,
    amountCents: renewal.amount_paid,
    paidAt,
    refundDeadline: new Date(paidAt.getTime() + windowMs),
  };
}
