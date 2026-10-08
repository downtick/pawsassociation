# PAWSAssociation.com — Build Handoff

**PAWS — Professional Association of Wildlife & Sports.** Trade-association
membership site for animal attractions: Petting Zoos, Pony Rides, Beer
Burros, Mobile Farms. Built 2026-09-24 by forking MemberPerkClub (same
Supabase + Stripe + SMTP2GO plumbing) and adding the public member directory
per the `membership-website` skill.

> Full architecture, setup steps, env vars, and launch checklist: see
> [README.md](README.md). This file is the decisions-and-gotchas record.

## Decisions made with the owner

| Decision | Value |
|---|---|
| Name / domain | PAWS — pawsassociation.com (available as of 2026-09-24; register .com too and redirect) |
| Theme | "Arena" — blue #2563EB structure, orange #F97316 CTAs, light only |
| Price | $149/year, auto-renew, 7-day full-refund window |
| Taxonomy | Categorized: petting-zoos, pony-rides, beer-burros, mobile-farms (`lib/directory.ts`) |
| Second access path | Admin-created comp memberships (`comp_until`); promo-code self-serve can layer on later |
| Testimonials | NONE until real, permissioned quotes exist — trust-fact bands only (commented insertion points exist) |
| Insurance | Never bundled (regulations). Learn articles link to PettingZooInsurance.com and RunQuotes.com; site states plainly PAWS is not an insurance agency |

## What was kept from MemberPerkClub (proven, do not rebuild)

- `member_access` view / `has_access` single-gate pattern + column-revoke RLS
- Stripe webhook with `stripe_events` idempotency
- Admin back office: member detail actions, comp/free-days, last-admin
  protection, unified `member_events` timeline, audit log
- SMTP2GO sender with `email_log`, BCC handling, sectioned admin notices
- Accessibility toggle, phone/ZIP formatting, honeypot + rate-limit forms

## What was added (the directory layer)

- `categories`, `listings` (nullable `profile_id` = unclaimed pre-seed),
  `leads` tables; `public_listings` view = the ONE public-visibility rule
- `/directory` → `/directory/[category]` → `/[state]` → `/[city]` (the
  pseudo-category `all` renders the tree without a category filter)
- `/members/[slug]` profiles with LocalBusiness JSON-LD + lead form
- `/dashboard/profile` (listing editor), `/dashboard/leads` (inbox)
- `/admin/listings` (review queue: approve / feature / delete)
- `/learn` public articles + member-only guides split (`memberOnly` flag in
  `content/articles/index.tsx`); blog-writing skill checker passes clean
- Dynamic sitemap: only geo pages with ≥1 member are emitted

## Gotchas

- **setup.sql is generated** — after editing `schema.sql` or `seed.sql`,
  re-concatenate (header + schema + seed). Never edit setup.sql directly.
- **Members can't approve themselves**: `approved`/`featured` are revoked
  from authenticated UPDATE. All approval goes through `/admin/listings`.
- **Anonymous lead inserts happen server-side only** (service role in
  `/api/lead` after bot checks). There is deliberately no anon INSERT policy
  on `leads`.
- **`resourcesSeed.ts` and `supabase/seed.sql` must stay in sync** (the
  perks page renders from the TS file; the DB seed exists for the future
  admin-managed vault).
- **Fit Aminos is deliberately excluded** from resources (GLP-1/weight-loss
  affiliate — regulatory exposure; see `_reference/non-insurance-affiliate-links.md`).
- **Two `[TODO-LINK]` resources** (Hertz CDP number, Rakuten referral URL)
  must be replaced before launch.
- **Sample listings** (4 rows, clearly marked "(Sample)") must be replaced
  with real pre-seeded operators before launch.
- `.env*` files are permission-protected in this workspace — env var list
  lives in README.md §Setup.

## Open items (owner)

1. Register pawsassociation.com (+ .com) — both confirmed available 2026-09-24
2. Supabase project, Stripe product/webhook, SMTP2GO domain keys
3. Hertz CDP + Rakuten links; real seed listings
4. Counsel review: Terms §12 (entity/venue/arbitration), Privacy, Disclaimer
5. Logo/OG image (public/og-image.jpg is still the MPC placeholder)
6. Decide whether to add promo-code self-serve redemption (schema supports
   comp layer already; needs a redemption UI + codes table if wanted)
