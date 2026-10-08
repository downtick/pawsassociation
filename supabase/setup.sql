-- PAWSAssociation — one-shot database setup
-- Paste this whole file into the Supabase SQL Editor and press Run.
-- Safe to re-run: tables use "if not exists", policies/triggers are dropped
-- and recreated, and the seed inserts are conflict-guarded.

-- ============================================================================
-- PAWSAssociation.com — Supabase schema
-- PAWS — Professional Association of Wildlife & Sports
-- ============================================================================
-- Trade-association membership site for animal-attraction and amusement
-- operators (petting zoos, pony rides, beer burros, mobile farms).
--
-- Two membership paths:
--   1. Retail — $149/yr Stripe subscription, auto-renews, member manages own
--      billing via Stripe Customer Portal.
--   2. Comp/admin-granted — an admin creates the account (or extends access)
--      with comp_until; used for partner-provided memberships. Promo-code
--      self-serve redemption can layer on later without schema changes.
--
-- The public member DIRECTORY is the SEO engine: listings are public and
-- indexable; editing your listing, the leads inbox, the resources vault, and
-- member guides sit behind the has_access gate.
--
-- Run this whole file once against a fresh Supabase project (SQL editor or
-- `supabase db push`). Idempotent-ish: uses `create table if not exists` /
-- `create or replace` where practical.
-- ============================================================================

-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ── Member number sequence (collision-safe under concurrent signups) ───────
-- Format: PAWS-000001 (zero-padded to 6 digits).
create sequence if not exists member_number_seq start 1;

-- ============================================================================
-- profiles — every account: member or admin.
-- ============================================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  member_number text unique,                 -- PAWS-000001, set by trigger below
  role text not null default 'member'
    check (role in ('member','admin')),

  first_name text,
  last_name text,
  phone text,
  state text,

  plan text
    check (plan is null or plan in ('retail_annual','comp')),
  membership_status text not null default 'pending'
    check (membership_status in ('pending','active','past_due','lapsed','canceled')),
  billing_source text not null default 'stripe'
    check (billing_source in ('stripe','comp','manual')),
  comp_until timestamptz,                    -- admin-granted access through this date
  admin_note text,                           -- free-text, admin-only

  -- Stripe subscription fields
  stripe_customer_id text unique,
  stripe_subscription_id text,
  current_period_end timestamptz,            -- next renewal date

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles(role);
create index if not exists profiles_status_idx on profiles(membership_status);

