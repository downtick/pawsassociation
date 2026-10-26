// The membership's money rules, in one place so the Join page, Terms,
// Billing page, emails and Stripe calls can never disagree.
export const PRICE_DOLLARS = 149;
export const TRIAL_DAYS = 7; // free trial for first-time members (card on file, no charge until day 8)
export const RENEWAL_REFUND_DAYS = 30; // cancel within this many days AFTER a renewal charge → full refund of it
export const RENEWAL_REMINDER_DAYS = 30; // reminder email this many days before each renewal

// Shown next to the required checkbox, and stored word-for-word with the
// version in member_events at checkout, so a dispute can be answered with
// exactly what the member agreed to.
export const AUTO_RENEW_CONSENT_VERSION = "2026-10-27";
export const AUTO_RENEW_CONSENT_TEXT =
  `I understand my PAWS membership renews automatically every year at $${PRICE_DOLLARS} until I cancel. ` +
  `New members get a ${TRIAL_DAYS}-day free trial and aren't charged if they cancel before it ends. ` +
  `I can cancel online anytime from my Billing page, and if I cancel within ${RENEWAL_REFUND_DAYS} days ` +
  `after an automatic renewal charge, that renewal is refunded in full.`;
