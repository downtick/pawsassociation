// Member download catalog. Public preview pages (/downloads/[slug]) render
// from this metadata and are indexable; the PDF itself is generated per
// member by /api/downloads/[slug] (lib/pdf/downloads.ts) and stamped
// "Prepared for <business>" — the file is never in /public.

export type DownloadKind = "sign" | "form" | "table" | "flyer";

export interface DownloadMeta {
  slug: string;
  title: string;
  /** Short line for cards. */
  summary: string;
  /** 2–3 sentence public description (SEO body copy). */
  description: string;
  group: "Event signs" | "Business forms" | "Marketing tools";
  kind: DownloadKind;
  /** Signs: the big headline printed on the sign (used by the preview). */
  headline?: string;
  pages: string;
  whatsInside: string[];
  /** Course lesson that teaches with this download. */
  lessonSlug?: string;
}

export const DOWNLOADS: DownloadMeta[] = [
  // ── Event signs ──
  {
    slug: "hand-washing-sign",
    headline: "Please wash your hands",
    title: "Hand Washing Sign for Petting Zoos & Animal Exhibits",
    summary: "A large printable sign for your pen exit: wash or sanitize after touching the animals.",
    description:
      "Hand washing after animal contact is the habit every petting zoo, pony ride, and mobile farm wants guests to keep. This sign is sized for letter paper in landscape, readable from across a yard, and prints with your business name across the bottom.",
    group: "Event signs",
    kind: "sign",
    pages: "1 page, landscape",
    whatsInside: [
      "Large-type “Please wash your hands” headline readable from 20+ feet",
      "Plain-language instruction for soap or sanitizer",
      "Your business name printed at the bottom",
      "Prints on standard letter paper; laminate for outdoor use",
    ],
    lessonSlug: "event-day-run-sheet",
  },
  {
    slug: "ask-before-petting-sign",
    headline: "Ask before petting",
    title: "“Ask Before Petting” Sign for Animal Attractions",
    summary: "A printable sign that asks guests to check with a handler before touching an animal.",
    description:
      "Guests reaching over a fence for an animal they haven't been introduced to is how most nips happen. This sign sets the expectation before anyone reaches: ask a handler first. Large type, landscape letter size, with your business name printed at the bottom.",
    group: "Event signs",
    kind: "sign",
    pages: "1 page, landscape",
    whatsInside: [
      "Large-type “Ask before petting” headline",
      "Friendly line pointing guests to a handler",
      "Your business name printed at the bottom",
      "Letter size; laminate or sheet-protect for outdoor events",
    ],
    lessonSlug: "event-day-run-sheet",
  },
  {
    slug: "dont-feed-the-animals-sign",
    headline: "Please don't feed the animals",
    title: "“Please Don't Feed the Animals” Printable Sign",
    summary: "A printable sign that keeps party snacks away from your animals.",
    description:
      "Birthday cake, chips, and popcorn end up in reach of goats and ponies at almost every party. This sign tells guests the animals are on a set diet and to ask a handler about feeding time. Landscape letter size, large type, your business name at the bottom.",
    group: "Event signs",
    kind: "sign",
    pages: "1 page, landscape",
    whatsInside: [
      "Large-type “Please don't feed the animals” headline",
      "A line directing guests to ask about feeding time",
      "Your business name printed at the bottom",
      "Letter size; pairs with the hand washing and ask-before-petting signs",
    ],
    lessonSlug: "event-day-run-sheet",
  },

  {
    slug: "supervise-children-sign",
    headline: "Please supervise your children",
    title: "“Please Supervise Your Children” Sign for Petting Zoos",
    summary: "A printable sign asking an adult to stay with every child in the animal area.",
    description:
      "A parent who steps away to grab a drink leaves your handlers watching both the animals and a toddler. This sign asks adults to stay with their children inside the animal area. Landscape letter size, large type, with your business name at the bottom.",
    group: "Event signs",
    kind: "sign",
    pages: "1 page, landscape",
    whatsInside: [
      "Large-type “Please supervise your children” headline",
      "A line asking an adult to stay with every child",
      "Your business name printed at the bottom",
      "Letter size; post it at the pen entrance",
    ],
    lessonSlug: "event-day-run-sheet",
  },
  {
    slug: "gentle-and-quiet-sign",
    headline: "Gentle hands, quiet voices",
    title: "“Gentle Hands, Quiet Voices” Sign for Animal Exhibits",
    summary: "A printable sign that asks guests to walk and keep voices low near the animals.",
    description:
      "Running, shrieking, and grabbing startle goats, ponies, and reptiles alike. This sign sets a calm tone at the entrance: walk near the animals, use gentle hands, keep voices low. Large type in landscape letter size, with your business name printed at the bottom.",
    group: "Event signs",
    kind: "sign",
    pages: "1 page, landscape",
    whatsInside: [
      "Large-type “Gentle hands, quiet voices” headline",
      "A line asking guests to walk and avoid sudden moves",
      "Your business name printed at the bottom",
      "Works for petting zoos, reptile shows, and animal education programs",
    ],
    lessonSlug: "event-day-run-sheet",
  },
  {
    slug: "no-food-or-strollers-sign",
    headline: "No food or strollers in the pen",
    title: "“No Food or Strollers in the Pen” Printable Sign",
    summary: "Keep snacks, drinks, and strollers outside the gate.",
    description:
      "A stroller in a petting pen blocks the exit and gets chewed, and a snack in a small hand draws a crowd of goats. This sign asks guests to leave food, drinks, and strollers outside the gate. Landscape letter size with your business name at the bottom.",
    group: "Event signs",
    kind: "sign",
    pages: "1 page, landscape",
    whatsInside: [
      "Large-type “No food or strollers in the pen” headline",
      "A line asking guests to leave them outside the gate",
      "Your business name printed at the bottom",
      "Letter size; post it at the gate beside the hand washing sign",
    ],
    lessonSlug: "event-day-run-sheet",
  },

  // ── Business forms ──
  {
    slug: "rate-sheet-template",
    title: "Rate Sheet Template for Petting Zoos, Pony Rides & Mobile Farms",
    summary: "A fill-in rate sheet: packages, travel fees, add-ons, deposits, and policies.",
    description:
      "A rate sheet you can hand or email to any client turns pricing from a negotiation into a menu. This template lays out base packages, travel fees, add-ons, deposit terms, and weather policy on one page, built to match the pricing lesson in the PAWS course.",
    group: "Business forms",
    kind: "form",
    pages: "1–2 pages, portrait",
    whatsInside: [
      "Packages table: name, what's included, duration, price",
      "Travel radius and per-mile or zone fee",
      "Add-ons table for extra time, handlers, and upgrades",
      "Deposit, balance, reschedule, and cancellation terms",
    ],
    lessonSlug: "price-your-attraction",
  },
  {
    slug: "inquiry-intake-form",
    title: "Event Inquiry Intake Form for Animal Attractions",
    summary: "Capture every detail of a booking inquiry on the first call.",
    description:
      "The questions you forget on the first call become the problems on event day: the surface, the gate width, the venue's insurance certificate. This intake form walks through contact, event, venue, and quote details so every inquiry is captured the same way.",
    group: "Business forms",
    kind: "form",
    pages: "1–2 pages, portrait",
    whatsInside: [
      "Contact and lead-source fields",
      "Event type, date, time, guest count, and ages",
      "Venue surface and certificate-of-insurance requirements",
      "Quote, deposit, and follow-up tracking",
    ],
    lessonSlug: "schools-daycares-libraries",
  },
  {
    slug: "venue-site-visit-checklist",
    title: "Venue Site Visit Checklist for Mobile Animal Businesses",
    summary: "Check access, ground, shade, guest flow, and venue rules before you book.",
    description:
      "A ten-minute walk of a new venue prevents the event-day surprises: a gate the trailer won't clear, no shade, a pen spot next to the food tent. This checklist covers access, setup area, guest flow, and the venue's rules and paperwork.",
    group: "Business forms",
    kind: "form",
    pages: "1 page, portrait",
    whatsInside: [
      "Arrival and trailer-access checks",
      "Setup area: ground, shade, water, distances",
      "Guest flow and hand-washing station placement",
      "Venue rules, insurance certificate, and on-site contact",
    ],
    lessonSlug: "get-booked-by-venues",
  },
  {
    slug: "animal-care-transport-log",
    title: "Animal Care & Transport Log",
    summary: "Track every animal's trips, water, rest breaks, and health notes.",
    description:
      "A written log of where each animal went, how long it worked, and how it was watered and rested is useful for your vet, for fair and event paperwork, and for your own records. Landscape layout with fourteen rows per page.",
    group: "Business forms",
    kind: "table",
    pages: "1 page, landscape",
    whatsInside: [
      "Date, animal, and event/location columns",
      "Depart and return times",
      "Water and feed, rest breaks, and health notes",
      "Initials column for multi-handler teams",
    ],
    lessonSlug: "fairs-and-festivals",
  },
  {
    slug: "event-day-run-sheet",
    title: "Event-Day Run Sheet (Printable Checklist)",
    summary: "Load-out, setup, rotation, and teardown — one sheet per event.",
    description:
      "One sheet per event keeps a busy weekend from blurring together. The run sheet covers the event header, the night-before load-out, on-site setup, animal rotation, and teardown, so nothing depends on memory.",
    group: "Business forms",
    kind: "form",
    pages: "1 page, portrait",
    whatsInside: [
      "Event header: client, venue, times, insurance certificate, balance",
      "Night-before load-out checklist",
      "On-site setup and rotation plan",
      "Teardown checklist with headcount and site photos",
    ],
    lessonSlug: "event-day-run-sheet",
  },

  {
    slug: "deposit-receipt-invoice",
    title: "Deposit Receipt & Invoice Template for Animal Attractions",
    summary: "Record the deposit, the balance due, and the terms the client agreed to.",
    description:
      "A written receipt the day the deposit arrives confirms the date is held and puts the balance and policies on paper. This template covers the booking items, deposit, balance due date, payment method, and your weather and cancellation terms.",
    group: "Business forms",
    kind: "form",
    pages: "1 page, portrait",
    whatsInside: [
      "Invoice number, client, event date, and venue",
      "Line items for package, travel, and add-ons",
      "Deposit received, balance due, and due date",
      "Weather and cancellation terms with a received-by signature",
    ],
    lessonSlug: "deposits-contracts-rain-policies",
  },
  {
    slug: "event-booking-agreement",
    title: "Event Booking Agreement Template for Mobile Animal Businesses",
    summary: "A plain-language booking agreement: services, price, weather, site, and signatures.",
    description:
      "A one-page agreement answers the questions that cause most booking disputes before they come up: what's included, when the balance is due, who calls a rainout, and what the client provides on site. It's a template to adapt with an attorney in your state, not legal advice.",
    group: "Business forms",
    kind: "form",
    pages: "1–2 pages, portrait",
    whatsInside: [
      "Parties, event details, services, and handlers",
      "Price, deposit, and balance terms",
      "Weather call, reschedule, and cancellation sections",
      "Site and safety expectations with signature lines",
    ],
    lessonSlug: "deposits-contracts-rain-policies",
  },
  {
    slug: "animal-health-record",
    title: "Animal Health & Vaccination Record (Printable)",
    summary: "One page per animal: vaccinations, deworming, exams, and health certificates.",
    description:
      "Fairs, schools, and event organizers sometimes ask for proof that your animals are cared for by a vet. Keeping one page per animal makes that a quick photocopy. Record vaccinations, deworming, exams, tests, and travel health certificates in one place.",
    group: "Business forms",
    kind: "form",
    pages: "1 page per animal, portrait",
    whatsInside: [
      "Animal ID, species, markings, and veterinarian",
      "Vaccination table with next-due dates",
      "Deworming, exams, and test results",
      "Health certificate (CVI) log for travel and fairs",
    ],
    lessonSlug: "fairs-and-festivals",
  },
  {
    slug: "incident-report-form",
    title: "Incident Report Form for Petting Zoos & Animal Events",
    summary: "Document any injury, bite, escape, or damage the same day.",
    description:
      "When something goes wrong at an event, notes written the same day are far more useful than memories a month later. This form records the type of incident, the people and animal involved, what happened, first aid, witnesses, and follow-up.",
    group: "Business forms",
    kind: "form",
    pages: "1 page, portrait",
    whatsInside: [
      "Incident type checkboxes: injury, bite, escape, damage, and more",
      "People involved, including a parent or guardian for minors",
      "A factual what-happened section and first-aid notes",
      "Witnesses, photos, and follow-up actions",
    ],
    lessonSlug: "hiring-training-handlers",
  },
  {
    slug: "guest-participation-waiver",
    title: "Guest Participation Waiver Template for Animal Attractions",
    summary: "A starting-point guest acknowledgment with participants, allergies, and photo permission.",
    description:
      "Many operators ask guests to sign an acknowledgment before petting or riding. This template covers the basics, including the participants, allergies, photo permission, and a guardian signature, with a marked spot for release language your attorney writes. Waiver rules vary by state; this is not legal advice.",
    group: "Business forms",
    kind: "form",
    pages: "1 page, portrait",
    whatsInside: [
      "Plain-language risk and rules acknowledgment",
      "A marked space for attorney-reviewed release wording",
      "Participants table with ages and allergies",
      "Photo permission and guardian signature",
    ],
    lessonSlug: "deposits-contracts-rain-policies",
  },
  {
    slug: "mileage-expense-log",
    title: "Mileage & Expense Log for Mobile Animal Businesses",
    summary: "Track miles and business expenses trip by trip.",
    description:
      "Mobile animal businesses drive a lot, and the miles and costs add up fast. This landscape log records each trip's purpose, odometer readings, and miles, plus expenses like fuel, feed, and event fees, so your records are ready when your tax professional asks.",
    group: "Business forms",
    kind: "table",
    pages: "1 page, landscape",
    whatsInside: [
      "Date, purpose, and from/to columns",
      "Start and end odometer with miles",
      "Expense type, amount, and receipt check",
      "Thirteen rows per page",
    ],
    lessonSlug: "know-your-numbers",
  },

  // ── Marketing tools ──
  {
    slug: "marketing-calendar",
    title: "12-Month Marketing Calendar for Animal Businesses",
    summary: "What to market and who to contact each month of the year.",
    description:
      "Animal attractions book in seasonal waves, and each wave has to be marketed weeks before it arrives. This calendar lays out all twelve months — the booking focus, what to promote now, and who to contact — so planning takes one glance on the first of each month.",
    group: "Marketing tools",
    kind: "table",
    pages: "1–2 pages, landscape",
    whatsInside: [
      "Month-by-month booking focus",
      "What to market now for the next season",
      "Who to contact each month: schools, libraries, fairs, churches, corporate",
      "Notes column for your own region and climate",
    ],
    lessonSlug: "seasonal-marketing-calendar",
  },
  {
    slug: "flyer-template",
    title: "Fillable Flyer Template for Petting Zoos & Pony Rides",
    summary: "Type your details into the PDF and print a ready-to-hand-out flyer.",
    description:
      "A flyer is what parents take home from a fair and what referral partners hand to their clients. This template is a fillable PDF: type your business name, services, and contact details right into it, check the events you serve, then print or email it.",
    group: "Marketing tools",
    kind: "flyer",
    pages: "1 page, fillable",
    whatsInside: [
      "Fillable fields for business name, tagline, services, and contact info",
      "Checkboxes for the events you serve",
      "Space for a photo",
      "PAWS member line pointing to your directory listing",
    ],
    lessonSlug: "referral-partners",
  },
  {
    slug: "booking-follow-up-tracker",
    title: "Booking & Follow-Up Tracker for Repeat Bookings",
    summary: "Log every event, then track thank-yous, reviews, and next year's rebook date.",
    description:
      "Last year's clients are the easiest bookings you'll get this year, if you remember to reach out. This tracker logs each event with its source and total, then the follow-up steps: thank-you sent, review requested, and the date to ask about next year.",
    group: "Marketing tools",
    kind: "table",
    pages: "1 page, landscape",
    whatsInside: [
      "Event date, client, type, and how they found you",
      "Total and paid-in-full columns",
      "Thank-you and review-request checkoffs",
      "A rebook date for next year's outreach",
    ],
    lessonSlug: "repeat-bookings-past-customers",
  },
];

export const DOWNLOAD_GROUPS = ["Event signs", "Business forms", "Marketing tools"] as const;

export function getDownload(slug: string): DownloadMeta | undefined {
  return DOWNLOADS.find((d) => d.slug === slug);
}
