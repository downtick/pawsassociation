#!/usr/bin/env node
// CSV → SQL importer for pre-seeded (UNCLAIMED) directory listings.
//
//   node scripts/import-listings.mjs marketing/my-list.csv > import.sql
//   then paste import.sql into the Supabase SQL editor.
//
// Public columns go onto `listings` (approved, profile_id NULL = unclaimed).
// email / phone / website / owner_name / notes go ONLY to the admin-only
// `listing_private_contacts` table — unclaimed listings never expose contact
// details. Re-running is safe: listings upsert by slug, contacts by listing.
//
// Attraction names are matched loosely ("goat yoga", "Reptiles", "pig
// racing", "petting zoo" all work). Unmatched values are reported on stderr
// and skipped; nothing is guessed silently.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = process.argv[2];
const source = process.argv[3] || `import-${new Date().toISOString().slice(0, 10)}`;
if (!file) {
  console.error("Usage: node scripts/import-listings.mjs <file.csv> [source-label] > import.sql");
  process.exit(1);
}

// ── Taxonomy, read from lib/directory.ts so the two can never drift ─────────
const ts = readFileSync(join(root, "lib/directory.ts"), "utf8");
const CATS = [...ts.matchAll(/\{ slug: "([^"]+)", name: "([^"]+)", singular: "([^"]+)"/g)].map((m) => ({
  slug: m[1], name: m[2], singular: m[3],
}));
const TAGS = [...ts.slice(ts.indexOf("serviceTags")).matchAll(/^\s*"([^"]+)",/gm)].map((m) => m[1]);
const STATES = Object.fromEntries(
  [...ts.matchAll(/([A-Z]{2}): "([^"]+)"/g)].flatMap((m) => [[m[1], m[1]], [m[2].toLowerCase(), m[1]]])
);

const norm = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
// Keyword fallbacks, most specific first.
const KEYWORDS = [
  ["goatyoga", "goat-yoga"], ["yoga", "goat-yoga"],
  ["beerburro", "beer-burros"], ["burro", "beer-burros"],
  ["petting", "petting-zoos"], ["pony", "pony-rides"],
  ["mobilefarm", "mobile-farms"], ["farm", "mobile-farms"],
  ["reptile", "reptile-exhibits"], ["snake", "reptile-exhibits"], ["lizard", "reptile-exhibits"],
  ["reindeer", "reindeer-visits"],
  ["alpaca", "alpaca-llama-visits"], ["llama", "alpaca-llama-visits"],
  ["camel", "camel-rides"], ["pig", "pig-races"],
  ["birdsofprey", "birds-of-prey"], ["raptor", "birds-of-prey"], ["owl", "birds-of-prey"],
  ["falcon", "birds-of-prey"], ["hawk", "birds-of-prey"],
  ["exotic", "exotic-animal-encounters"],
  ["wildlife", "wildlife-education"], ["education", "wildlife-education"],
  ["nativity", "live-nativity"],
  ["hayride", "hayrides-carriage-rides"], ["carriage", "hayrides-carriage-rides"], ["wagon", "hayrides-carriage-rides"],
  ["show", "animal-shows"], ["performance", "animal-shows"], ["trick", "animal-shows"],
];

function matchCategory(raw) {
  const n = norm(raw);
  if (!n) return null;
  for (const c of CATS) {
    if ([c.slug, c.name, c.singular, c.name.replace(/s$/i, "")].some((x) => norm(x) === n)) return c.slug;
  }
  for (const [k, slug] of KEYWORDS) if (n.includes(k)) return slug;
  return null;
}

