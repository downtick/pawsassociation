-- ============================================================================
-- PAWSAssociation.org — seed data
-- Run AFTER schema.sql. Mirrors lib/data/resourcesSeed.ts and
-- content/articles/* — keep them in sync when adding perks or articles.
-- ============================================================================

-- ── Categories (the taxonomy — drives /directory/[category] routes) ─────────
insert into categories (slug, name, singular, sort, intro_md) values
('petting-zoos', 'Petting Zoos', 'petting zoo', 10,
 'Mobile and on-site petting zoos bring gentle, well-cared-for animals to birthday parties, schools, fairs, and community events. Search free and send your request straight to the operator.'),
('pony-rides', 'Pony Rides', 'pony ride operator', 20,
 'Pony ride operators provide hand-led rides for children at parties, fairs, and festivals. Compare operators near you and request availability free.'),
('beer-burros', 'Beer Burros', 'beer burro service', 30,
 'Beer burros — friendly mini donkeys with drink-service saddlebags — are the hit of weddings, corporate events, and festivals. Find services near you and request a date free.'),
('mobile-farms', 'Mobile Farms', 'mobile farm', 40,
 'Mobile farms bring the barnyard to schools, daycares, fairs, and community events — a hands-on farm experience anywhere. Compare farms near you and request a visit free.')
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
('review-engine-for-operators', 'Get 5-Star Reviews on Autopilot', 'The post-event follow-up sequence that turns happy hosts into Google reviews — with copy-paste templates.', 'Marketing', true)
on conflict (slug) do nothing;
