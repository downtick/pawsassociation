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
