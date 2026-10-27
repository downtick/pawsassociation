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
- **Table access is explicit GRANTs** (schema.sql "Table privileges",
  applied live 2026-10-22). Supabase stops auto-granting new tables on
  2026-10-30, so a NEW table is invisible to the site (error 42501) until
  you add RLS + policies AND a grant there. Rule: grant a role an operation
  only where a policy allows it. Member listing edits are column-level
  grants — approved/featured are deliberately absent (a column REVOKE after
  a table-wide grant does nothing in Postgres; that's how members could
  self-approve before this fix). NEVER run the blanket
  `grant … on all tables in schema public to anon, authenticated`.
  New security-definer functions: `revoke execute … from public, anon`
  unless anon genuinely needs them (see `admin_user_activity()`).
- **public_listings must use `has_public_access()`**, never a join to
  member_access/profiles — anon can't read profiles, so a join silently
  hides every claimed (paid) listing from visitors (bug fixed 2026-10-22).
- `.env*` files are permission-protected in this workspace — env var list
  lives in README.md §Setup.

## Status 2026-10-26 — LIVE for signups

Live Stripe verified end to end (owner's real signup: charge, webhook →
welcome email, portal cancel-at-period-end). Pricing: $149/yr charged at
signup, 7-day money-back guarantee (first-time members, self-serve refund
on /dashboard/billing), 30-day refund after an automatic renewal. Admin
notices go to ADMIN_NOTIFY_EMAIL = office@ + owner (comma-separated).
Stripe support email = office@. Hertz CDP 2105180 + Rakuten referral live.

## Open items — resume here

1. ~~Mailing address~~ — already correct in lib/siteConfig.ts (9169 W State St #1888, Garden City, ID 83714).
2. ~~Listing CSV~~ — DONE 2026-10-26: 5 ACT! CRM exports (petting zoos, pony rides,
   beer burros, reptile shows → reptile-exhibits, animal education →
   wildlife-education) → 3,262 unclaimed listings, source `act-crm-2026-10-26`
   in listing_private_contacts. 2,487 live (clear business names); **775 PENDING
   in /admin/listings** (look like private people's names — approve real
   businesses only). 34 more auto-approved rows that contained the contact's
   own name were moved to pending too (owner: never publish private people's
   names) → 2,453 live / 809 pending. Skipped: no company (753), no city/state (409), bad state (12).
   The 4 "(Sample)" listings were set approved=false (hidden, not deleted).
3. ~~Nightly backup~~ — FIXED 2026-10-26, first successful PAWS backup run 40442828815.
   (old note:) **Nightly backup failing** — re-set GitHub secret DB_URL_PAWSASSOCIATION
   in downtick/supabase-backups (steps: HANDOFF-supabase-backup.md). Owner pastes
   the Session pooler URI (contains DB password) — Claude never handles it.
4. ~~Test member~~ — owner keeps office+test1.
5. ~~Admin resources rows~~ — Hertz/Rakuten DB rows updated 2026-10-26.
6. Counsel review of Terms (§3 money terms, §12 indemnity), Privacy, Disclaimer.
7. ~~Logo / OG image~~ — DONE 2026-10-26: paw mark (app/icon.png, header/footer), public/og-image.jpg; Stripe branding PNGs in public/brand/ (owner uploads to Stripe).
8. ~~Google DKIM~~ — done by owner 2026-10-26 (MX, SPF, DKIM complete).
9. ~~QR on flyer + 3 signs~~ — DONE: /go/sign, /go/flyer → /directory (lib/pdf/findQr.ts). Course is now 20 lessons.
10. Optional: promo-code self-serve redemption (schema supports comp layer).

## Partner offer: PAWSDEAL10 (2026-10-26)

$10 off the first year, for PettingZooInsurance.com leads. Handoff for that
session: websites/pettingzooinsurance/HANDOFF-paws-offer.md. PAWS side: the
/go/pzi and /go/pzi-email short links (utm_campaign pawsdeal10). Coupon is LIVE in Stripe (created + tested at $139, 2026-10-26): $10 fixed, duration once, promo code
PAWSDEAL10, first-time order only. Checkout already allows promotion codes.
