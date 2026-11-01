#!/usr/bin/env node
// Splits held Sendy batches into "has a live listing" vs "no listing found",
// so the claim email can link each operator straight to their own listing.
//
//   node scripts/personalize-batches.mjs <listing-map.csv> <batch.csv>...
//
// listing-map.csv is the owner's export of marketing/listing-map.sql
// (email, slug, business_name). For each batch it writes, next to the batch:
//   <batch>-listing.csv  Name,Email,Business,Listing  → claim-campaign-2 (personal)
//   <batch>-nolisting.csv Name,Email                  → claim-campaign-1 (generic)
// Contact files stay in ~/Downloads, never in git.

import { readFileSync, writeFileSync } from "node:fs";

const [mapFile, ...batches] = process.argv.slice(2);
if (!mapFile || !batches.length) {
  console.error("Usage: node scripts/personalize-batches.mjs <listing-map.csv> <batch.csv>...");
  process.exit(1);
}
const UTM = "utm_source=claim_campaign&utm_medium=email&utm_campaign=claim_listing_personal";

const [mh, ...mrows] = parseCsv(readFileSync(mapFile, "utf8").replace(/^﻿/, ""));
const mi = (n) => mh.findIndex((h) => h.trim().toLowerCase() === n);
const [E, S, B] = [mi("email"), mi("slug"), mi("business_name")];
if (E < 0 || S < 0 || B < 0) { console.error("Map needs email, slug, business_name columns"); process.exit(1); }
const map = new Map();
for (const r of mrows) {
  const e = (r[E] || "").trim().toLowerCase();
  if (e && r[S] && !map.has(e)) map.set(e, { slug: r[S].trim(), business: (r[B] || "").trim() });
}

let tot = 0, hit = 0;
for (const file of batches) {
  const [h, ...rows] = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
  const ni = h.findIndex((x) => /^name$/i.test(x.trim()));
  const ei = h.findIndex((x) => /^email$/i.test(x.trim()));
  const withL = [["Name", "Email", "Business", "Listing"]];
  const without = [["Name", "Email"]];
  for (const r of rows) {
    const email = (r[ei] || "").trim();
    if (!email) continue;
    const m = map.get(email.toLowerCase());
    // Seed addresses go in both files so every send is checked.
    const seed = /^seed$/i.test((r[ni] || "").trim());
    if (m || seed) {
      const l = m || map.values().next().value; // seeds preview a real live listing
      withL.push([r[ni] || "", email, l.business, `https://pawsassociation.com/members/${l.slug}?${UTM}`]);
    }
    if (!m || seed) without.push([r[ni] || "", email]);
    if (!seed) { tot++; if (m) hit++; }
  }
  const base = file.replace(/\.csv$/i, "");
  writeFileSync(`${base}-listing.csv`, toCsv(withL));
  writeFileSync(`${base}-nolisting.csv`, toCsv(without));
  console.log(`${file}: ${withL.length - 1} with listing, ${without.length - 1} without (seeds in both)`);
}
console.log(`Total: ${hit}/${tot} recipients matched a live listing`);

function toCsv(rows) {
  return rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(",")).join("\n") + "\n";
}
function parseCsv(text) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}
