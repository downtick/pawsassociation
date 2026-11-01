-- Read-only. Email → live unclaimed listing, for personalizing the claim email.
-- Run in the Supabase SQL editor with the row limit set to "No limit", then
-- Export → CSV and save it as ~/Downloads/paws-sendy-batches/listing-map.csv.
-- (Contains contact emails: never commit the export.)
select lower(trim(c.email)) as email, l.slug, l.business_name
from listing_private_contacts c
join listings l on l.id = c.listing_id
where l.approved and l.profile_id is null
  and coalesce(trim(c.email), '') <> ''
order by 1, l.slug;