-- Auto-assign member_number on insert if not already set
create or replace function assign_member_number()
returns trigger as $$
begin
  if new.member_number is null then
    new.member_number := 'PAWS-' || lpad(nextval('member_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_assign_member_number on profiles;
create trigger trg_assign_member_number
  before insert on profiles
  for each row execute function assign_member_number();

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Create a profile row automatically when a Supabase Auth user is created.
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- ============================================================================
-- categories — the attraction types (categorized taxonomy). One row per
-- category; drives /directory/[category] routes, filters, and the SEO grid.
-- ============================================================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                 -- 'petting-zoos' → /directory/petting-zoos
  name text not null,                        -- 'Petting Zoos'
  singular text not null,                    -- 'petting zoo' (for copy)
  intro_md text,                             -- unique landing-page copy (SEO)
  sort int not null default 0
);

-- ============================================================================
-- listings — the public member directory (separate from the account so
-- approval/visibility is independent of auth/billing).
-- profile_id NULL = a pre-seeded, UNCLAIMED listing (the "claim your listing"
-- growth lever): it still shows publicly and generates leads, which is the
-- pitch that gets the operator to claim it and join.
-- ============================================================================
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  category_id uuid references categories(id),
  slug text not null unique,
  business_name text not null,
  contact_name text,
  bio text,
  services text[] not null default '{}',     -- service-tag chips
  city text, state text, zip text,
  service_area text,                          -- e.g. "Greater Phoenix, up to 60 miles"
  phone text, website text,
  logo_url text, photo_urls text[] default '{}',
  featured boolean not null default false,
  approved boolean not null default false,    -- admin flips on after review
  search tsvector generated always as (
    to_tsvector('english',
      coalesce(business_name,'') || ' ' || coalesce(contact_name,'') || ' ' ||
      coalesce(city,'') || ' ' || coalesce(state,'') || ' ' ||
      array_to_string(services,' '))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists listings_search_idx on listings using gin(search);
create index if not exists listings_geo_idx on listings(state, city);
create index if not exists listings_category_idx on listings(category_id);

drop trigger if exists trg_listings_updated_at on listings;
create trigger trg_listings_updated_at
  before update on listings
  for each row execute function set_updated_at();

-- ============================================================================
-- leads — inquiries from the public directory lead form. The killer member
-- benefit: shown in /dashboard/leads and emailed to the member via SMTP2GO.
-- ============================================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  event_date date,
  message text,
  referrer text,                              -- tracking metadata (goes last in emails)
  page_url text,
  created_at timestamptz not null default now()
);
create index if not exists leads_listing_idx on leads(listing_id, created_at desc);

-- ============================================================================
-- member_events — unified audit log. actor_id null = system/Stripe event;
-- actor_id set = an admin did it.
-- ============================================================================
create table if not exists member_events (
  id bigint generated always as identity primary key,
  member_id uuid not null references profiles(id) on delete cascade,
  actor_id uuid references profiles(id),
  event text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);
create index if not exists member_events_timeline_idx on member_events(member_id, created_at desc);
create index if not exists member_events_actor_idx on member_events(actor_id, created_at desc);

-- ============================================================================
-- resources — members-only benefits vault (affiliate links + discount codes).
-- ============================================================================
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,                    -- Business | Travel | Personal | Health & Wellness
  description text,
  logo_url text,
  affiliate_url text not null,
  discount_code text,
  code_instructions text,
  featured boolean not null default false,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists resources_category_idx on resources(category);

create table if not exists resource_clicks (
  id bigint generated always as identity primary key,
  resource_id uuid not null references resources(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  clicked_at timestamptz not null default now()
);

-- ============================================================================
-- articles — the learning hub. PUBLIC pages at /learn (the SEO surface);
-- member_only=true rows render at /dashboard/guides instead ("index the
-- promise, gate the payoff"). Bodies live as content files; rows here power
-- listings/search/sitemap.
-- ============================================================================
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  category text,                             -- Marketing | Operations | Safety | Business
  member_only boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- email_log — SMTP2GO send record (never logs secrets like temp passwords).
-- ============================================================================
create table if not exists email_log (
  id bigint generated always as identity primary key,
  to_email text not null,
  template text not null,
  status text,
  error text,
  sent_at timestamptz not null default now()
);

-- ============================================================================
-- stripe_events — webhook idempotency guard
-- ============================================================================
create table if not exists stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- ============================================================================
-- member_access view — the SINGLE gating source of truth. Every dashboard
-- route and RLS policy checks has_access, never membership_status directly.
-- ============================================================================
create or replace view member_access with (security_invoker = true) as
select
  p.*,
  (
    p.membership_status in ('active','past_due')
    or (p.comp_until is not null and p.comp_until > now())
  ) as has_access
from profiles p;

-- ============================================================================
-- public_listings view — the SINGLE public-visibility rule. Everything the
-- anonymous web sees (directory search, category/state/city pages, member
-- profiles, sitemap) reads this view: approved listing AND owner has access.
-- SECURITY DEFINER-style barrier via security_invoker=false is NOT used;
-- instead this is a plain view over tables whose RLS policies already allow
-- the anon role to read exactly these rows (see policies below).
-- ============================================================================
create or replace view public_listings with (security_invoker = true) as
select l.*, c.slug as category_slug, c.name as category_name,
       (l.profile_id is not null) as claimed
from listings l
left join categories c on c.id = l.category_id
left join member_access m on m.id = l.profile_id
where l.approved
  and (l.profile_id is null or m.has_access);   -- unclaimed OR owner has access

-- ============================================================================
-- is_admin() — SECURITY DEFINER so it reads profiles with RLS bypassed
-- (avoids "infinite recursion detected in policy for relation profiles").
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- has_public_access(profile_id) — SECURITY DEFINER helper so the anon role's
-- listings policy can check the owner's membership without profiles being
-- readable by anon.
create or replace function public.has_public_access(p_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_profile
      and (p.membership_status in ('active','past_due')
           or (p.comp_until is not null and p.comp_until > now()))
  );
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table listings enable row level security;
alter table leads enable row level security;
alter table member_events enable row level security;
alter table resources enable row level security;
alter table resource_clicks enable row level security;
alter table articles enable row level security;
alter table email_log enable row level security;
alter table stripe_events enable row level security;

-- profiles: a user can read their own row; admins can read/manage all.
drop policy if exists "own profile read" on profiles;
create policy "own profile read" on profiles for select
  using (auth.uid() = id);
drop policy if exists "admins read all profiles" on profiles;
create policy "admins read all profiles" on profiles for select
  using (public.is_admin());
-- Deliberately NO self-update policy on profiles. Every profile write goes
-- through the service-role client in server actions; RLS cannot restrict
-- columns, so a self-update policy would also let a member set their own
-- role='admin' or extend their own comp_until.
drop policy if exists "admins manage all profiles" on profiles;
create policy "admins manage all profiles" on profiles for all
  using (public.is_admin());

revoke update (
  role, member_number, plan, membership_status, billing_source, comp_until,
  admin_note, stripe_customer_id, stripe_subscription_id, current_period_end
) on profiles from authenticated;

-- categories: public read (they're on public pages); admins manage
drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select
  using (true);
drop policy if exists "admins manage categories" on categories;
create policy "admins manage categories" on categories for all
  using (public.is_admin());

-- listings: the PUBLIC can read approved listings whose owner has access
-- (this is the directory — it must be anonymously readable). The owner can
-- read + update their own listing (approved stays server-controlled via
-- column revoke). Admins manage all.
drop policy if exists "public read approved listings" on listings;
create policy "public read approved listings" on listings for select
  using (approved and (profile_id is null or public.has_public_access(profile_id)));
drop policy if exists "owner reads own listing" on listings;
create policy "owner reads own listing" on listings for select
  using (auth.uid() = profile_id);
drop policy if exists "owner updates own listing" on listings;
create policy "owner updates own listing" on listings for update
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
drop policy if exists "owner inserts own listing" on listings;
create policy "owner inserts own listing" on listings for insert
  with check (auth.uid() = profile_id);
drop policy if exists "admins manage listings" on listings;
create policy "admins manage listings" on listings for all
  using (public.is_admin());

revoke update (approved, featured, profile_id) on listings from authenticated;

-- leads: inserted only via the server route (service-role client after
-- Turnstile/honeypot checks — no anon insert policy on purpose). Readable
-- by the listing owner and admins.
drop policy if exists "owner reads own leads" on leads;
create policy "owner reads own leads" on leads for select
  using (exists (
    select 1 from listings l where l.id = listing_id and l.profile_id = auth.uid()
  ));
drop policy if exists "admins read all leads" on leads;
create policy "admins read all leads" on leads for select
  using (public.is_admin());

-- member_events: admins read everything; a member can read their own timeline
drop policy if exists "admins read all events" on member_events;
create policy "admins read all events" on member_events for select
  using (public.is_admin());
drop policy if exists "own timeline read" on member_events;
create policy "own timeline read" on member_events for select
  using (auth.uid() = member_id);
drop policy if exists "admins write events" on member_events;
create policy "admins write events" on member_events for insert
  with check (public.is_admin());

-- resources: the PAYWALL in the DB — active members (or admins) only
drop policy if exists "active members read resources" on resources;
create policy "active members read resources" on resources for select
  using (
    active and exists (
      select 1 from member_access m where m.id = auth.uid() and (m.has_access or m.role = 'admin')
    )
  );
drop policy if exists "admins manage resources" on resources;
create policy "admins manage resources" on resources for all
  using (public.is_admin());

drop policy if exists "members log clicks" on resource_clicks;
create policy "members log clicks" on resource_clicks for insert
  with check (auth.uid() = profile_id);
drop policy if exists "admins read clicks" on resource_clicks;
create policy "admins read clicks" on resource_clicks for select
  using (public.is_admin());

-- articles: public rows are anonymously readable (/learn is the SEO surface);
-- member_only rows require has_access.
drop policy if exists "public read public articles" on articles;
create policy "public read public articles" on articles for select
  using (published and not member_only);
drop policy if exists "active members read member articles" on articles;
create policy "active members read member articles" on articles for select
  using (
    published and member_only and exists (
      select 1 from member_access m where m.id = auth.uid() and (m.has_access or m.role = 'admin')
    )
  );
drop policy if exists "admins manage articles" on articles;
create policy "admins manage articles" on articles for all
  using (public.is_admin());

-- email_log / stripe_events: admin read; writes are server (service-role) only
drop policy if exists "admins read email log" on email_log;
create policy "admins read email log" on email_log for select
  using (public.is_admin());
drop policy if exists "admins read stripe events" on stripe_events;
create policy "admins read stripe events" on stripe_events for select
  using (public.is_admin());

-- ============================================================================
-- Seed: first admin. Replace the email, then run once after your first
-- Supabase Auth signup.
-- ============================================================================
-- update profiles set role = 'admin' where email = 'you@pawsassociation.com';

-- ============================================================================
-- PAWSAssociation.com — seed data
-- Run AFTER schema.sql. Mirrors lib/data/resourcesSeed.ts and
-- content/articles/* — keep them in sync when adding perks or articles.
-- ============================================================================

-- ── Categories (the taxonomy — drives /directory/[category] routes) ─────────
insert into categories (slug, name, singular, sort, intro_md) values
('petting-zoos', 'Petting Zoos', 'petting zoo', 10,
 'Mobile and on-site petting zoos bring gentle, well-cared-for animals to birthday parties, schools, fairs, and community events. PAWS member petting zoos agree to our animal-care and safety standards.'),
('pony-rides', 'Pony Rides', 'pony ride operator', 20,
 'Pony ride operators provide hand-led rides for children at parties, fairs, and festivals. PAWS member operators agree to our safety standards, including helmets on request and trained handlers.'),
('beer-burros', 'Beer Burros', 'beer burro service', 30,
 'Beer burros — friendly mini donkeys with drink-service saddlebags — are the hit of weddings, corporate events, and festivals. PAWS member services agree to our animal-welfare and event-safety standards.'),
('mobile-farms', 'Mobile Farms', 'mobile farm', 40,
 'Mobile farms bring the barnyard to schools, daycares, fairs, and community events — a hands-on farm experience anywhere. PAWS member farms agree to our animal-care and safety standards.')
on conflict (slug) do nothing;

-- ── Sample listings (UNCLAIMED — profile_id null — obviously-fictional; ─────
-- replace with real pre-seeded operators before launch) ─────────────────────
with cat as (select slug, id from categories)
insert into listings (slug, business_name, contact_name, category_id, city, state, zip, services, bio, service_area, approved)
values
('sample-sunny-acres-petting-zoo', 'Sunny Acres Petting Zoo (Sample)', 'Sample Owner',
 (select id from cat where slug='petting-zoos'), 'Phoenix', 'AZ', '85004',
 '{Birthday parties,School visits,Fairs & festivals,Insured}',
 'Sample seed listing — mobile petting zoo with goats, sheep, bunnies, and ducks.',
 'Greater Phoenix, up to 60 miles', true),
('sample-happy-trails-pony-rides', 'Happy Trails Pony Rides (Sample)', 'Sample Owner',
 (select id from cat where slug='pony-rides'), 'Fort Worth', 'TX', '76102',
 '{Hand-led rides,Helmets provided,Birthday parties,Insured}',
 'Sample seed listing — hand-led pony rides for ages 2–10 with trained handlers.',
 'DFW metro', true),
('sample-cheers-burros', 'Cheers Burros (Sample)', 'Sample Owner',
 (select id from cat where slug='beer-burros'), 'Scottsdale', 'AZ', '85251',
 '{Weddings,Corporate events,Photo packages,Insured}',
 'Sample seed listing — two mini donkeys with drink-service saddlebags for weddings and events.',
 'Phoenix & Scottsdale', true),
('sample-barnyard-on-wheels', 'Barnyard on Wheels (Sample)', 'Sample Owner',
 (select id from cat where slug='mobile-farms'), 'Nashville', 'TN', '37203',
 '{School programs,Daycare visits,Fairs & festivals,Educational}',
 'Sample seed listing — traveling farm experience with a full barnyard crew.',
 'Middle Tennessee', true)
on conflict (slug) do nothing;

-- ── Resources (members-only benefits vault) ────────────────────────────────
-- Live links reused from the portfolio master list
-- (websites/_reference/non-insurance-affiliate-links.md). Three rows marked
-- [TODO-LINK] need the real affiliate URL/code before launch: Hertz CDP,
-- Rakuten, Fit Aminos.
insert into resources (name, category, description, affiliate_url, discount_code, code_instructions, featured, sort) values
-- Travel
('Hertz Business Rentals', 'Travel', 'Save on rental cars and trucks for hauling to events — enter the association CDP number when you book.', 'https://www.hertz.com', '[TODO-LINK: CDP number]', 'On hertz.com, add the CDP number in the "Discount/CDP/Promo Codes" box at booking. The discount applies to business and personal rentals.', true, 10),
('Rakuten Cash Back', 'Travel', 'Cash back on hotels, travel, and everyday shopping at thousands of stores.', 'https://www.rakuten.com', null, '[TODO-LINK: replace with referral URL]', false, 20),
('Wise Multi-Currency Card', 'Travel', 'Spend with no foreign transaction fee when you travel, and send money abroad at the real mid-market rate.', 'https://wise.com/invite/ilpc/davidb13606', null, null, false, 30),

-- Business
('Hire a Virtual Assistant', 'Business', 'Post a job ad and hire a virtual assistant for bookings, email, and back-office work — without full-time overhead. Most operators start with 10 hours a week.', 'http://store.onlinejobs.ph/?aid=128288', null, null, true, 10),
('Freelance Project Marketplace', 'Business', 'Freelancers for any one-off project — a flyer design, a logo touch-up, a website tweak — starting at a few dollars.', 'https://fvrr.co/3jOTSv7', null, null, false, 20),
('SiteGround Hosting', 'Business', 'Fast, reliable website hosting for your attraction''s site, built for speed and uptime.', 'https://www.siteground.com/recommended?referrer_id=8203857', null, null, true, 30),
('QuickBooks', 'Business', 'Accounting software built for small business — invoicing, bookkeeping, and mileage tracking for event runs.', 'https://quickbooks.grsm.io/servicelocator', null, null, false, 40),
('Envato Elements', 'Business', 'Unlimited stock photos, video, fonts, and design templates for your marketing — one subscription.', 'https://1.envato.market/7mRmRy', null, null, false, 50),
('iPostal1 Virtual Mailbox', 'Business', 'A real street address for your business mail — professional address without a physical office.', 'https://ipostal1.com/?ref=4283', null, null, false, 60),
('InCorp Business Formation', 'Business', 'Form your LLC or corporation and get registered agent service.', 'https://www.incorp.com/default.aspx?referredbyaccountid=31890', null, null, false, 70),

-- Animals & Home
('Pet & Livestock Medications', 'Animals & Home', 'Discounted animal medications shipped to your door, up to 25% off.', 'https://www.dpbolvw.net/click-9121627-12521727', null, null, true, 10),
('Tire Rack', 'Animals & Home', 'Member pricing on truck and trailer tires, with expert reviews to help you choose.', 'https://www.kqzyfj.com/click-9121627-14310855', null, null, false, 20),
('Home Warranty', 'Animals & Home', 'A home warranty plan covering major systems and appliances, with $50 off.', 'https://www.anrdoezrs.net/click-9121627-13073571', '$50 off', null, false, 30),

-- Health & Wellness  (Fit Aminos deliberately excluded — see
-- _reference/non-insurance-affiliate-links.md: dropped, GLP-1/weight-loss
-- affiliate carries different regulatory exposure)
('Groomie Head & Body Trimmer', 'Health & Wellness', 'An at-home head and body trimmer with a member discount.', 'https://www.groomie.club/DAVID15941', '10% off with this link', null, false, 10),
('BulkSupplements', 'Health & Wellness', 'Discounted bulk vitamins and supplements, with a built-in checkout discount.', 'https://shareasale.com/r.cfm?b=602574&u=1690228&m=53326&urllink=&afftrack=', null, null, false, 20)
on conflict do nothing;

-- ── Articles ────────────────────────────────────────────────────────────────
-- Public (/learn — the SEO surface; member_only=false) + member guides
-- (/dashboard/guides; member_only=true). Bodies live in content/articles/*.
insert into articles (slug, title, summary, category, member_only) values
-- Public: consumer-intent (people hiring an attraction)
('how-to-hire-a-petting-zoo', 'How to Hire a Petting Zoo for Your Event', 'What to ask, what it costs, and the insurance and safety standards a professional petting zoo should meet.', 'Hiring Guides', false),
('what-is-a-beer-burro', 'What Is a Beer Burro? (And How to Book One)', 'The wedding trend explained — what a beer burro service includes, typical pricing, and questions to ask before you book.', 'Hiring Guides', false),
('pony-ride-safety-checklist', 'Pony Ride Safety: What Parents Should Look For', 'Helmets, hand-leading, trained handlers, and the safety practices that separate professional operators from hobbyists.', 'Safety', false),
('mobile-farm-school-visit-guide', 'Bringing a Mobile Farm to Your School: A Planning Guide', 'Space, scheduling, permission slips, and hygiene stations — everything a school or daycare needs to plan a farm visit.', 'Hiring Guides', false),
-- Public: operator-intent (teasers that soft-sell membership)
('start-a-petting-zoo-business', 'How to Start a Mobile Petting Zoo Business', 'Licenses, USDA considerations, animal selection, transport, and what it really costs to get started.', 'Business', false),
('event-operator-insurance-basics', 'Insurance Basics for Animal-Attraction Operators', 'The coverage types event venues expect — general liability, animal liability, and certificates of insurance — explained in plain English.', 'Business', false),
-- Member-only guides (the gated payoff)
('get-booked-by-venues', 'The Venue Outreach Playbook: Get on Preferred-Vendor Lists', 'Scripts and a step-by-step outreach system for getting your attraction onto wedding-venue and event-planner preferred lists.', 'Marketing', true),
('price-your-attraction', 'Pricing Your Attraction: Rate Sheets That Win Bookings', 'How to structure hourly rates, travel fees, and add-ons — with a fill-in rate-sheet template.', 'Business', true),
('event-day-run-sheet', 'The Event-Day Run Sheet (Printable)', 'A printable checklist covering load-out, setup, animal rotation, breaks, waivers, and teardown.', 'Operations', true),
('review-engine-for-operators', 'Get 5-Star Reviews on Autopilot', 'The post-event follow-up sequence that turns happy hosts into Google reviews — with copy-paste templates.', 'Marketing', true)
on conflict (slug) do nothing;
