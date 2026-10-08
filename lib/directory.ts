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
  categories: [
    {
      slug: "petting-zoos",
      name: "Petting Zoos",
      singular: "petting zoo",
      blurb: "Mobile and on-site petting zoos for parties, schools, fairs, and community events.",
    },
    {
      slug: "pony-rides",
      name: "Pony Rides",
      singular: "pony ride operator",
      blurb: "Hand-led pony rides for children at parties, fairs, and festivals.",
    },
    {
      slug: "beer-burros",
      name: "Beer Burros",
      singular: "beer burro service",
      blurb: "Friendly mini donkeys with drink-service saddlebags for weddings and events.",
    },
    {
      slug: "mobile-farms",
      name: "Mobile Farms",
      singular: "mobile farm",
      blurb: "The barnyard comes to you — schools, daycares, fairs, and community events.",
    },
  ],
  serviceTags: [
    "Birthday parties",
    "Weddings",
    "Corporate events",
    "School visits",
    "Fairs & festivals",
    "Insured",
    "Helmets provided",
    "Educational",
    "Photo packages",
  ],
} as const;

export type CategorySlug = (typeof DIRECTORY.categories)[number]["slug"];

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
