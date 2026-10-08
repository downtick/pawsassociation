export type Role = "member" | "admin";
export type MembershipStatus = "pending" | "active" | "past_due" | "lapsed" | "canceled";
export type Plan = "retail_annual" | "comp" | null;
export type BillingSource = "stripe" | "comp" | "manual";

export interface Profile {
  id: string;
  email: string;
  member_number: string | null;
  role: Role;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  state: string | null;
  plan: Plan;
  membership_status: MembershipStatus;
  billing_source: BillingSource;
  comp_until: string | null;
  admin_note: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberAccess extends Profile {
  has_access: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  singular: string;
  intro_md: string | null;
  sort: number;
}

export interface Listing {
  id: string;
  profile_id: string | null; // null = pre-seeded, unclaimed listing
  category_id: string | null;
  slug: string;
  business_name: string;
  contact_name: string | null;
  bio: string | null;
  services: string[];
  city: string | null;
  state: string | null;
  zip: string | null;
  service_area: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  photo_urls: string[];
  featured: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

/** Row shape of the public_listings view (listing + joined category + claimed flag). */
export interface PublicListing extends Listing {
  category_slug: string | null;
  category_name: string | null;
  claimed: boolean;
}

export interface Lead {
  id: string;
  listing_id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  message: string | null;
  referrer: string | null;
  page_url: string | null;
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string | null;
  logo_url: string | null;
  affiliate_url: string;
  discount_code: string | null;
  code_instructions: string | null;
  featured: boolean;
  active: boolean;
  sort: number;
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  member_only: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
}

export interface MemberEvent {
  id: number;
  member_id: string;
  actor_id: string | null;
  event: string;
  detail: Record<string, unknown> | null;
  created_at: string;
}