// ── Minimal RFC-4180 CSV parser (quotes, escaped quotes, newlines in cells) ─
function parseCsv(text) {
  const rows = []; let row = []; let cell = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const sql = (v) => (v === null || v === undefined || v === "" ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const list = (s) => (s || "").split(/[;|]/).map((x) => x.trim()).filter(Boolean);
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const [header, ...data] = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
const H = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
const col = (r, name) => (r[H.indexOf(name)] ?? "").trim();
for (const req of ["business_name", "main_attraction", "city", "state"]) {
  if (!H.includes(req)) { console.error(`Missing required column: ${req}`); process.exit(1); }
}

const out = [
  `-- PAWS listing import from ${file} (source: ${source})`,
  `-- Generated ${new Date().toISOString()} — paste into the Supabase SQL editor.`,
  "begin;",
];
const used = new Set();
let ok = 0, skipped = 0, warnings = 0;

data.forEach((r, idx) => {
  const line = idx + 2;
  const name = col(r, "business_name");
  const city = col(r, "city");
  const stateRaw = col(r, "state");
  const state = STATES[stateRaw.toUpperCase()] || STATES[stateRaw.toLowerCase()];
  const main = matchCategory(col(r, "main_attraction"));
  if (!name || !city || !state || !main) {
    console.error(`Row ${line} SKIPPED (${name || "no name"}): ${!main ? `unknown main_attraction "${col(r, "main_attraction")}"` : !state ? `bad state "${stateRaw}"` : "missing name/city"}`);
    skipped++; return;
  }
  const extras = [];
  for (const raw of list(col(r, "also_offers"))) {
    const m = matchCategory(raw);
    if (!m) { console.error(`Row ${line} (${name}): unknown also_offers "${raw}" — skipped`); warnings++; }
    else if (m !== main && !extras.includes(m)) extras.push(m);
  }
  const tags = [];
  for (const raw of list(col(r, "event_tags"))) {
    const t = TAGS.find((x) => norm(x) === norm(raw));
    if (!t) { console.error(`Row ${line} (${name}): unknown event_tag "${raw}" — skipped`); warnings++; }
    else tags.push(t);
  }
  const zip = col(r, "zip").replace(/\D/g, "").slice(0, 5);

  let slug = slugify(`${name}-${city}`) || `listing-${line}`;
  for (let n = 2; used.has(slug); n++) slug = `${slugify(`${name}-${city}`)}-${n}`;
  used.add(slug);
  const ref = `(select id from listings where slug = ${sql(slug)})`;

  out.push(
    `-- row ${line}: ${name.replace(/\n/g, " ")}`,
    `insert into listings (slug, business_name, category_id, city, state, zip, service_area, services, bio, approved, profile_id)
values (${sql(slug)}, ${sql(name)}, (select id from categories where slug = ${sql(main)}), ${sql(city)}, ${sql(state)}, ${sql(zip)}, ${sql(col(r, "service_area"))}, ${tags.length ? `array[${tags.map(sql).join(", ")}]::text[]` : "'{}'::text[]"}, ${sql(col(r, "bio"))}, true, null)
on conflict (slug) do update set business_name = excluded.business_name, category_id = excluded.category_id,
  city = excluded.city, state = excluded.state, zip = excluded.zip, service_area = excluded.service_area,
  services = excluded.services, bio = excluded.bio
  where listings.profile_id is null;  -- never overwrite a claimed listing`,
  );
  if (extras.length) {
    out.push(`insert into listing_categories (listing_id, category_id)
select ${ref}, id from categories where slug in (${extras.map(sql).join(", ")})
on conflict do nothing;`);
  }
  const priv = ["owner_name", "email", "phone", "website", "notes"].map((k) => col(r, k));
  if (priv.some(Boolean)) {
    out.push(`insert into listing_private_contacts (listing_id, owner_name, email, phone, website, notes, source)
values (${ref}, ${priv.map(sql).join(", ")}, ${sql(source)})
on conflict (listing_id) do update set owner_name = excluded.owner_name, email = excluded.email,
  phone = excluded.phone, website = excluded.website, notes = excluded.notes, source = excluded.source;`);
  }
  ok++;
});

out.push("commit;", `-- ${ok} listings, ${skipped} skipped, ${warnings} warnings`);
console.log(out.join("\n"));
console.error(`\nDone: ${ok} listings ready, ${skipped} skipped, ${warnings} warnings.`);
