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
  {
    slug: "one-page-booking-website",
    lesson: 12,
    download: "inquiry-intake-form",
    title: "A One-Page Website That Takes Bookings",
    summary:
      "You don't need a big site. One page with your animals, packages, service area, and a booking form that asks the right questions is enough to turn searches into inquiries.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "What goes at the top of the page",
      "The booking form: fields that save a phone call",
      "Packages, photos, and the service area",
      "Details venues and schools look for",
      "Domain, phone view, and keeping it current",
    ],
    teaser: (
      <>
        <p>
          Your Google profile, Facebook answers, and flyers all point somewhere. If
          that somewhere is a social page with no prices and no form, a share of
          those parents give up and call the next operator. One clear page that
          takes an inquiry closes that gap, and you can build it in a weekend.
        </p>
      </>
    ),
    body: (
      <>
        <h2>What goes at the top of the page</h2>
        <p>
          A visitor should know three things before they scroll: what you bring,
          where you go, and how to book. Put it in one line under your business
          name — &ldquo;Mobile petting zoo and pony rides for parties, schools, and
          festivals in the Tucson area&rdquo; — then one photo of your animals with
          guests, then a button that jumps to the booking form.
        </p>
        <h2>The booking form: fields that save a phone call</h2>
        <ul>
          <li>Name, phone, and email.</li>
          <li>Event date, start time, and how long they want you.</li>
          <li>Event address, or at least the city and ZIP, so you can figure travel.</li>
          <li>Event type (birthday, school, church, company, festival) and guest count with ages.</li>
          <li>Setup surface: grass, pavement, indoor, or not sure.</li>
          <li>Which package they&apos;re interested in.</li>
          <li>&ldquo;How did you hear about us?&rdquo; — the answer feeds your lead tracking (lesson 19).</li>
          <li>A yes/no for photo permission, so you know before event day.</li>
        </ul>
        <p>
          Keep it to one screen on a phone. A form with 25 questions gets fewer
          inquiries than one with ten. Ask the rest on the follow-up call using the
          Event Inquiry Intake Form.
        </p>
        <h2>Packages, photos, and the service area</h2>
        <p>
          List your packages with what each includes: animal count, duration, and
          handlers. Show a starting price or a &ldquo;from&rdquo; price if you&apos;re
          comfortable with it — visitors who see a number and still inquire are
          further along. Add six to ten real photos from events, and name the towns
          you serve in plain text, since that&apos;s what local searchers type.
        </p>
        <h2>Details venues and schools look for</h2>
        <ul>
          <li>A line saying you carry insurance and can send a certificate naming the venue.</li>
          <li>How you handle hand washing and animal rest.</li>
          <li>What space and access you need.</li>
          <li>Your PAWS member badge, linked to your directory listing.</li>
        </ul>
        <h2>Domain, phone view, and keeping it current</h2>
        <p>
          Buy a domain with your business name, and use a site builder that has a
          built-in form so inquiries land in your email. Open the page on your own
          phone before you share it — most visitors will see it there first. Twice
          a year, swap in new photos and check that prices and packages match your
          current rate sheet. Then put the link on your Google profile, your PAWS
          listing, and every flyer.
        </p>
      </>
    ),
  },
  {
    slug: "deposits-contracts-rain-policies",
    lesson: 13,
    download: "rate-sheet-template",
    title: "Deposits, Contracts, and Rain Policies",
    summary:
      "Put the deal in writing before you hold a date: what the booking agreement covers, how much deposit to take, and how to handle cancellations, rain, and heat.",
    category: "Business",
    memberOnly: true,
    printable: false,
    outline: [
      "Why every booking gets a written agreement",
      "What the agreement covers",
      "Deposits: how much and when",
      "Cancellation and reschedule terms",
      "Rain, heat, and wind calls",
      "Getting it signed and paid",
    ],
    teaser: (
      <>
        <p>
          A handshake booking works until the host cancels the night before, or it
          rains and nobody agreed on what happens next. A short written agreement
          and a deposit turn those arguments into a sentence you can point to.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Why every booking gets a written agreement</h2>
        <p>
          It isn&apos;t about distrust. A one- or two-page agreement makes sure you
          and the client remember the same date, time, address, and price. It also
          tells the client what you need from them on the day, which prevents most
          problems before they start. Have a local attorney review your template
          once; then you reuse it for every event.
        </p>
        <h2>What the agreement covers</h2>
        <ul>
          <li>Client name, event address, date, arrival time, and end time.</li>
          <li>Package, animal list, number of handlers, and total price.</li>
          <li>Travel fee, if any, and any add-ons.</li>
          <li>Deposit amount, balance amount, and when the balance is due.</li>
          <li>What the client provides: level ground, access for the trailer, a contact on site.</li>
          <li>Your animal-care rules: rest breaks, no feeding, hand washing, and your right to end the visit if an animal is at risk.</li>
          <li>Cancellation, reschedule, and weather terms.</li>
          <li>Photo permission.</li>
        </ul>
        <h2>Deposits: how much and when</h2>
        <p>
          Many operators take 25 to 50 percent to hold a date. Lean toward the high
          end for peak weekends and holidays, when a cancellation is hardest to
          refill. Don&apos;t hold a date without the deposit in hand — &ldquo;I&apos;ll
          pay next week&rdquo; is how double-bookings happen.
        </p>
        <h2>Cancellation and reschedule terms</h2>
        <p>
          Pick a cutoff and state it plainly. A common pattern: cancel more than 14
          to 30 days out and the deposit moves to a new date within a set window;
          cancel inside the cutoff and the deposit is kept. Whatever you pick, write
          whether the deposit is refundable, transferable to a new date, or neither.
          Vague terms cause more disputes than strict ones.
        </p>
        <h2>Rain, heat, and wind calls</h2>
        <ul>
          <li>Say who makes the weather call and by when — for example, you decide by 8am on the event day.</li>
          <li>Name your limits: lightning, sustained rain, heat above a temperature you set, high wind for tents and canopies.</li>
          <li>Offer one free weather reschedule within a set window, as lesson 3 suggests.</li>
          <li>If the client has a covered or indoor backup space, write it into the agreement.</li>
        </ul>
        <p>
          Your animals&apos; welfare comes first. Say so in the agreement, and the
          heat call stops being a negotiation on the driveway.
        </p>
        <h2>Getting it signed and paid</h2>
        <p>
          Use an e-signature tool or an invoicing app that attaches terms and takes
          the deposit in one step. Send it the same day as the quote, while the
          client is still excited. Collect the balance before you unload or a few
          days ahead — never chase it after the animals are back home. Ask a venue
          whether it needs a certificate of insurance at this stage, too, so the
          paperwork is done weeks before the event.
        </p>
      </>
    ),
  },
  {
    slug: "corporate-events-company-picnics",
    lesson: 14,
    title: "Corporate Events and Company Picnics",
    summary:
      "Companies book family days, picnics, and employee appreciation events with bigger budgets and fewer questions about price. Who to contact, what they ask for, and how to pitch.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Who books for a company",
      "Where to find them",
      "What corporate buyers ask for",
      "The pitch email",
      "Pricing and invoicing a business",
    ],
    teaser: (
      <>
        <p>
          Company picnics, family days, and employee appreciation events often run
          longer than a birthday party, draw more guests, and come with a budget
          already set. The person booking isn&apos;t spending their own money. They
          care more about easy paperwork and a smooth day than about saving a
          little on the price.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Who books for a company</h2>
        <ul>
          <li><strong>HR or people teams:</strong> employee appreciation days, family picnics, wellness events.</li>
          <li><strong>Office managers and executive assistants:</strong> smaller office parties and holiday events.</li>
          <li><strong>Corporate event planners:</strong> outside firms that book vendors for several companies.</li>
          <li><strong>Employee committees:</strong> the &ldquo;fun committee&rdquo; at a hospital, plant, or school district.</li>
        </ul>
        <h2>Where to find them</h2>
        <p>
          Start with the 20 largest employers in your service area — hospitals,
          manufacturers, distribution centers, school districts, and county
          offices. Check your chamber of commerce member list and business
          journal. Contact local event planners who handle corporate work, and ask
          venues that host company picnics (parks, farms, event barns) which
          companies book with them. Your referral partners from lesson 8 hear
          about these events too.
        </p>
        <h2>What corporate buyers ask for</h2>
        <ul>
          <li>A certificate of insurance, often naming the company and sometimes the venue.</li>
          <li>A W-9 and an invoice they can pay by check or card; some pay 30 days after the event.</li>
          <li>A vendor setup form or registration in their payment system.</li>
          <li>Clear setup needs: space, power, water, arrival time.</li>
          <li>Your safety practices: hand washing, handler count, and how you manage a crowd.</li>
        </ul>
        <p>
          Keep these ready to send as PDFs, just as you do for schools.
        </p>
        <h2>The pitch email</h2>
        <ul>
          <li><strong>Subject:</strong> Animal attraction for [Company]&apos;s summer picnic</li>
          <li>One line on what you bring, naming the animals and how many guests you handle per hour.</li>
          <li>One line on why it fits: families with kids, a photo spot, something different from the usual bounce house.</li>
          <li>&ldquo;Insurance certificate and W-9 ready to send.&rdquo;</li>
          <li>The ask: &ldquo;Who plans employee events at [Company]? I&apos;d be glad to send packages for next season.&rdquo;</li>
        </ul>
        <p>
          Time it right. Summer picnics get planned in the spring, and holiday
          parties in September and October. Your seasonal calendar from lesson 2
          has the dates.
        </p>
        <h2>Pricing and invoicing a business</h2>
        <p>
          Corporate events usually need more handlers and longer hours, so quote a
          package built for the crowd, not your birthday package stretched out.
          Ask the expected headcount and how many children will attend. Add a
          handler for each extra block of guests you&apos;d struggle to watch
          alone. If the company pays net 30, still take a deposit to hold the date,
          and put the payment terms on the invoice.
        </p>
      </>
    ),
  },
  {
    slug: "holiday-bookings-easter-fall-christmas",
    lesson: 15,
    title: "Holiday Bookings: Easter, Fall, and Christmas",
    summary:
      "Holidays bring the highest-demand dates of the year. How to pitch and price Easter events, fall festivals and Halloween, and Christmas reindeer, nativity, and photo events.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Book each holiday a season ahead",
      "Easter and spring: bunnies, chicks, and photo days",
      "Fall and Halloween",
      "Christmas: reindeer, nativities, and photo events",
      "Holiday pricing and peak dates",
    ],
    teaser: (
      <>
        <p>
          Holiday weekends are some of the most requested dates an animal
          operator gets all year. Churches, garden centers, malls, and towns all want
          the same few Saturdays. The operators who get them pitched months before
          the holiday — and had a holiday package ready when the call came.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Book each holiday a season ahead</h2>
        <ul>
          <li><strong>Easter:</strong> pitch in January and February.</li>
          <li><strong>Fall and Halloween:</strong> pitch in July and August.</li>
          <li><strong>Christmas:</strong> pitch in August through early October. Many December dates are gone by Thanksgiving.</li>
        </ul>
        <p>
          Email every past holiday client the week your pitch window opens and
          offer them first pick of dates before you announce publicly.
        </p>
        <h2>Easter and spring: bunnies, chicks, and photo days</h2>
        <p>
          Churches, garden centers, apartment communities, and photographers book
          spring events. Photo days are a strong fit: a photographer books you for
          a set block, sets up a backdrop, and sells sessions while you handle the
          animals. Chicks and ducklings draw crowds but carry a higher salmonella
          risk, so keep a hand-washing station right at the pen exit, keep the
          chicks away from faces, and post the hand washing sign. Never sell or give
          away animals at an event.
        </p>
        <h2>Fall and Halloween</h2>
        <p>
          Pumpkin patches, harvest festivals, church trunk-or-treats, and school
          fall carnivals. Pumpkin patches often want you every weekend in October,
          so quote a weekend-series rate as well as single days. Costumes and hay
          bale decor make photos that sell next year&apos;s bookings. Keep costumes
          light and short-lived for the animals, and skip anything an animal tries
          to remove.
        </p>
        <h2>Christmas: reindeer, nativities, and photo events</h2>
        <ul>
          <li><strong>Living nativities:</strong> churches want a donkey, sheep, and goats, sometimes a camel. Ask about the setting — outdoor, evening, how many hours in the cold — and plan blankets, lighting, and rest.</li>
          <li><strong>Reindeer:</strong> high demand, but they come with their own permits, health rules, and care needs that vary by state. Check with your state veterinarian and wildlife agency before you buy or book.</li>
          <li><strong>Santa photo events:</strong> malls, garden centers, tree lots, and photographers book animals for a few hours as a photo add-on. Put the animal next to Santa, not in a child&apos;s lap.</li>
          <li><strong>Company holiday parties:</strong> see lesson 14.</li>
        </ul>
        <h2>Holiday pricing and peak dates</h2>
        <p>
          Holiday weekends are your peak dates, so charge your peak rate and take a
          higher deposit. Set a minimum booking length for the busiest Saturdays,
          and make weekday or early-evening slots cheaper to fill the rest of the
          week. Write cold-weather terms into the agreement: when you&apos;ll shorten
          a visit and when you&apos;ll cancel for the animals&apos; sake.
        </p>
      </>
    ),
  },
  {
    slug: "repeat-bookings-past-customers",
    lesson: 16,
    title: "Repeat Bookings: Staying in Touch With Past Customers",
    summary:
      "The cheapest booking is the one you already earned. Build a customer list, send an annual birthday reminder, and keep a simple email list that brings families back.",
    category: "Marketing",
    memberOnly: true,
    printable: false,
    outline: [
      "Your customer list is worth more than any ad",
      "Collect what you need at booking",
      "The annual birthday reminder",
      "A simple email list",
      "Schools, churches, and the rebooking calendar",
    ],
    teaser: (
      <>
        <p>
          A child who loved the goats at her fourth birthday still has a fifth
          birthday coming, and a younger brother. Most operators never contact a
          client again after the review text. A list and two or three messages a
          year bring a share of those families back without paying for a single ad.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Your customer list is worth more than any ad</h2>
        <p>
          Keep one spreadsheet or customer app with every booking: name, email,
          phone, event date, event type, child&apos;s name and age if it was a
          birthday, package booked, and how they found you. Add every past
          booking you can find in your texts and email, then keep it current after
          each event. This is the list everything else in this lesson runs on.
        </p>
        <h2>Collect what you need at booking</h2>
        <ul>
          <li>The child&apos;s first name and the birthday date, not only the party date.</li>
          <li>A checkbox to receive occasional emails, with a plain description: &ldquo;birthday reminders and seasonal dates, a few times a year.&rdquo;</li>
          <li>Separate permission if you plan to send marketing texts. Texting rules are stricter than email, so get clear consent first.</li>
        </ul>
        <h2>The annual birthday reminder</h2>
        <p>
          Set a reminder six to eight weeks before each child&apos;s next birthday.
          Send a short personal note: &ldquo;Hi [parent] — last year Waffles came to
          [child]&apos;s 4th birthday. If you&apos;re planning the 5th, we&apos;d love to
          come back. Spring weekends are booking now: [link].&rdquo; Use the real
          animal and child name from your records. It reads like a note from a
          person because it is one.
        </p>
        <h2>A simple email list</h2>
        <p>
          Use a basic email service, not your personal inbox, so every message has
          an unsubscribe link and your business address. Send three to six emails a
          year, timed to your seasons: spring birthdays, summer, fall festivals,
          and holidays. Each email gets one photo, one or two sentences of news (a
          new baby goat, a new package), and one booking link. Past clients are
          also the people most likely to tell a friend, so add a line asking them
          to forward it.
        </p>
        <h2>Schools, churches, and the rebooking calendar</h2>
        <p>
          Institutions repeat on a calendar. After each school visit, library
          program, church event, or festival, put a rebooking email on your
          calendar for the same month next year, or earlier if their planning
          window opens earlier. A short note that says &ldquo;Same date as last
          year?&rdquo; often gets a yes before they look at anyone else.
        </p>
      </>
    ),
  },
  {
    slug: "packages-and-add-ons",
    lesson: 17,
    download: "rate-sheet-template",
    title: "Packages and Add-Ons That Raise the Average Booking",
    summary:
      "Most bookings can be worth more without more events. How to build three package tiers, which add-ons clients say yes to, and when to offer them.",
    category: "Business",
    memberOnly: true,
    printable: false,
    outline: [
      "Three tiers, and why the middle one sells",
      "Add-ons clients say yes to",
      "Offer add-ons at the right moment",
      "Packages built for one event type",
      "Track what sells",
    ],
    teaser: (
      <>
        <p>
          You only have so many weekends. Once they&apos;re full, the way to earn
          more is a higher average booking — and the easiest way to get there is a
          clear package menu with a few add-ons the client can pick without a long
          phone call.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Three tiers, and why the middle one sells</h2>
        <p>
          Offer three named packages. The smallest covers a short backyard party.
          The middle one is the package you want most people to book, with more
          animals, more time, or an extra handler. The top one adds the most —
          longer time, pony rides plus the petting zoo, a photo setup. Build the
          middle tier first, since it&apos;s the one you&apos;ll describe on most calls,
          then price the top tier so the middle looks like good value next to it.
        </p>
        <h2>Add-ons clients say yes to</h2>
        <ul>
          <li>Extra half hour or hour.</li>
          <li>Extra handler for larger groups.</li>
          <li>A second attraction: pony rides with a petting zoo, a bunny or chick corner.</li>
          <li>Feed cups, if your animals and setup allow controlled feeding.</li>
          <li>A themed photo backdrop or costumes for seasonal events.</li>
          <li>Birthday-child extras: first animal pick, a certificate, or a photo with their favorite animal.</li>
          <li>Early setup or a set arrival time for a tight schedule.</li>
        </ul>
        <p>
          Every add-on should be something you can deliver without hurting the
          animals&apos; rest schedule. If an extra hour would push them past their
          limit, sell a second visit block instead.
        </p>
        <h2>Offer add-ons at the right moment</h2>
        <p>
          The best time is when you send the quote, not on event day. Put two or
          three add-ons right under the package price with their prices next to
          them. Then ask one question on the call: &ldquo;How many kids are
          coming?&rdquo; If the answer is above what one handler can watch,
          recommending the extra handler is good service, not a pitch.
        </p>
        <h2>Packages built for one event type</h2>
        <p>
          A school, a church festival, and a birthday need different things. A
          &ldquo;Classroom Visit&rdquo; package priced per class, a &ldquo;Festival
          Day&rdquo; package priced for a full day with two handlers, and a
          &ldquo;Birthday&rdquo; package with a birthday-child extra make the choice
          easy for each buyer. You&apos;re selling the same animals, described the
          way each client thinks about the event.
        </p>
        <h2>Track what sells</h2>
        <p>
          Log the package and add-ons on every booking. After a season, cut add-ons
          nobody picked and raise the price on ones nearly everyone picked. Put the
          final menu on your rate sheet so every quote looks the same.
        </p>
      </>
    ),
  },
  {
    slug: "hiring-training-handlers",
    lesson: 18,
    download: "event-day-run-sheet",
    title: "Hiring and Training Handlers and Helpers",
    summary:
      "When you can't be at every event or watch every animal alone, you need help. What the job is, where to find people, how to train them, and the rules every handler follows.",
    category: "Operations",
    memberOnly: true,
    printable: false,
    outline: [
      "Write down what the job is",
      "Where to find helpers",
      "Employee or contractor: ask before you pay",
      "Train by shadowing",
      "Rules every handler follows",
      "Keep the good ones",
    ],
    teaser: (
      <>
        <p>
          One person can&apos;t watch a pen of goats, help a toddler hold a bunny,
          answer a parent&apos;s question, and keep the hand-washing line moving at
          the same time. A trained helper makes events safer and lets you say yes
          to bigger bookings. Hiring one well takes more planning than most
          operators expect.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Write down what the job is</h2>
        <p>
          Before posting anything, list what a helper does: loading, setup, watching
          the pen entrance, guiding small children, running the wash station,
          teardown, and cleanup. Note what they don&apos;t do on day one, such as
          driving the trailer or handling a horse alone. That list becomes your job
          post and your training checklist.
        </p>
        <h2>Where to find helpers</h2>
        <ul>
          <li>4-H and FFA members and their families, and former members now in college.</li>
          <li>Students in veterinary technician or animal science programs.</li>
          <li>Barn workers and riders from local stables, for pony and horse work.</li>
          <li>Retired teachers and daycare workers, who are good with crowds of small children.</li>
          <li>Friends of current helpers who&apos;ve already seen how you work.</li>
        </ul>
        <p>
          Ask every candidate to work one paid trial event alongside you before you
          commit. How they act around animals and kids tells you more than an
          interview.
        </p>
        <h2>Employee or contractor: ask before you pay</h2>
        <p>
          Whether a helper is an employee or an independent contractor depends on
          federal and state rules, not on what you call them. Ask an accountant or
          employment attorney before you pay anyone. Ask your insurance agent too:
          whether your policy covers helpers, and whether you need workers&apos;
          compensation. Schools and some venues require background checks for
          anyone working near children, so find out early.
        </p>
        <h2>Train by shadowing</h2>
        <ul>
          <li><strong>Event 1:</strong> they watch and do teardown. You explain each step on the run sheet as you go.</li>
          <li><strong>Event 2:</strong> they run the wash station and pen entrance with you nearby.</li>
          <li><strong>Event 3:</strong> they run the pen while you handle the client and watch.</li>
        </ul>
        <p>
          Teach each animal by name: who kicks, who bolts at a balloon pop, who
          needs a break first. Give them a printed copy of the Event-Day Run Sheet
          and have them initial each block they complete.
        </p>
        <h2>Rules every handler follows</h2>
        <ul>
          <li>Never leave the pen unwatched, even for a minute.</li>
          <li>Children sit before holding small animals; no animal goes to a standing toddler.</li>
          <li>Every guest washes hands at the exit.</li>
          <li>Any sign of animal stress, the animal comes out — no need to ask first.</li>
          <li>No posting client or child photos on personal accounts.</li>
          <li>Phones away except for emergencies and the owner&apos;s calls.</li>
        </ul>
        <h2>Keep the good ones</h2>
        <p>
          Pay on time, every time. Tell helpers about the schedule as soon as dates
          book, so they can plan around it. A small raise after their first busy
          season, or a bonus for a full holiday weekend, costs less than training
          someone new.
        </p>
      </>
    ),
  },
  {
    slug: "know-your-numbers",
    lesson: 19,
    download: "inquiry-intake-form",
    title: "Know Your Numbers: Bookings, Lead Sources, Mileage, and Profit per Event",
    summary:
      "A simple tracking setup for a small animal business: a booking log, where every lead came from, mileage, and what each event actually earned after costs.",
    category: "Business",
    memberOnly: true,
    printable: false,
    outline: [
      "One spreadsheet, four tabs",
      "Where every lead came from",
      "Mileage and vehicle costs",
      "Profit per event",
      "The monthly review",
    ],
    teaser: (
      <>
        <p>
          Two operators can book the same number of events and end the year in very
          different places. The difference is usually hiding in numbers neither of
          them wrote down: miles driven, hours worked, and which ads brought paying
          clients. A spreadsheet and 15 minutes a week is enough to see them.
        </p>
      </>
    ),
    body: (
      <>
        <h2>One spreadsheet, four tabs</h2>
        <ul>
          <li><strong>Inquiries:</strong> date, name, event type, lead source, quoted price, booked yes or no.</li>
          <li><strong>Bookings:</strong> event date, client, package, add-ons, total price, deposit, balance paid.</li>
          <li><strong>Mileage:</strong> date, start and end location, round-trip miles, purpose.</li>
          <li><strong>Expenses:</strong> date, category (feed, vet, fuel, equipment, helpers, marketing), amount.</li>
        </ul>
        <p>
          A free spreadsheet works. If you already use bookkeeping software, use
          it for expenses and keep the inquiry tab in a spreadsheet.
        </p>
        <h2>Where every lead came from</h2>
        <p>
          Ask every inquiry how they heard about you, and log the answer: Google,
          Facebook group, PAWS directory, referral partner (name them), venue,
          repeat client, flyer, or fair. After a few months, count inquiries and
          bookings from each source. A source that sends many inquiries but few
          bookings may be bringing the wrong buyers. A source that sends three
          inquiries and three bookings is one to feed.
        </p>
        <h2>Mileage and vehicle costs</h2>
        <p>
          Log every business trip the same day, including vet runs and feed
          pickups. The IRS publishes a standard mileage rate each year; ask your
          tax preparer whether to use that rate or your actual vehicle costs, and
          what records they need. Either way, a complete log is what makes the
          deduction hold up.
        </p>
        <h2>Profit per event</h2>
        <p>
          For each event, start with what the client paid. Subtract helper pay,
          fuel or mileage, feed and bedding used, any parking or vendor fees, and
          card processing fees. Then divide what&apos;s left by your total hours,
          counting load-out, driving, setup, teardown, and cleanup at home. That
          hourly number is the one to compare. A short party 50 miles away can earn
          less per hour than a long festival 10 miles away, even if the party paid
          more per minute on site.
        </p>
        <h2>The monthly review</h2>
        <ul>
          <li>Bookings and revenue compared with the same month last year.</li>
          <li>Inquiry-to-booking rate by lead source.</li>
          <li>Average booking total, and how often add-ons were picked (lesson 17).</li>
          <li>Your lowest-earning events per hour — raise those prices or adjust the travel fee.</li>
        </ul>
        <p>
          Set a recurring 30-minute block on the first of each month. Bring the
          numbers to your tax preparer at year end, and they&apos;ll spend less time
          sorting receipts.
        </p>
      </>
    ),
  },
  {
    slug: "add-a-second-team-or-attraction",
    lesson: 20,
    title: "Growing Beyond One Trailer: Adding a Second Team or Attraction",
    summary:
      "When you're turning down bookings, you can add a second team, a second attraction, or both. The signs you're ready, what it takes, and how to test before you spend.",
    category: "Business",
    memberOnly: true,
    printable: false,
    outline: [
      "Signs you are ready",
      "Second team or second attraction",
      "What a second team needs",
      "Running an event you aren't at",
      "Test before you buy",
    ],
    teaser: (
      <>
        <p>
          Turning away bookings on your busiest weekends feels like success, but it
          also means money you could have earned went to someone else. A second
          team or a new attraction can capture it. Adding one too early can also
          stretch your animals, cash, and weekends past what one owner can manage.
        </p>
      </>
    ),
    body: (
      <>
        <h2>Signs you are ready</h2>
        <ul>
          <li>You turned down bookings on most peak weekends for at least one full season, and your numbers (lesson 19) show it.</li>
          <li>You&apos;ve already raised prices (lesson 3) and demand held.</li>
          <li>You have at least one trained helper who could lead an event (lesson 18).</li>
          <li>You have enough cash saved to cover the added animals, equipment, and a slow first season.</li>
        </ul>
        <p>
          If only one or two of these are true, raising prices or adding a higher
          tier package may be the better move for now.
        </p>
        <h2>Second team or second attraction</h2>
        <p>
          A second team doubles the events you can run on one day, with the same
          kind of animals. A second attraction — pony rides added to a petting zoo,
          a reptile show added to a mobile farm — raises what each booking is worth
          and opens new event types. The second attraction is often the cheaper
          step, because you keep one team and one trailer. Look at your inquiry log:
          if you&apos;re losing same-day bookings, add a team; if clients keep
          asking for something you don&apos;t offer, add the attraction.
        </p>
        <h2>What a second team needs</h2>
        <ul>
          <li>Enough animals to rotate without overworking any of them across two events.</li>
          <li>A second vehicle and trailer, or a reliable rental option.</li>
          <li>A full set of fencing, shade, wash station, first-aid and animal kits, and signs.</li>
          <li>A trained lead handler who has run events under your supervision.</li>
          <li>A call with your insurance agent before the first event, to cover the added vehicle, animals, and staff.</li>
          <li>Any added permits or licenses your state or the USDA requires for the new animal count.</li>
        </ul>
        <h2>Running an event you aren&apos;t at</h2>
        <p>
          Your second team runs on the same run sheet, the same animal-care rules,
          and the same client script as yours. Have the lead handler text you a
          photo at setup and at teardown, and call the client yourself the next
          morning. That call tells you how the day went and starts the review
          request. Expect to spend your first season fixing things the second team
          does differently.
        </p>
        <h2>Test before you buy</h2>
        <p>
          Before buying a second trailer or new animals, try a smaller step. Lease
          or partner with another PAWS member for overflow dates, or run a
          second-team pilot on a few peak weekends with rented equipment. If the
          pilot covers its costs and the bookings keep coming, you have your answer
          with far less money at risk.
        </p>
      </>
    ),
  },
];
