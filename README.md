# PAWSAssociation.com

**PAWS — Professional Association of Wildlife & Sports.** A trade-association
membership site for animal-attraction and amusement operators: petting zoos,
pony rides, beer burros, and mobile farms.

Built from the `membership-website` skill
(`websites/_reference/membership-website-guide/`), forked from the proven
MemberPerkClub codebase (auth, Stripe, admin back office) with the public
member directory added on top.

## The model

- **Public directory** (the SEO engine): searchable member listings with
  category → state → city programmatic pages and indexable member profiles.
  Each profile has a "Request availability" lead form → lead is stored,
  emailed to the member (Reply-To the inquirer), and copied to admin.
- **Membership** ($149/year via Stripe Checkout, auto-renew, 7-day refund
  window) unlocks: the listing + leads inbox, the benefits vault (affiliate
  partner discounts), member guides, and the member badge.
- **Second access path**: admin-created comp memberships (`comp_until` on the
  profile) for partner-provided memberships. No Stripe involvement.
- **Claim-your-listing**: unclaimed listings (`profile_id IS NULL`) are
  pre-seeded by the association so the directory is useful on day one; they
  show publicly with a "claim this listing" note.

## Stack

Next.js 16 (App Router, TS) · Tailwind 4 (CSS `@theme`, no config file) ·
Supabase (Postgres + Auth + RLS paywall) · Stripe (subscriptions) · SMTP2GO
(transactional email) · Vercel.

## Theme

"Arena" (Template B of the membership-website skill): electric blue
`#2563EB` primary (links, nav, structure), sunburst orange `#F97316` for
CTAs. Light only. Tokens in `app/globals.css`.

## Setup

1. Create a Supabase project → SQL editor → paste and run
   [supabase/setup.sql](supabase/setup.sql) (schema + RLS + seed in one shot).
2. Supabase → Auth → Email Templates: paste the three files from
   [supabase/auth-emails/](supabase/auth-emails/).
3. Stripe: create product "PAWS Annual Membership" with a $149/year price;
   put the price id in `STRIPE_PRICE_ANNUAL`. Add the webhook endpoint
   `/api/stripe/webhook` (checkout.session.completed,
   customer.subscription.updated, customer.subscription.deleted,
   invoice.payment_failed).
4. Create `.env.local` with:

   ```
   NEXT_PUBLIC_SITE_URL=https://pawsassociation.com
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=          # server only, never exposed
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   STRIPE_PRICE_ANNUAL=                # price id for $149/yr membership
   SMTP2GO_API_KEY=
   EMAIL_FROM=office@pawsassociation.com
   ADMIN_NOTIFY_EMAIL=                 # back-end only, never shown on any page
   EMAIL_BCC=                          # optional archive copies, comma-separated
   ```
5. `npm install && npm run dev`
6. Sign up once, then in Supabase SQL:
   `update profiles set role = 'admin' where email = 'you@…';`
7. Replace the seed `resources` rows marked `[TODO-LINK]` (Hertz CDP number,
   Rakuten referral link) via /admin/resources before launch.

## Key paths

- `lib/directory.ts` — the taxonomy config (categories, service tags). To
  clone this site for another association, change this file + `siteConfig.ts`
  + the theme tokens.
- `lib/listings.ts` — public directory data access (reads `public_listings`
  view only).
- `lib/access.ts` — `requireActiveMember()` / `requireAdmin()` gates;
  `member_access.has_access` is the single access rule.
- `app/directory/[category]/[state]/[city]` — the programmatic SEO tree
  (`all` is the no-category pseudo-slug).
- `app/api/lead/route.ts` — public lead pipeline (honeypot + rate limit +
  origin check; service-role insert; member + admin emails).
- `supabase/schema.sql` / `seed.sql` / `setup.sql` — setup.sql is the
  concatenation; regenerate it after editing the other two.

## Conventions

Follows `websites/CLAUDE.md`: legal pages (counsel review pending), contact
page fields, phone/ZIP formatting, accessibility toggle, sectioned admin
emails with tracking metadata last, no fake testimonials (trust facts only),
on-theme sender (`office@pawsassociation.com`, never `hello@`), YesBaker
contact info never public.

## Status

- [x] Full build scaffolded from MemberPerkClub fork (2026-09-24)
- [ ] Supabase project + keys
- [ ] Stripe product + webhook + keys
- [ ] SMTP2GO sender domain (SPF/DKIM for pawsassociation.com)
- [ ] Domain registration (pawsassociation.com + .com redirect) + Vercel
- [ ] Real Hertz CDP + Rakuten links in resources
- [ ] Pre-seed real operator listings (replace the 4 obvious samples)
- [ ] Counsel review of Terms/Privacy/Disclaimer
