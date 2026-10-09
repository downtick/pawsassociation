import type { ReactNode } from "react";
import { COURSE } from "./course";

export interface ArticleContent {
  slug: string;
  title: string;
  summary: string;
  category: "Hiring Guides" | "Safety" | "Business" | "Marketing" | "Operations";
  memberOnly: boolean;
  printable: boolean;
  /** Members-only body. For course lessons the full lesson = teaser + body. */
  body: ReactNode;
  /** Course lessons: PUBLIC opening shown to everyone at /learn/[slug]. */
  teaser?: ReactNode;
  /** Course lessons: section headings listed publicly as "what's inside". */
  outline?: string[];
  /** Position in the "Grow Your Animal Business" course. */
  lesson?: number;
  /** Slug of the companion member download (content/downloads.ts). */
  download?: string;
}

// v1 article library. Public articles render at /learn/[slug] (the SEO
// surface); memberOnly articles render at /dashboard/articles/[slug] behind
// the paywall. Written to the blog-writing skill's rules: concrete facts,
// no filler, no invented premium or claim dollar amounts in insurance copy.
const PUBLIC_LIST: ArticleContent[] = [
  // ── PUBLIC: consumer-intent ──
  {
    slug: "how-to-hire-a-petting-zoo",
    title: "How to Hire a Petting Zoo for Your Event",
    summary:
      "What to ask, what affects the price, and the safety practices a professional petting zoo should show you before you book.",
    category: "Hiring Guides",
    memberOnly: false,
    printable: false,
    body: (
      <>
        <p>
          A mobile petting zoo typically books 60 to 90 minutes for a backyard
          birthday and two hours or more for a school or festival. Price depends
          on four things: how many animals come, how far the operator drives,
          how long they stay, and whether handlers stay with the pen the whole
          time (they should).
        </p>
        <h2>Six questions to ask before you book</h2>
        <ul>
          <li>Are you insured, and can you send a certificate of insurance naming my venue? Venues and HOAs often require this.</li>
          <li>Which animals are coming? Get the actual list — goats, sheep, rabbits, ducks — not &ldquo;a variety.&rdquo;</li>
          <li>Do handlers stay with the animals the entire visit?</li>
          <li>What do you bring for hand-washing? A wash or sanitizer station at the pen exit is standard practice.</li>
          <li>What happens if it rains? Ask about the reschedule policy before paying a deposit.</li>
          <li>How much space and what surface do you need? Most setups want level ground and shade; some need vehicle access to the yard.</li>
        </ul>
        <h2>What a professional setup looks like</h2>
        <p>
          Expect fencing that closes fully, ground cover the operator hauls away,
          and animals rotated out for rest. If children will hold small animals,
          handlers should seat kids first and place the animal in their lap —
          never hand a rabbit to a standing four-year-old.
        </p>
        <h2>Booking timeline</h2>
        <p>
          Spring and fall weekends fill first. For a May or October event, book
          four to eight weeks out. A deposit of 25 to 50 percent at booking is
          normal; get the balance due date and cancellation terms in writing.
        </p>
        <p>
          Search the PAWS directory for petting zoos near you — free, and your
          request goes straight to the operator.
        </p>
      </>
    ),
  },
  {
    slug: "what-is-a-beer-burro",
    title: "What Is a Beer Burro? (And How to Book One)",
    summary:
      "Mini donkeys with drink-service saddlebags, explained: what a beer burro service includes, what drives the price, and what to ask before booking.",
    category: "Hiring Guides",
    memberOnly: false,
    printable: false,
    body: (
      <>
        <p>
          A beer burro is a miniature donkey fitted with saddlebags that carry
          drinks — beer at cocktail hour, seltzers, or champagne for photos.
          A handler leads the burro through your event while guests grab a
          drink and take pictures. Most services run 60 to 120 minutes and
          bring one or two animals.
        </p>
        <h2>What&apos;s usually included</h2>
        <ul>
          <li>One or two mini donkeys with a handler per animal</li>
          <li>Decorated saddlebags — many operators offer florals matched to your colors</li>
          <li>Ice packs or coolers in the bags; you usually supply the drinks</li>
          <li>Cleanup during and after the appearance</li>
        </ul>
        <h2>What drives the price</h2>
        <p>
          Distance is the big one — these operators travel with a trailer, and
          most charge past a set radius. Duration, a second animal, and holiday
          or peak-season dates move the number too. Get the travel fee in the
          quote, not as a surprise on the invoice.
        </p>
        <h2>Questions to ask</h2>
        <ul>
          <li>Can you send a certificate of insurance to my venue? Many venues require one before allowing animals on site.</li>
          <li>Where does the burro wait before the appearance? Shade and water should be part of the answer.</li>
          <li>What surfaces work? Grass and pavers are fine; polished ballroom floors are usually out.</li>
          <li>Is there a photo window before guests arrive? Ten quiet minutes with the couple beats fighting the crowd.</li>
        </ul>
        <p>
          Browse beer burro services in the PAWS directory — free to search,
          with requests going straight to the operator.
        </p>
      </>
    ),
  },
  {
    slug: "pony-ride-safety-checklist",
    title: "Pony Ride Safety: What Parents Should Look For",
    summary:
      "Helmets, hand-leading, trained handlers, and the practices that separate professional pony ride operators from hobbyists.",
    category: "Safety",
    memberOnly: false,
    printable: false,
    body: (
      <>
        <p>
          Pony rides at parties and fairs are hand-led: a handler holds the lead
          rope the entire ride, at a walk, in a ring or a straight track. That
          one practice removes most of the risk. Here is what else to check
          before your child gets on.
        </p>
        <h2>The checklist</h2>
        <ul>
          <li>A handler leads every pony, every ride — no exceptions for &ldquo;calm&rdquo; animals.</li>
          <li>Helmets are available on request. Some operators require them for every rider; ask.</li>
          <li>Riders are matched to the animal — posted weight limits, commonly 60 to 100 pounds for ponies.</li>
          <li>The mounting area is separate from the waiting line, with one child at the pony at a time.</li>
          <li>The operator carries liability insurance and can name your venue on a certificate.</li>
          <li>Ponies get shade, water, and rotation breaks during multi-hour events.</li>
        </ul>
        <h2>What good handling looks like</h2>
        <p>
          Watch the handler for two minutes before joining the line. They should
          keep a hand on the lead near the halter, walk at the pony&apos;s shoulder,
          and stop the ride to fix a slipping child rather than adjusting on the
          move. Ask how old riders need to be; most operators set a minimum of
          two or three years with a parent walking alongside.
        </p>
        <p>
          Use this checklist with any operator you consider — and search the
          PAWS directory to find pony ride operators near you.
        </p>
      </>
    ),
  },
  {
    slug: "mobile-farm-school-visit-guide",
    title: "Bringing a Mobile Farm to Your School: A Planning Guide",
    summary:
      "Space, scheduling, permission slips, and hygiene stations — what a school or daycare needs to plan a farm visit that runs on time.",
    category: "Hiring Guides",
    memberOnly: false,
    printable: false,
    body: (
      <>
        <p>
          A mobile farm visit works best as rotating sessions: classes of 15 to
          25 kids, 20 to 30 minutes each, through a school morning. One setup
          can serve six to eight classes before lunch. Here is how to plan it.
        </p>
        <h2>Before you book</h2>
        <ul>
          <li>Pick the space: level grass or blacktop, roughly the size of two parking spaces, with vehicle access for the trailer.</li>
          <li>Confirm the operator&apos;s insurance and ask for a certificate naming the school or district.</li>
          <li>Ask which animals are coming and share the list with families — some schools collect allergy notes for hay or animal dander.</li>
          <li>Check district rules on animals on campus; some require administrator sign-off two weeks ahead.</li>
        </ul>
        <h2>The week of the visit</h2>
        <ul>
          <li>Send permission slips if your district requires them.</li>
          <li>Build the rotation schedule with 5-minute gaps between classes.</li>
          <li>Plan hand-washing: the operator brings a station, but a second one cuts the line in half for younger grades.</li>
          <li>Assign one staff member as the operator&apos;s contact for the day.</li>
        </ul>
        <h2>Day of</h2>
        <p>
          Operators typically arrive 45 to 60 minutes before the first class to
          set up pens. Kindergarten sessions run best at 20 minutes; older
          grades can go 30 with a Q&amp;A. Kids wash hands on the way out, not
          just at the end of the day.
        </p>
        <p>
          Find mobile farms in the PAWS directory — and use the planning
          checklist above with whoever you book.
        </p>
      </>
    ),
  },

  // ── PUBLIC: operator-intent ──
  {
    slug: "start-a-petting-zoo-business",
    title: "How to Start a Mobile Petting Zoo Business",
    summary:
      "Licenses, USDA basics, animal selection, transport, and the real startup costs of a mobile petting zoo.",
    category: "Business",
    memberOnly: false,
    printable: false,
    body: (
      <>
        <p>
          A mobile petting zoo can start with six to ten animals, a trailer, and
          weekend bookings — many operators launch while keeping a day job. The
          licensing part trips people up more than the animals do, so start
          there.
        </p>
        <h2>Licensing and USDA</h2>
        <p>
          Exhibiting animals to the public for compensation generally requires a
          USDA Animal Welfare Act exhibitor license (Class C) — this applies to
          traveling petting zoos, not just fixed facilities. Your state and
          county may add their own permits, and some cities require a permit per
          event. Budget time for inspections: USDA licensing involves a
          pre-license inspection of your housing and transport.
        </p>
        <h2>Picking the starter herd</h2>
        <ul>
          <li>Nigerian dwarf or pygmy goats — the workhorses of party bookings</li>
          <li>Sheep (bottle-raised lambs handle crowds best)</li>
          <li>Rabbits and guinea pigs for lap visits</li>
          <li>Ducks or chickens in a covered pen</li>
          <li>Skip anything that bites under stress; one incident can end the business</li>
        </ul>
        <h2>The startup math</h2>
        <p>
          The trailer is usually the biggest line item, then fencing panels,
          crates, and the animals themselves. Add feed, vet care, and fuel as
          monthly costs. Most operators price parties to cover the round trip
          plus handler time, with travel fees past a set radius.
        </p>
        <h2>Insurance before the first booking</h2>
        <p>
          Venues, schools, and cities will ask for a certificate of insurance
          before you set up. Line up general liability with animal exposure
          before you advertise — sites like{" "}
          <a href="https://pettingzooinsurance.com" target="_blank" rel="noopener noreferrer">PettingZooInsurance.com</a>{" "}
          specialize in this class of coverage.
        </p>
        <p>
          Once you&apos;re licensed and insured, a PAWS membership puts you in the
          member directory where planners and schools search — and the member
          guides cover pricing, venue outreach, and reviews.
        </p>
      </>
    ),
  },
  {
    slug: "event-operator-insurance-basics",
    title: "Insurance Basics for Animal-Attraction Operators",
    summary:
      "General liability, animal liability, and certificates of insurance — the coverage venues expect, in plain English.",
    category: "Business",
    memberOnly: false,
    printable: false,
    body: (
      <>
        <p>
          The fastest way to lose a venue booking is &ldquo;we never got your
          COI.&rdquo; Most venues, schools, and municipalities require proof of
          insurance before an animal sets foot on the property. Here is what
          the pieces mean.
        </p>
        <h2>General liability</h2>
        <p>
          Covers third-party bodily injury and property damage claims — a guest
          knocked over at your pen, a gate that scratches a parked car. For
          animal attractions, confirm the policy actually covers animal
          exposure; some general policies exclude it, which makes the coverage
          useless for this work.
        </p>
        <h2>The certificate of insurance (COI)</h2>
        <p>
          A COI is a one-page proof of coverage your insurer issues. Venues
          usually want to be named as an <em>additional insured</em> — their
          name printed on the certificate — and some want it days before the
          event. Operators who can turn a COI around same-day win the bookings
          that others lose to paperwork.
        </p>
        <h2>Other coverage worth asking about</h2>
        <ul>
          <li>Commercial auto for the truck and trailer — personal auto policies often exclude business hauling</li>
          <li>Animal mortality coverage for high-value animals</li>
          <li>Workers&apos; compensation once you hire handlers, required by law in most states</li>
        </ul>
        <h2>How to shop it</h2>
        <p>
          Work with someone who knows animal-attraction risks rather than a
          generic small-business policy.{" "}
          <a href="https://pettingzooinsurance.com" target="_blank" rel="noopener noreferrer">PettingZooInsurance.com</a>{" "}
          handles petting zoos and animal exhibitors, and{" "}
          <a href="https://runquotes.com" target="_blank" rel="noopener noreferrer">RunQuotes.com</a>{" "}
          quotes general liability across event business types. Get quotes
          before your busy season, not the week a venue asks.
        </p>
        <p>
          Note: PAWS is a trade association, not an insurance agency, and
          membership does not include insurance. Every operator is responsible
          for arranging and maintaining their own coverage.
        </p>
      </>
    ),
  },

];

export const ARTICLES: ArticleContent[] = [...PUBLIC_LIST, ...COURSE];

export const PUBLIC_ARTICLES = ARTICLES.filter((a) => !a.memberOnly);
export const MEMBER_ARTICLES = ARTICLES.filter((a) => a.memberOnly).sort((a, b) => (a.lesson ?? 99) - (b.lesson ?? 99));

export function getArticleBySlug(slug: string): ArticleContent | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
