import type { ArticleContent } from "./index";

// "Grow Your Animal Business" — the member course. Each lesson's `teaser`
// is PUBLIC at /learn/[slug] (indexed, the hook); `outline` shows what's
// behind the paywall; `body` renders only for members. Full lesson =
// teaser + body. Written to the blog-writing skill's rules.

export const COURSE: ArticleContent[] = [
  {
    slug: "google-business-profile-for-mobile-operators",
    lesson: 1,
    title: "Google Business Profile for Mobile Animal Businesses",
    summary:
      "Set up and run a Google Business Profile when you don't have a storefront: service areas, categories, photos, verification, and a 10-minute weekly routine.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Set it up as a service-area business",
      "Pick categories that match how people search",
      "Photos, services, and the booking link",
      "Getting through verification",
      "The 10-minute weekly routine",
    ],
    teaser: (
      <>
        <p>
          When a parent types &ldquo;petting zoo near me,&rdquo; the map results above
          the regular listings come from Google Business Profiles. A mobile operator
          without one is missing from the spot where most local searches end. The catch:
          you don&apos;t have a storefront, so the setup works differently than it does
          for a shop.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Set it up as a service-area business</h2>
        <p>
          At business.google.com, when Google asks whether customers visit your
          location, answer no. That makes you a service-area business: your home
          address stays hidden, and you list the cities or regions you travel to
          instead. Google allows up to 20 service areas. List the towns that actually
          book you, not the whole state.
        </p>
        <h2>Pick categories that match how people search</h2>
        <p>
          Your primary category does most of the work. Search Google&apos;s category
          list for the words your customers use — petting zoo, pony ride, animal
          entertainment, party equipment rental — and choose the closest match as
          primary. Add secondary categories for everything else you do. The list
          changes, so check what Google offers instead of settling for a near miss.
        </p>
        <h2>Photos, services, and the booking link</h2>
        <ul>
          <li>Upload at least ten real photos: animals with guests (with parent permission), your setup, and your trailer with signage.</li>
          <li>Fill the Services section with each package name and one line on what it includes.</li>
          <li>Add your website or your PAWS listing as the booking link.</li>
          <li>Write the description in plain words: which animals, which events, which towns.</li>
        </ul>
        <h2>Getting through verification</h2>
        <p>
          Service-area businesses are often asked to verify by video: one continuous
          recording showing your equipment or trailer with signage, a business
          document, and you at work. Plan ten minutes in good light. Don&apos;t edit
          the clip — Google wants a single unbroken take.
        </p>
        <h2>The 10-minute weekly routine</h2>
        <ul>
          <li>Post one photo update from the weekend&apos;s events.</li>
          <li>Reply to every new review (lesson 10 covers how to get more of them).</li>
          <li>Answer questions in the Q&amp;A section before strangers answer for you.</li>
          <li>Once a month, check the profile&apos;s performance numbers: searches, calls, and website clicks.</li>
        </ul>
        <p>
          When the profile is live, add its link to your PAWS listing so the two
          point at each other.
        </p>
      </>
    ),
  },
  {
    slug: "seasonal-marketing-calendar",
    lesson: 2,
    download: "marketing-calendar",
    title: "The Seasonal Marketing Calendar for Animal Attractions",
    summary:
      "Animal attractions book in seasonal waves. Here's what to market each season, and when — six to eight weeks before the wave arrives.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Why six to eight weeks ahead",
      "Winter: plan and pitch",
      "Spring: birthdays and field trips",
      "Summer: camps, libraries, and fairs",
      "Fall: festivals and pumpkin patches",
      "Holidays: nativities and corporate parties",
      "Using the printable calendar",
    ],
    teaser: (
      <>
        <p>
          Most animal attractions book in waves: spring birthdays, summer camps and
          libraries, fall festivals and pumpkin patches, then holiday events. The
          operators who stay booked market each wave six to eight weeks before it
          starts — not the week it arrives.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Why six to eight weeks ahead</h2>
        <p>
          Families start planning a birthday a month or two out. Schools and
          libraries set field trips and summer programs months earlier. Fair vendor
          applications can close before the season begins. A &ldquo;book us for
          spring!&rdquo; post in April is late.
        </p>
        <h2>Winter (January–February): plan and pitch</h2>
        <ul>
          <li>Email last year&apos;s school, library, and camp contacts.</li>
          <li>Submit fair and festival vendor applications as they open.</li>
          <li>Update packages and prices for the year (lesson 3).</li>
          <li>Refresh photos on your Google profile and PAWS listing.</li>
        </ul>
        <h2>Spring (March–May): birthdays and field trips</h2>
        <p>
          Birthday season starts and school field trips peak in late spring. Post
          party photos weekly, and pitch Easter and Mother&apos;s Day events in
          February. While spring is booking, start pitching summer camps.
        </p>
        <h2>Summer (June–August): camps, libraries, and fairs</h2>
        <p>
          Library summer reading programs, day camps, county fairs, and Fourth of July
          block parties. Put your heat plan in every quote — shade, water, and shorter
          rotations — because summer clients ask. Meanwhile, pitch fall.
        </p>
        <h2>Fall (September–November): festivals and pumpkin patches</h2>
        <p>
          Back-to-school festivals, pumpkin patches, harvest and church fall festivals,
          and Halloween events. These organizers plan in July and August; that&apos;s
          when your emails should land.
        </p>
        <h2>Holidays (November–December): nativities and corporate parties</h2>
        <p>
          Living nativity scenes, holiday markets, tree lots, and company parties.
          Pitch them in September and October. December is also the month to ask the
          year&apos;s clients for reviews and to set next year&apos;s prices.
        </p>
        <h2>Using the printable calendar</h2>
        <p>
          The 12-Month Marketing Calendar download lays out every month: the booking
          focus, what to market now, and who to contact. Pin it near your desk and
          check it on the first of each month.
        </p>
      </>
    ),
  },
  {
    slug: "price-your-attraction",
    lesson: 3,
    download: "rate-sheet-template",
    title: "Pricing Your Attraction: Rate Sheets That Win Bookings",
    summary:
      "How to structure hourly rates, travel fees, and add-ons — plus the fill-in rate sheet members use to quote in minutes.",
    category: "Business",
    memberOnly: true,
    printable: false,
    outline: [
      "The base-rate formula",
      "Structure the sheet in four blocks",
      "Deposits and cancellation",
      "When to raise prices",
    ],
    teaser: (
      <>
        <p>
          Operators lose money in two places: quoting each job from scratch, and
          forgetting that a two-hour party is really a six-hour day once you count
          loading, driving, and cleanup. A rate sheet fixes both.
        </p>
      </>
    ),
    body: (
      <>
        <h2>The base-rate formula</h2>
        <p>
          Price the first hour to cover your true event day, not the time on site.
          Work backward: what do you need per event day to cover feed, vet,
          insurance, fuel, equipment wear, and your own time — then divide by
          realistic bookings per week. Most operators land on a first-hour rate two
          to three times their added-hour rate, because setup and teardown happen
          once regardless of duration.
        </p>
        <h2>Structure the sheet in four blocks</h2>
        <ul>
          <li><strong>Base packages:</strong> two or three named tiers (e.g. Starter Barnyard / Full Farm) with animal counts and durations spelled out.</li>
          <li><strong>Travel:</strong> free within a radius you choose, then a per-mile or per-zone fee. Publish it — surprise travel fees kill reviews.</li>
          <li><strong>Add-ons:</strong> extra half hour, extra handler, pony add-on to a petting zoo, floral saddlebags. Add-ons are where margin lives.</li>
          <li><strong>Peak dates:</strong> a stated weekend/holiday premium. Saying it up front reads as professional; discounting quietly on slow days is easier than raising quietly on busy ones.</li>
        </ul>
        <h2>Deposits and cancellation</h2>
        <p>
          Take 25 to 50 percent to hold a date, balance due before or on the day.
          Offer one free weather reschedule within a set window — it costs little and
          closes hesitant bookers.
        </p>
        <h2>When to raise prices</h2>
        <p>
          If you booked more than 80 percent of the weekends you wanted last season,
          raise the base 10 to 15 percent for the next one. Full calendars at last
          year&apos;s rates mean the market was ready to pay more.
        </p>
      </>
    ),
  },
  {
    slug: "get-booked-by-venues",
    lesson: 4,
    download: "venue-site-visit-checklist",
    title: "The Venue Outreach Playbook: Get on Preferred-Vendor Lists",
    summary:
      "A step-by-step outreach system for getting your attraction onto wedding-venue and event-planner preferred lists — with the exact email to send.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Build the target list (30 minutes)",
      "The first email",
      "The follow-up rhythm",
      "Keep the list warm",
    ],
    teaser: (
      <>
        <p>
          One venue that recommends you is worth twenty ad clicks. Wedding venues,
          event barns, and corporate-event planners keep preferred-vendor lists, and
          getting on three or four of them can fill a season. This is the outreach
          system, start to finish.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Build the target list (30 minutes)</h2>
        <ul>
          <li>Search &ldquo;wedding venue&rdquo; + your metro on Google Maps; collect the 20 closest with outdoor space.</li>
          <li>Add event barns, wineries, and breweries — beer burros book heavily at all three.</li>
          <li>For each: venue name, events manager&apos;s name if listed, email, and one detail from their photos you can mention.</li>
        </ul>
        <h2>The first email</h2>
        <p>Short beats thorough. Send this, personalized per venue:</p>
        <ul>
          <li><strong>Subject:</strong> Animal attraction vendor for [Venue Name]</li>
          <li>One line on who you are and what you bring (name the animals).</li>
          <li>One line proving you know their venue: &ldquo;Your lawn by the pond is exactly the kind of space we set up on.&rdquo;</li>
          <li>The two things venues care about: you carry insurance and can name them as additional insured on your certificate, and you handle all cleanup.</li>
          <li>Close with a specific ask: &ldquo;Could we be added to your vendor list, or is there a walkthrough you&apos;d like first?&rdquo;</li>
        </ul>
        <h2>The follow-up rhythm</h2>
        <p>
          No reply after one week: reply to your own email with one new line — a
          photo from a recent event works. No reply after two more weeks: one final
          note offering a free 15-minute appearance at their next open house. Open
          houses are how venues audition vendors; say yes to every one. Bring the
          Venue Site Visit Checklist and walk the space while you&apos;re there.
        </p>
        <h2>Keep the list warm</h2>
        <p>
          After every event at a listed venue, email the coordinator two photos and a
          thank-you within 48 hours. That one habit is why some operators stay on
          lists for years while others fall off after a staff change.
        </p>
      </>
    ),
  },
  {
    slug: "schools-daycares-libraries",
    lesson: 5,
    download: "inquiry-intake-form",
    title: "Booking Schools, Daycares, and Libraries",
    summary:
      "Institutions book on budgets, calendars, and approved-vendor lists. How they buy, the paperwork they ask for, who to contact, and the pitch email.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "How institutions buy",
      "The paperwork they will ask for",
      "Who to contact",
      "The pitch email",
      "After the visit",
    ],
    teaser: (
      <>
        <p>
          Schools, daycares, and libraries book on calendars, budgets, and approval
          lists — not impulse. That makes them slower to land and far steadier once
          you&apos;re in. One district that adds you to its approved-vendor list can
          mean repeat bookings every spring.
        </p>
      </>
    ),
    body: (
      <>
        <h2>How institutions buy</h2>
        <p>
          Field trips and assemblies come out of set budgets, and many districts only
          pay vendors who are registered with them. Libraries plan summer reading
          programs months ahead, often around a theme announced the year before.
          Daycares move fastest: the director usually decides alone.
        </p>
        <h2>The paperwork they will ask for</h2>
        <ul>
          <li>A W-9 so they can pay you.</li>
          <li>A certificate of insurance naming the school or district.</li>
          <li>Any exhibitor license your operation holds.</li>
          <li>Some districts require background checks for staff who work around children — ask early.</li>
          <li>An invoice they can pay against a purchase order.</li>
        </ul>
        <p>Keep these as ready-to-send PDFs before you pitch. Speed on paperwork wins school bookings.</p>
        <h2>Who to contact</h2>
        <ul>
          <li><strong>Daycares and preschools:</strong> the director.</li>
          <li><strong>Elementary schools:</strong> the front office, then the PTA/PTO events chair or the kindergarten team lead.</li>
          <li><strong>Districts:</strong> the purchasing or vendor-registration office.</li>
          <li><strong>Libraries:</strong> the youth services or children&apos;s librarian.</li>
        </ul>
        <h2>The pitch email</h2>
        <ul>
          <li><strong>Subject:</strong> Mobile farm visit for [School] — a field trip without the bus</li>
          <li>One line on what you bring, naming the animals.</li>
          <li>The logistics they need to say yes: space required, 20–30 minutes per class, how many classes fit in a morning.</li>
          <li>&ldquo;W-9 and insurance certificate ready to send.&rdquo;</li>
          <li>The ask: &ldquo;Who handles field-trip vendors at [School]?&rdquo;</li>
        </ul>
        <h2>After the visit</h2>
        <p>
          Send photos the school can use in its newsletter (with permission), and put
          a rebooking email on your calendar for the same month next year. Log every
          inquiry on the Event Inquiry Intake Form so next year&apos;s pitch starts with
          last year&apos;s details.
        </p>
      </>
    ),
  },
  {
    slug: "fairs-and-festivals",
    lesson: 6,
    download: "animal-care-transport-log",
    title: "Fairs and Festivals: Vendor Applications That Get Accepted",
    summary:
      "Finding fairs and festivals, what vendor applications ask for, animal health paperwork, flat-fee vs. per-ride pricing, and turning crowds into bookings.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Finding the events",
      "What vendor applications ask for",
      "Animal health paperwork",
      "Pricing a fair: flat fee vs. per ride",
      "Turning fair crowds into bookings",
    ],
    teaser: (
      <>
        <p>
          County fairs, festivals, and harvest events put thousands of families in
          front of your animals in a single weekend — and some of them book parties
          afterward. Getting in means vendor applications that open early and
          paperwork that&apos;s stricter than a backyard party.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Finding the events</h2>
        <p>
          Start your list in winter. Check your state fair association, county fair
          boards, chamber of commerce event calendars, and city parks and recreation
          departments. Note each event&apos;s application open and close dates.
        </p>
        <h2>What vendor applications ask for</h2>
        <ul>
          <li>A certificate of insurance naming the fair as additional insured, often with stated minimum limits.</li>
          <li>Any exhibitor license your operation holds.</li>
          <li>Space dimensions, a site sketch, and power and water needs.</li>
          <li>Staff count and references from past events.</li>
        </ul>
        <h2>Animal health paperwork</h2>
        <p>
          Animals crossing state lines generally need a Certificate of Veterinary
          Inspection from an accredited veterinarian, and many fairs set their own
          health or vaccination requirements on top. Rules vary by state and species,
          so check the fair&apos;s rules and your state veterinarian&apos;s office well
          ahead. Keep the Animal Care &amp; Transport Log current — it&apos;s the record
          you&apos;ll reach for when someone asks.
        </p>
        <h2>Pricing a fair: flat fee vs. per ride</h2>
        <p>
          A flat appearance fee (the fair pays you) is predictable. Per-ride or
          per-ticket pricing (you collect) can pay more on a big crowd but risks a
          rainy weekend. Ask for last year&apos;s gate count before you choose.
        </p>
        <h2>Turning fair crowds into bookings</h2>
        <ul>
          <li>A QR code sign that goes to your PAWS listing.</li>
          <li>A stack of flyers from the flyer template.</li>
          <li>A table card: &ldquo;Planning a party? We come to you.&rdquo;</li>
          <li>A sign-up sheet for a seasonal booking discount, so you leave with names.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "facebook-groups-and-parent-groups",
    lesson: 7,
    title: "Facebook Groups and Parent Groups: Get Recommended, Not Banned",
    summary:
      "How to show up when a local parent asks for a petting zoo or pony rides — finding the groups, reading the rules, and the answer template that works.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Find the groups that matter",
      "Read the rules first",
      "Being recommended beats self-promoting",
      "The answer template",
      "Your own page",
    ],
    teaser: (
      <>
        <p>
          When a parent asks a local Facebook group &ldquo;anyone know a petting zoo
          for a 4th birthday?&rdquo;, the answers in the next hour decide who gets the
          call. Being the name that comes up — without spamming — is a skill you can
          learn.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Find the groups that matter</h2>
        <p>
          Search Facebook for &ldquo;[town] moms,&rdquo; &ldquo;[county] parents,&rdquo;
          &ldquo;[city] events,&rdquo; and neighborhood groups. Check Nextdoor too.
          Join five to ten that cover your service area, and turn on notifications
          for posts that mention your keywords.
        </p>
        <h2>Read the rules first</h2>
        <p>
          Many groups ban business posts except on a set promotion day. Breaking the
          rule gets you removed — and group admins talk to each other.
        </p>
        <h2>Being recommended beats self-promoting</h2>
        <p>
          The best mention comes from a happy client. In your post-party follow-up,
          ask the host to tag you if anyone in their groups asks. When you answer a
          request yourself, answer the actual question first.
        </p>
        <h2>The answer template</h2>
        <p>
          &ldquo;We&apos;re a mobile petting zoo out of [town]. For a 4th birthday we&apos;d
          usually suggest our one-hour package — goats, bunnies, and ducks. Happy to
          send dates and pricing: [link].&rdquo; Short, specific, and one link — your
          website or your PAWS listing.
        </p>
        <h2>Your own page</h2>
        <p>
          Post weekend photos (with permission), list your service area and packages,
          and pin a post with how to book. When someone recommends you, your page is
          the first thing they click.
        </p>
      </>
    ),
  },
  {
    slug: "referral-partners",
    lesson: 8,
    download: "flyer-template",
    title: "Referral Partners: Bounce Houses, Planners, and Photographers",
    summary:
      "The businesses that talk to your customers every weekend, how to start the conversation, making referrals easy, and handling referral fees.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Who refers animal attractions",
      "The first conversation",
      "Make referrals easy",
      "Referral fees: decide up front",
      "Keep partners warm",
    ],
    teaser: (
      <>
        <p>
          Bounce house companies, party planners, and photographers talk to your exact
          customers every weekend. A handful of referral partners can send more
          bookings than any ad — and it costs you a few coffees and some referrals
          sent back their way.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Who refers animal attractions</h2>
        <ul>
          <li>Party rental companies: bounce houses, tables, tents.</li>
          <li>Kids&apos; party planners and event coordinators.</li>
          <li>Event venues and farm venues.</li>
          <li>Photographers who shoot birthdays and family sessions.</li>
          <li>Face painters, magicians, and other entertainers.</li>
          <li>Other animal operators for overflow — a beer burro service and a petting zoo don&apos;t compete.</li>
        </ul>
        <h2>The first conversation</h2>
        <p>
          Offer before you ask: &ldquo;When our clients ask about tents and tables, who
          should we send them to?&rdquo; Sending the first referral makes every later
          conversation easier.
        </p>
        <h2>Make referrals easy</h2>
        <p>
          Give each partner a one-page flyer (the fillable flyer template takes five
          minutes) with your packages and booking link. Ask clients how they heard of
          you so you know which partners send work.
        </p>
        <h2>Referral fees: decide up front</h2>
        <p>
          Some partners expect a fee or a discount for their clients. Decide what you
          offer, then put it in an email so nobody remembers it differently six
          months later.
        </p>
        <h2>Keep partners warm</h2>
        <p>
          Thank every referral within a day. Send referrals back. A holiday card with
          a photo of the animals keeps you top of mind for next season.
        </p>
      </>
    ),
  },
  {
    slug: "short-videos-that-book-parties",
    lesson: 9,
    title: "Short Videos That Book Parties",
    summary:
      "What to film, how to film it alone, captions that local searchers find, parent permission, and a weekly posting rhythm.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "What to film",
      "Filming without a crew",
      "Captions and hashtags",
      "Permission from parents",
      "A weekly posting rhythm",
    ],
    teaser: (
      <>
        <p>
          A 15-second clip of a goat nibbling a birthday balloon sells a party better
          than any paragraph. Short video on Instagram Reels, TikTok, and Facebook is
          free reach for animal businesses — animals are what people stop scrolling
          for.
        </p>
      </>
    ),
    body: (
      <>
        <h2>What to film</h2>
        <ul>
          <li>Animal introductions: &ldquo;Meet Waffles, our Nigerian dwarf goat.&rdquo;</li>
          <li>A sped-up clip of your pen going up in 20 minutes.</li>
          <li>First-touch reactions from kids (with permission).</li>
          <li>Behind the scenes: feeding, grooming, loading the trailer.</li>
          <li>Seasonal costumes and decorations.</li>
          <li>&ldquo;What&apos;s included in our one-hour package&rdquo; walk-throughs.</li>
        </ul>
        <h2>Filming without a crew</h2>
        <p>
          Shoot vertical, phone held at the animals&apos; eye level. Keep clips 10 to
          20 seconds, use natural sound, and film in open shade. The first two
          seconds decide whether anyone keeps watching, so start on the animal, not
          an intro.
        </p>
        <h2>Captions and hashtags</h2>
        <p>
          Put your town and service in the caption — &ldquo;Mobile petting zoo in Mesa,
          AZ&rdquo; — because that&apos;s what local searchers type. Three to five
          hashtags: your town, your county, and your service.
        </p>
        <h2>Permission from parents</h2>
        <p>
          Never post a child&apos;s face without a parent&apos;s permission. Add a photo
          line to your booking form so hosts can opt in ahead of time. When in
          doubt, film hands and animals only.
        </p>
        <h2>A weekly posting rhythm</h2>
        <p>
          Two or three clips a week is enough. Film several at one event, then post
          the same clip to all three platforms.
        </p>
      </>
    ),
  },
  {
    slug: "review-engine-for-operators",
    lesson: 10,
    title: "Get 5-Star Reviews on Autopilot",
    summary:
      "The post-event follow-up sequence that turns happy hosts into Google reviews — with copy-paste messages.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Set up once (20 minutes)",
      "The three-step sequence",
      "Photos multiply everything",
      "Answer every review",
    ],
    teaser: (
      <>
        <p>
          Reviews decide who gets the booking when a planner compares three operators
          at 11pm. The operators with 40 reviews didn&apos;t get them by being 40 times
          better — they ask every client, the same way, at the same moment. Here is
          the sequence.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Set up once (20 minutes)</h2>
        <ul>
          <li>Claim your Google Business Profile and get your direct review link (Profile → Ask for reviews → copy link).</li>
          <li>Shorten it and save it as a phone keyboard shortcut so you can text it in five seconds.</li>
        </ul>
        <h2>The three-step sequence</h2>
        <ul>
          <li><strong>At teardown, in person:</strong> &ldquo;I&apos;ll text you tomorrow with a review link — it&apos;s the single biggest thing that helps a small operation like ours.&rdquo;</li>
          <li><strong>Next morning, by text:</strong> &ldquo;Thanks again for having [animal names] out yesterday! If you have 60 seconds, a Google review helps us more than any ad: [link]. Either way — hope the party was a hit.&rdquo;</li>
          <li><strong>Day 4, one nudge only:</strong> &ldquo;No pressure at all — resending the review link in case it got buried: [link].&rdquo; Then stop. Two asks is the ceiling.</li>
        </ul>
        <h2>Photos multiply everything</h2>
        <p>
          Send two or three good photos from the event with the first text. Clients
          who receive photos post them with the review, and reviews with photos get
          read.
        </p>
        <h2>Answer every review</h2>
        <p>
          Reply to each one within a week — two sentences, name an animal: &ldquo;So
          glad Waffles was the hit of the party!&rdquo; For a rare bad one: reply once,
          calmly, with the fix you offered, and take the rest offline. Never buy
          reviews and never post fake ones — one flagged review can sink the profile,
          and the FTC fines for fabricated reviews are real.
        </p>
      </>
    ),
  },
  {
    slug: "event-day-run-sheet",
    lesson: 11,
    download: "event-day-run-sheet",
    title: "The Event-Day Run Sheet",
    summary:
      "A repeatable event-day system: load-out, setup, signage, animal rotation, and teardown — with the printable run sheet and event signs.",
    category: "Operations",
    memberOnly: true,
    printable: true,
    outline: [
      "Event header",
      "Load-out (night before)",
      "On site, including the three event signs",
      "Teardown",
    ],
    teaser: (
      <>
        <p>
          Print one run sheet per event. Fill the header in the truck before you pull
          out, and initial each block as it happens. When two events run the same
          weekend, the sheet is what keeps them from blurring together.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Event header</h2>
        <ul>
          <li><span className="checkbox" />Client name and phone</li>
          <li><span className="checkbox" />Venue address and gate or loading notes</li>
          <li><span className="checkbox" />Start time and off-site-by time</li>
          <li><span className="checkbox" />Insurance certificate sent to the venue (date)</li>
          <li><span className="checkbox" />Balance collected (method)</li>
        </ul>
        <h2>Load-out (night before)</h2>
        <ul>
          <li><span className="checkbox" />Animals selected and checked — eyes, gait, appetite</li>
          <li><span className="checkbox" />Fencing panels, ground cover, shade canopy</li>
          <li><span className="checkbox" />Water buckets, feed, hay for the day</li>
          <li><span className="checkbox" />Hand-wash station, refill jug, sanitizer</li>
          <li><span className="checkbox" />First-aid kit (people) and animal kit</li>
          <li><span className="checkbox" />Event signs: hand washing, ask before petting, don&apos;t feed the animals</li>
        </ul>
        <h2>On site</h2>
        <ul>
          <li><span className="checkbox" />Pen up, gates latched, shade over water</li>
          <li><span className="checkbox" />Wash station at the pen exit with the hand washing sign posted</li>
          <li><span className="checkbox" />&ldquo;Ask before petting&rdquo; and &ldquo;Don&apos;t feed&rdquo; signs at the pen entrance</li>
          <li><span className="checkbox" />Walk the client through the rules before guests arrive</li>
          <li><span className="checkbox" />Rotation plan: rest each animal ______ minutes per hour</li>
        </ul>
        <h2>Teardown</h2>
        <ul>
          <li><span className="checkbox" />Headcount every animal before the trailer closes</li>
          <li><span className="checkbox" />Ground cover bagged and hauled — leave nothing</li>
          <li><span className="checkbox" />Photos of the clean site</li>
          <li><span className="checkbox" />Thank the client in person; mention the review text they&apos;ll get tomorrow</li>
        </ul>
        <p>
          The three event signs are separate member downloads, each printed with
          your business name.
        </p>
      </>
    ),
  },
];
