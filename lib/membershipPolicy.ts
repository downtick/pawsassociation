// The membership's money rules, in one place so the Join page, Terms,
// Billing page, emails and Stripe calls can never disagree.
export const PRICE_DOLLARS = 149;
export const GUARANTEE_DAYS = 7; // first-time members: cancel within this many days of joining → full refund
export const RENEWAL_REFUND_DAYS = 30; // cancel within this many days AFTER a renewal charge → full refund of it
export const RENEWAL_REMINDER_DAYS = 30; // reminder email this many days before each renewal

// Shown next to the required checkbox, and stored word-for-word with the
// version in member_events at checkout, so a dispute can be answered with
// exactly what the member agreed to.
export const AUTO_RENEW_CONSENT_VERSION = "2026-11-01-promo";
export const AUTO_RENEW_CONSENT_TEXT =
  `I understand my PAWS membership is charged $${PRICE_DOLLARS} today (or less with a promotion code) and renews automatically every year at $${PRICE_DOLLARS} until I cancel. ` +
  `New members who cancel within ${GUARANTEE_DAYS} days of joining get a full refund. ` +
  `I can cancel online anytime from my Billing page, and if I cancel within ${RENEWAL_REFUND_DAYS} days ` +
  `after an automatic renewal charge, that renewal is refunded in full.`;

// Founding-member promo (Stripe promotion code, first-time customers only).
// The banner hides itself after the end date; Stripe expires the code too.
export const FOUNDING_CODE = "FOUNDING99";
export const FOUNDING_PRICE_DOLLARS = 99;
export const FOUNDING_ENDS_LABEL = "December 31";
export const FOUNDING_ENDS_AT = Date.parse("2027-01-01T00:00:00-08:00");
