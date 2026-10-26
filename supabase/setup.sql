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

-- array_to_string() is only STABLE, and generated columns require IMMUTABLE
-- expressions, so the listings.search column goes through this wrapper.
-- (Safe: the separator and input fully determine the output.)
create or replace function public.immutable_array_to_string(text[], text)
returns text language sql immutable parallel safe as $$ select array_to_string($1, $2) $$;

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
      public.immutable_array_to_string(services,' '))
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
-- listing_categories — EVERY attraction type a listing offers beyond its main
-- one (listings.category_id). A petting zoo that also does goat yoga and beer
-- burros has one main type + two rows here. Directory filters match either.
-- ============================================================================
create table if not exists listing_categories (
  listing_id uuid not null references listings(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (listing_id, category_id)
);
create index if not exists listing_categories_category_idx on listing_categories(category_id);

-- ============================================================================
-- listing_private_contacts — ADMIN-ONLY contact details for pre-seeded
-- (unclaimed) listings: the owner's email for claim invites and outreach,
-- plus phone/website that must NOT be public until the business claims and
-- joins. Kept off `listings` entirely, because anything on `listings` is
-- readable through the public directory API. On claim, an admin copies
-- phone/website onto the listing.
-- ============================================================================
create table if not exists listing_private_contacts (
  listing_id uuid primary key references listings(id) on delete cascade,
  owner_name text,
  address_line1 text,                         -- street address: mailing/outreach
  address_line2 text,                         --   only, NEVER shown publicly
  email text,
  phone text,
  website text,
  notes text,
  source text,                                -- e.g. 'mailing-list-2026-10'
  invited_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists listing_private_contacts_email_idx on listing_private_contacts(lower(email));

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
-- security_invoker = true, so the caller's RLS applies. The owner check MUST
-- go through has_public_access() (SECURITY DEFINER): joining member_access
-- here silently hid every CLAIMED listing from visitors, because the anon
-- role can't read profiles, so the joined has_access was always null.
-- ============================================================================
create or replace view public_listings with (security_invoker = true) as
select l.*, c.slug as category_slug, c.name as category_name,
       (l.profile_id is not null) as claimed,
       -- main type + every "also offers" type, for directory filtering
       array(
         select distinct c2.slug from categories c2
         where c2.id = l.category_id
            or c2.id in (select lc.category_id from listing_categories lc where lc.listing_id = l.id)
       ) as category_slugs
from listings l
left join categories c on c.id = l.category_id
where l.approved
  and (l.profile_id is null or public.has_public_access(l.profile_id));   -- unclaimed OR owner has access

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

-- admin_user_activity() — login facts that live in the auth schema, for the
-- admin members pages: whether the email was verified, last sign-in, and last
-- activity. Supabase refreshes a session roughly hourly while someone is
-- using the site, so the newest session refresh is "last active" without
-- writing anything on every page view. Service role ONLY: it exposes every
-- account's login history, so anon/authenticated can't execute it.
create or replace function public.admin_user_activity()
returns table (
  id uuid,
  email_confirmed_at timestamptz,
  confirmation_sent_at timestamptz,
  last_sign_in_at timestamptz,
  last_active_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    u.id,
    u.email_confirmed_at,
    u.confirmation_sent_at,
    u.last_sign_in_at,
    greatest(
      u.last_sign_in_at,
      (select max(greatest(s.updated_at, s.refreshed_at at time zone 'UTC'))
         from auth.sessions s where s.user_id = u.id)
    )
  from auth.users u;
$$;

revoke all on function public.admin_user_activity() from public, anon, authenticated;
grant execute on function public.admin_user_activity() to service_role;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table listings enable row level security;
alter table leads enable row level security;
alter table listing_categories enable row level security;
alter table listing_private_contacts enable row level security;
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

-- (No member writes to profiles at all — see "Table privileges" below.)

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

-- Members can't approve/feature themselves: the owner policies above allow
-- their own row, and "Table privileges" below grants only the editable
-- columns. (A column REVOKE after a table-wide grant does nothing in
-- Postgres, which is why this is done with column-level GRANTs.)

-- listing_categories: public read (it only says which types a listing
-- offers; listing visibility is still enforced by listings' own policy).
-- The owner manages their own listing's rows; admins manage all.
drop policy if exists "public read listing categories" on listing_categories;
create policy "public read listing categories" on listing_categories for select
  using (true);
drop policy if exists "owner manages own listing categories" on listing_categories;
create policy "owner manages own listing categories" on listing_categories for all
  using (exists (select 1 from listings l where l.id = listing_id and l.profile_id = auth.uid()))
  with check (exists (select 1 from listings l where l.id = listing_id and l.profile_id = auth.uid()));
drop policy if exists "admins manage listing categories" on listing_categories;
create policy "admins manage listing categories" on listing_categories for all
  using (public.is_admin());

-- listing_private_contacts: admins only. No public or owner read, ever.
drop policy if exists "admins manage private contacts" on listing_private_contacts;
create policy "admins manage private contacts" on listing_private_contacts for all
  using (public.is_admin());

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
-- Table privileges — explicit and least-privilege.
--
-- Supabase stopped auto-granting new public tables to the API roles
-- (new projects from 2026-05-30, existing projects from 2026-10-30), so a
-- fresh project needs these or the site gets "permission denied" (42501).
-- GRANTs decide whether a role may touch a table at all; RLS decides which
-- rows. Rule: grant a role an operation only where a policy above allows it
-- for that role. NEVER `grant … on all tables in schema public to anon` —
-- that blanket fix is how thousands of Supabase apps leaked data.
-- Server code that uses the service-role key (admin actions, webhooks, the
-- lead form) bypasses all of this; only browser/member-session queries
-- need the grants below. Re-runnable: starts from a clean slate.
-- ============================================================================
revoke all on all tables in schema public from anon, authenticated;

-- Public directory (signed-out visitors and members alike)
grant select on categories, listings, listing_categories, public_listings
  to anon, authenticated;

-- Signed-in reads; RLS limits each to the member's own rows (or admins).
-- articles is signed-in only: the public learning hub renders from
-- content/articles, and the member-article policy reads member_access,
-- which anon can't — an anon grant would only produce errors.
grant select on articles, profiles, member_access, leads, member_events, resources,
  resource_clicks, email_log, stripe_events, listing_private_contacts
  to authenticated;

-- Member self-service listing editor (lib/listing-actions.ts). approved and
-- featured are deliberately absent: only admins (service role) set them.
grant insert (profile_id, slug, category_id, business_name, contact_name, bio,
  services, city, state, zip, service_area, phone, website, logo_url, photo_urls)
  on listings to authenticated;
grant update (category_id, business_name, contact_name, bio, services, city,
  state, zip, service_area, phone, website, logo_url, photo_urls)
  on listings to authenticated;
grant insert, delete on listing_categories to authenticated;
grant insert on resource_clicks to authenticated;

grant all on all tables in schema public to service_role;

-- ============================================================================
-- Seed: first admin. Replace the email, then run once after your first
-- Supabase Auth signup.
-- ============================================================================
-- update profiles set role = 'admin' where email = 'you@pawsassociation.com';

-- ============================================================================
-- PAWSAssociation.org — seed data
-- Run AFTER schema.sql. Mirrors lib/data/resourcesSeed.ts and
-- content/articles/* — keep them in sync when adding perks or articles.
-- ============================================================================

-- ── Categories (the taxonomy — drives /directory/[category] routes) ─────────
-- Generated from lib/directory.ts — edit there, then regenerate this block.
insert into categories (slug, name, singular, sort, intro_md) values
('petting-zoos', 'Petting Zoos', 'petting zoo', 10,
 'Mobile and on-site petting zoos for parties, schools, fairs, and community events. Search free and send your request straight to the operator.'),
('pony-rides', 'Pony Rides', 'pony ride operator', 20,
 'Hand-led pony rides for children at parties, fairs, and festivals. Search free and send your request straight to the operator.'),
('beer-burros', 'Beer Burros', 'beer burro service', 30,
 'Friendly mini donkeys with drink-service saddlebags for weddings and events. Search free and send your request straight to the operator.'),
('mobile-farms', 'Mobile Farms', 'mobile farm', 40,
 'The barnyard comes to you — schools, daycares, fairs, and community events. Search free and send your request straight to the operator.'),
('goat-yoga', 'Goat Yoga', 'goat yoga provider', 50,
 'Yoga sessions with friendly goats for studios, parties, corporate wellness days, and festivals. Search free and send your request straight to the operator.'),
('reptile-exhibits', 'Reptile Shows & Exhibits', 'reptile exhibitor', 60,
 'Hands-on reptile shows and exhibits for schools, libraries, parties, and festivals. Search free and send your request straight to the operator.'),
('reindeer-visits', 'Reindeer Visits', 'reindeer display', 70,
 'Live reindeer for holiday events, tree lots, markets, and Santa photo sessions. Search free and send your request straight to the operator.'),
('alpaca-llama-visits', 'Alpaca & Llama Visits', 'alpaca and llama visit', 80,
 'Gentle alpacas and llamas for parties, senior communities, schools, and photo sessions. Search free and send your request straight to the operator.'),
('camel-rides', 'Camel Rides', 'camel ride operator', 90,
 'Camel rides and nativity camels for fairs, festivals, churches, and private events. Search free and send your request straight to the operator.'),
('pig-races', 'Pig Races', 'pig race show', 100,
 'Racing pig shows for county fairs, festivals, and community events. Search free and send your request straight to the operator.'),
('birds-of-prey', 'Birds of Prey Shows', 'birds of prey show', 110,
 'Owl, hawk, and falcon programs for schools, libraries, nature centers, and festivals. Search free and send your request straight to the operator.'),
('exotic-animal-encounters', 'Exotic Animal Encounters', 'exotic animal encounter', 120,
 'Traveling encounters with exotic animals for schools, parties, and corporate events. Search free and send your request straight to the operator.'),
('wildlife-education', 'Wildlife Education Programs', 'wildlife education program', 130,
 'Educational programs with ambassador animals for classrooms, libraries, and camps. Search free and send your request straight to the operator.'),
('animal-shows', 'Animal Shows & Performances', 'animal show', 140,
 'Trained-animal acts and dog shows for fairs, festivals, and school assemblies. Search free and send your request straight to the operator.'),
('hayrides-carriage-rides', 'Hayrides & Carriage Rides', 'hayride or carriage ride service', 150,
 'Hayrides, wagon rides, and horse-drawn carriages for fall festivals, weddings, and holiday events. Search free and send your request straight to the operator.'),
('live-nativity', 'Live Nativity Animals', 'live nativity animal provider', 160,
 'Sheep, donkeys, goats, and camels for church and community nativity scenes. Search free and send your request straight to the operator.')
on conflict (slug) do update set name = excluded.name, singular = excluded.singular,
  sort = excluded.sort, intro_md = excluded.intro_md;

-- ── Sample listings (UNCLAIMED — profile_id null — obviously-fictional; ─────
-- replace with real pre-seeded operators before launch) ─────────────────────
with cat as (select slug, id from categories)
insert into listings (slug, business_name, contact_name, category_id, city, state, zip, services, bio, service_area, approved)
values
('sample-sunny-acres-petting-zoo', 'Sunny Acres Petting Zoo (Sample)', 'Sample Owner',
 (select id from cat where slug='petting-zoos'), 'Phoenix', 'AZ', '85004',
 '{Birthday parties,School visits,Fairs & festivals}',
 'Sample seed listing — mobile petting zoo with goats, sheep, bunnies, and ducks.',
 'Greater Phoenix, up to 60 miles', true),
('sample-happy-trails-pony-rides', 'Happy Trails Pony Rides (Sample)', 'Sample Owner',
 (select id from cat where slug='pony-rides'), 'Fort Worth', 'TX', '76102',
 '{Hand-led rides,Helmets provided,Birthday parties}',
 'Sample seed listing — hand-led pony rides for ages 2–10 with trained handlers.',
 'DFW metro', true),
('sample-cheers-burros', 'Cheers Burros (Sample)', 'Sample Owner',
 (select id from cat where slug='beer-burros'), 'Scottsdale', 'AZ', '85251',
 '{Weddings,Corporate events,Photo packages}',
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

-- Financial
('Life Insurance Quotes', 'Financial', 'Get a term life quote online in minutes — coverage for you and your family, with no obligation.', 'https://agents.ethoslife.com/invite/bib', null, null, true, 10),

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
('review-engine-for-operators', 'Get 5-Star Reviews on Autopilot', 'The post-event follow-up sequence that turns happy hosts into Google reviews — with copy-paste templates.', 'Marketing', true),
('google-business-profile-for-mobile-operators', 'Google Business Profile for Mobile Animal Businesses', 'Set up and run a Google Business Profile when you don''t have a storefront.', 'Marketing', true),
('seasonal-marketing-calendar', 'The Seasonal Marketing Calendar for Animal Attractions', 'What to market each season, six to eight weeks before the wave arrives.', 'Marketing', true),
('schools-daycares-libraries', 'Booking Schools, Daycares, and Libraries', 'How institutions buy, the paperwork they ask for, who to contact, and the pitch email.', 'Marketing', true),
('fairs-and-festivals', 'Fairs and Festivals: Vendor Applications That Get Accepted', 'Finding events, applications, animal health paperwork, pricing, and turning crowds into bookings.', 'Marketing', true),
('facebook-groups-and-parent-groups', 'Facebook Groups and Parent Groups: Get Recommended, Not Banned', 'Showing up when a local parent asks for a petting zoo or pony rides.', 'Marketing', true),
('referral-partners', 'Referral Partners: Bounce Houses, Planners, and Photographers', 'The businesses that talk to your customers every weekend, and how to work with them.', 'Marketing', true),
('short-videos-that-book-parties', 'Short Videos That Book Parties', 'What to film, filming alone, captions local searchers find, and parent permission.', 'Marketing', true)
on conflict (slug) do nothing;
