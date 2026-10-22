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
- **New tables need explicit GRANTs (Supabase change, 2026-10-30).** The
  current tables kept their old automatic grants and are protected by RLS
  (audited 2026-10-22: every table has RLS on, both views are
  `security_invoker`, and the anon role reads 0 rows from every private
  table). Any table added after Oct 30 is invisible to the site (error
  42501) until granted. Fix per table — enable RLS + policies, then grant
  only the roles/operations the app uses. NEVER run the blanket
  `grant … on all tables in schema public to anon, authenticated` fix.
  New security-definer functions: `revoke execute … from public, anon`
  unless anon genuinely needs them (see `admin_user_activity()`).
- `.env*` files are permission-protected in this workspace — env var list
  lives in README.md §Setup.

## Open items (owner)

1. Register pawsassociation.com (+ .com) — both confirmed available 2026-09-24
2. Stripe product/webhook (Supabase + SMTP2GO done 2026-10-21: SMTP2GO
   domain verified via 3 CNAMEs at SiteGround, Supabase custom SMTP on,
   3 branded auth templates loaded)
7. **Real office@ inbox** — right now there is NO mailbox; SiteGround's
   catch-all (*@pawsassociation.com) forwards everything to
   david@yesbaker.com (owner set 2026-10-21, temporary). Plan: add
   pawsassociation.com as an alias/secondary domain on the owner's paid
   Google Workspace and create office@ there. When switching: replace the
   3 SiteGround MX records with Google's, change SPF to include
   `_spf.google.com` (keep it to ONE SPF TXT record), add Google DKIM, and
   turn the catch-all back to discard (catch-alls forward spam and hurt
   the forwarding reputation). The SMTP2GO CNAMEs are unaffected.
   Then sign office@ up at /join and make it admin.
8. Make office@pawsassociation.com an admin once it can receive the
   confirmation email (david@yesbaker.com is admin as of 2026-10-21)
9. Re-set backup secret DB_URL_PAWSASSOCIATION — see HANDOFF-supabase-backup.md
3. Hertz CDP + Rakuten links; real seed listings
4. Counsel review: Terms §12 (entity/venue/arbitration), Privacy, Disclaimer
5. Logo/OG image (public/og-image.jpg is still the MPC placeholder)
6. Decide whether to add promo-code self-serve redemption (schema supports
   comp layer already; needs a redemption UI + codes table if wanted)
