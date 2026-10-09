// Directory taxonomy config — the one file that declares this association's
// shape (per the membership-website skill's taxonomy abstraction). PAWS is a
// CATEGORIZED vertical: members split into attraction types people search for
// by name, so each category gets its own landing/SEO routes.
//
// The category rows also live in the `categories` DB table (seeded from
// supabase/seed.sql); this static copy powers routes, filters, nav, and copy
// without a DB round-trip. Keep the two in sync when adding a category.

export const DIRECTORY = {
  vertical: "Animal Attractions & Amusements",
  memberNoun: "operator",
  taxonomy: "categories" as const,
  categoryNoun: "attraction type",
  categorySeoPages: true,
  // `featured` types appear in the hero pills, homepage grid, and footer;
  // every type gets its own /directory/[slug] SEO tree. Members check every
  // type they offer ("also offers"); one is their main type.
  categories: [
    { slug: "petting-zoos", name: "Petting Zoos", singular: "petting zoo", featured: true,
      blurb: "Mobile and on-site petting zoos for parties, schools, fairs, and community events." },
    { slug: "pony-rides", name: "Pony Rides", singular: "pony ride operator", featured: true,
      blurb: "Hand-led pony rides for children at parties, fairs, and festivals." },
    { slug: "beer-burros", name: "Beer Burros", singular: "beer burro service", featured: true,
      blurb: "Friendly mini donkeys with drink-service saddlebags for weddings and events." },
    { slug: "mobile-farms", name: "Mobile Farms", singular: "mobile farm", featured: true,
      blurb: "The barnyard comes to you — schools, daycares, fairs, and community events." },
    { slug: "goat-yoga", name: "Goat Yoga", singular: "goat yoga provider", featured: true,
      blurb: "Yoga sessions with friendly goats for studios, parties, corporate wellness days, and festivals." },
    { slug: "reptile-exhibits", name: "Reptile Shows & Exhibits", singular: "reptile exhibitor", featured: true,
      blurb: "Hands-on reptile shows and exhibits for schools, libraries, parties, and festivals." },
    { slug: "reindeer-visits", name: "Reindeer Visits", singular: "reindeer display", featured: false,
      blurb: "Live reindeer for holiday events, tree lots, markets, and Santa photo sessions." },
    { slug: "alpaca-llama-visits", name: "Alpaca & Llama Visits", singular: "alpaca and llama visit", featured: false,
      blurb: "Gentle alpacas and llamas for parties, senior communities, schools, and photo sessions." },
    { slug: "camel-rides", name: "Camel Rides", singular: "camel ride operator", featured: false,
      blurb: "Camel rides and nativity camels for fairs, festivals, churches, and private events." },
    { slug: "pig-races", name: "Pig Races", singular: "pig race show", featured: false,
      blurb: "Racing pig shows for county fairs, festivals, and community events." },
    { slug: "birds-of-prey", name: "Birds of Prey Shows", singular: "birds of prey show", featured: false,
      blurb: "Owl, hawk, and falcon programs for schools, libraries, nature centers, and festivals." },
    { slug: "exotic-animal-encounters", name: "Exotic Animal Encounters", singular: "exotic animal encounter", featured: false,
      blurb: "Traveling encounters with exotic animals for schools, parties, and corporate events." },
    { slug: "wildlife-education", name: "Wildlife Education Programs", singular: "wildlife education program", featured: false,
      blurb: "Educational programs with ambassador animals for classrooms, libraries, and camps." },
    { slug: "animal-shows", name: "Animal Shows & Performances", singular: "animal show", featured: false,
      blurb: "Trained-animal acts and dog shows for fairs, festivals, and school assemblies." },
    { slug: "hayrides-carriage-rides", name: "Hayrides & Carriage Rides", singular: "hayride or carriage ride service", featured: false,
      blurb: "Hayrides, wagon rides, and horse-drawn carriages for fall festivals, weddings, and holiday events." },
    { slug: "live-nativity", name: "Live Nativity Animals", singular: "live nativity animal provider", featured: false,
      blurb: "Sheep, donkeys, goats, and camels for church and community nativity scenes." },
  ],
  serviceTags: [
    "Birthday parties",
    "Weddings",
    "Corporate events",
    "School visits",
    "Library programs",
    "Church events",
    "Fairs & festivals",
    "Holiday events",
    "Senior communities",
    "Indoor setups available",
    "Educational",
    "Photo packages",
    "Helmets provided",
  ],
} as const;

export type CategorySlug = (typeof DIRECTORY.categories)[number]["slug"];

export const FEATURED_CATEGORIES = DIRECTORY.categories.filter((c) => c.featured);

export function getCategory(slug: string) {
  return DIRECTORY.categories.find((c) => c.slug === slug) ?? null;
}

// US state slugs for the /directory/[category]/[state] SEO pages.
export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington, D.C.",
};

export function stateSlug(abbr: string): string {
  return (STATE_NAMES[abbr.toUpperCase()] ?? abbr).toLowerCase().replace(/[^a-z]+/g, "-");
}

export function stateFromSlug(slug: string): { abbr: string; name: string } | null {
  const entry = Object.entries(STATE_NAMES).find(
    ([abbr, name]) => stateSlug(abbr) === slug && Boolean(name)
  );
  return entry ? { abbr: entry[0], name: entry[1] } : null;
}

export function citySlug(city: string): string {
  return city.toLowerCase().trim().replace(/[^a-z]+/g, "-");
}
