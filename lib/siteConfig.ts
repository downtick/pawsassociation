// Single source of truth for brand identity.
//
// Every user-facing occurrence of the name resolves through here (or through
// NEXT_PUBLIC_SITE_NAME / NEXT_PUBLIC_SITE_DOMAIN) so a rebrand is a one-line
// change rather than a 40-file sweep. Do not hardcode the brand name in new
// components; import SITE instead.
export const SITE = {
  /** Short display name used in copy, headings, the header/footer, and emails. */
  name: process.env.NEXT_PUBLIC_SITE_NAME || "PAWS",
  /** Full association name, used in the header lockup, footer, and legal pages. */
  fullName:
    process.env.NEXT_PUBLIC_SITE_FULL_NAME ||
    "PAWS — Professional Association of Wildlife & Sports",
  /** Bare domain, no protocol. */
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "pawsassociation.com",
  /** Full origin, used for metadataBase, Stripe redirects, and email links. */
  get url() {
    return process.env.NEXT_PUBLIC_SITE_URL || `https://${this.domain}`;
  },
  /** Registered entity named in the legal pages. */
  legalEntity:
    process.env.NEXT_PUBLIC_SITE_LEGAL_ENTITY ||
    "Professional Association of Wildlife & Sports",
  /** Postal address. Commercial email must carry one (CAN-SPAM). */
  mailingAddress:
    process.env.NEXT_PUBLIC_MAILING_ADDRESS || "9169 W State St #1888, Garden City, ID 83714",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "office@pawsassociation.com",
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "office@pawsassociation.com",
} as const;
