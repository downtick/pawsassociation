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
-- Hertz CDP + Rakuten referral supplied by the owner 2026-10-26.
insert into resources (name, category, description, affiliate_url, discount_code, code_instructions, featured, sort) values
-- Travel
('Hertz Business Rentals', 'Travel', 'Save on rental cars and trucks for hauling to events — enter the association CDP number when you book.', 'https://www.hertz.com', '2105180', 'On hertz.com, add the CDP number in the "Discount/CDP/Promo Codes" box at booking. The discount applies to business and personal rentals.', true, 10),
('Rakuten Cash Back', 'Travel', 'Cash back on hotels, travel, and everyday shopping at thousands of stores.', 'https://www.rakuten.com/r/DOWNTI5?eeid=28187', null, 'Join Rakuten through this link, then start your shopping or travel booking from Rakuten to earn cash back.', false, 20),
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
