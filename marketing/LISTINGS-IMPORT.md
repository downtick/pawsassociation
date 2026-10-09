# Importing businesses as claimable listings

1. Fill a copy of `listings-import-template.csv` (keep the header row).
   Save it in this folder — `marketing/*.csv` is git-ignored, so the list
   never reaches GitHub.
2. `node scripts/import-listings.mjs marketing/your-list.csv mailing-list-2026-10 > import.sql`
   Warnings (unknown attraction types, bad states) print to the terminal;
   fix the CSV and re-run. Re-running is safe — it updates, never duplicates,
   and never overwrites a listing a business has already claimed.
3. Paste `import.sql` into the Supabase SQL editor and run it.

| Column | Required | Public? | Notes |
|---|---|---|---|
| business_name | yes | yes | |
| main_attraction | yes | yes | Loose wording OK: "petting zoo", "Reptiles", "goat yoga" |
| also_offers | | yes | Semicolon-separated: `Goat yoga; beer burros` |
| city | yes | yes | |
| state | yes | yes | `AZ` or `Arizona` |
| zip | | yes | 5 digits |
| service_area | | yes | e.g. "Phoenix metro up to 50 miles" |
| event_tags | | yes | Must match the site's event list (Birthday parties, Weddings, School visits, …) |
| bio | | yes | Only if you have one; leave blank otherwise |
| owner_name, email, phone, website, notes | | **NO** | Stored admin-only. Phone/website go public only after the business claims and joins |

Only list businesses that already advertise to the public. Pre-listing uses
public business facts (name, city, state, attractions); anyone can ask to be
removed via the contact page (Terms §4).
