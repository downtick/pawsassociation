// Member-benefits vault seed data — curated for animal-attraction and
// amusement operators. Live links sourced from
// websites/_reference/non-insurance-affiliate-links.md (Hertz CDP and the
// Rakuten referral link supplied by the owner 2026-10-26). Fit Aminos is deliberately excluded per that file's
// note (dropped, GLP-1/weight-loss drug affiliate — different regulatory
// exposure than vitamins/grooming).
//
// This is the source of truth for the /supabase/seed.sql INSERT statements —
// if you add/remove a perk, update both files together.
export interface ResourceSeed {
  name: string;
  category: "Travel" | "Business" | "Financial" | "Animals & Home" | "Health & Wellness";
  description: string;
  affiliate_url: string;
  discount_code?: string;
  code_instructions?: string;
  featured?: boolean;
  sort: number;
}

export const RESOURCES_SEED: ResourceSeed[] = [
  // ── Travel ──
  { name: "Hertz Business Rentals", category: "Travel", description: "Save on rental cars and trucks for hauling to events — enter the association CDP number when you book.", affiliate_url: "https://www.hertz.com", discount_code: "2105180", code_instructions: "On hertz.com, add the CDP number in the “Discount/CDP/Promo Codes” box at booking. The discount applies to business and personal rentals.", featured: true, sort: 10 },
  { name: "Rakuten Cash Back", category: "Travel", description: "Cash back on hotels, travel, and everyday shopping at thousands of stores.", affiliate_url: "https://www.rakuten.com/r/DOWNTI5?eeid=28187", code_instructions: "Join Rakuten through this link, then start your shopping or travel booking from Rakuten to earn cash back.", sort: 20 },
  { name: "Wise Multi-Currency Card", category: "Travel", description: "Spend with no foreign transaction fee when you travel, and send money abroad at the real mid-market rate.", affiliate_url: "https://wise.com/invite/ilpc/davidb13606", sort: 30 },

  // ── Business ──
  { name: "Hire a Virtual Assistant", category: "Business", description: "Post a job ad and hire a virtual assistant for bookings, email, and back-office work — without full-time overhead. Most operators start with 10 hours a week.", affiliate_url: "http://store.onlinejobs.ph/?aid=128288", featured: true, sort: 10 },
  { name: "Freelance Project Marketplace", category: "Business", description: "Freelancers for any one-off project — a flyer design, a logo touch-up, a website tweak — starting at a few dollars.", affiliate_url: "https://fvrr.co/3jOTSv7", sort: 20 },
  { name: "SiteGround Hosting", category: "Business", description: "Fast, reliable website hosting for your attraction's site, built for speed and uptime.", affiliate_url: "https://www.siteground.com/recommended?referrer_id=8203857", featured: true, sort: 30 },
  { name: "QuickBooks", category: "Business", description: "Accounting software built for small business — invoicing, bookkeeping, and mileage tracking for event runs.", affiliate_url: "https://quickbooks.grsm.io/servicelocator", sort: 40 },
  { name: "Envato Elements", category: "Business", description: "Unlimited stock photos, video, fonts, and design templates for your marketing — one subscription.", affiliate_url: "https://1.envato.market/7mRmRy", sort: 50 },
  { name: "iPostal1 Virtual Mailbox", category: "Business", description: "A real street address for your business mail — professional address without a physical office.", affiliate_url: "https://ipostal1.com/?ref=4283", sort: 60 },
  { name: "InCorp Business Formation", category: "Business", description: "Form your LLC or corporation and get registered agent service.", affiliate_url: "https://www.incorp.com/default.aspx?referredbyaccountid=31890", sort: 70 },

  // ── Financial ──
  { name: "Life Insurance Quotes", category: "Financial", description: "Get a term life quote online in minutes — coverage for you and your family, with no obligation.", affiliate_url: "https://agents.ethoslife.com/invite/bib", featured: true, sort: 10 },

  // ── Animals & Home ──
  { name: "Pet & Livestock Medications", category: "Animals & Home", description: "Discounted animal medications shipped to your door, up to 25% off.", affiliate_url: "https://www.dpbolvw.net/click-9121627-12521727", featured: true, sort: 10 },
  { name: "Tire Rack", category: "Animals & Home", description: "Member pricing on truck and trailer tires, with expert reviews to help you choose.", affiliate_url: "https://www.kqzyfj.com/click-9121627-14310855", sort: 20 },
  { name: "Home Warranty", category: "Animals & Home", description: "A home warranty plan covering major systems and appliances, with $50 off.", affiliate_url: "https://www.anrdoezrs.net/click-9121627-13073571", discount_code: "$50 off", sort: 30 },

  // ── Health & Wellness ──
  { name: "Groomie Head & Body Trimmer", category: "Health & Wellness", description: "An at-home head and body trimmer with a member discount.", affiliate_url: "https://www.groomie.club/DAVID15941", discount_code: "10% off with this link", sort: 10 },
  { name: "BulkSupplements", category: "Health & Wellness", description: "Discounted bulk vitamins and supplements, with a built-in checkout discount.", affiliate_url: "https://shareasale.com/r.cfm?b=602574&u=1690228&m=53326&urllink=&afftrack=", sort: 20 },
];

export const RESOURCE_CATEGORIES = ["Travel", "Business", "Financial", "Animals & Home", "Health & Wellness"] as const;
