import type { Metadata } from "next";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Member benefits",
  description:
    "What PAWS membership includes: a public directory listing with a leads inbox, partner discounts on rentals, hosting, and business tools, and a library of operator marketing guides.",
};

// The conversion page: sells every category of member value WITHOUT leaking
// the payoff (codes/links live behind the paywall). "Index the promise,
// gate the payoff."
const BENEFIT_GROUPS: { icon: IconName; title: string; blurb: string; items: string[] }[] = [
  {
    icon: "search",
    title: "Your directory listing",
    blurb: "The benefit that pays for the rest.",
    items: [
      "A public profile page that ranks in search for your attraction type and area",
      "“Request availability” leads emailed to you and saved in your leads inbox",
      "Category, state, and city pages that route planners to members only",
      "Featured placement options as the directory grows",
    ],
  },
  {
    icon: "tag",
    title: "Partner discounts",
    blurb: "Codes and member links inside the vault.",
    items: [
      "Member travel portal: hotel rates and cruise shore excursions",
      "Vehicle rentals for event runs (member discount code)",
      "Life insurance quote access for you and your family",
      "Website hosting, virtual assistants, and freelance help",
      "Discounted animal and livestock medications",
      "Cash-back on travel and everyday business buying",
    ],
  },
  {
    icon: "doc",
    title: "Grow Your Animal Business course",
    blurb: "11 lessons, each opening free to read.",
    items: [
      "Google Business Profile, Facebook groups, and short video for local bookings",
      "Getting booked by venues, schools, libraries, fairs, and festivals",
      "Pricing, referral partners, and a 5-star review system",
      "A seasonal marketing calendar and an event-day run sheet",
    ],
  },
  {
    icon: "printer",
    title: "Printable downloads",
    blurb: "Printed with your business name.",
    items: [
      "Event signs: hand washing, ask before petting, don't feed the animals",
      "Rate sheet, inquiry intake form, and venue site-visit checklist",
      "Animal care and transport log",
      "12-month marketing calendar and a fillable flyer",
    ],
  },
  {
    icon: "badge",
    title: "Association credibility",
    blurb: "Look established everywhere you pitch.",
    items: [
      `The ${SITE.name} member badge for your website, booth, and proposals`,
      "A public member profile that proves your membership",
      "Association membership you can reference in proposals and vendor applications",
    ],
  },
];

export default function BenefitsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Membership</span>
          <h1 className="mt-2 text-3xl sm:text-4xl">What members get</h1>
          <p className="lede mt-4">
            One $149/year membership, four kinds of value. Discount codes and
            member links live behind the member login — that&apos;s the perk.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {BENEFIT_GROUPS.map((g) => (
              <div key={g.title} className="panel">
                <div className="flex items-center gap-3">
                  <span className="icbox"><Icon name={g.icon} /></span>
                  <div>
                    <h2 className="text-xl">{g.title}</h2>
                    <p className="!m-0 text-sm" style={{ color: "var(--ink-3)" }}>{g.blurb}</p>
                  </div>
                </div>
                <ul className="ticks">
                  {g.items.map((t) => <li key={t}><Icon name="check" />{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center" style={{ background: "var(--blue)" }}>
        <h2 className="text-2xl text-white">Ready to join?</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px]" style={{ color: "#DBEAFE" }}>
          $149 a year, 7-day money-back guarantee. Cancel online anytime.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/join" className="btn btn-primary">Become a member</Link>
          <Link href="/get-listed" className="btn" style={{ background: "#fff", color: "var(--blue)" }}>
            Claim an existing listing
          </Link>
        </div>
      </section>
    </>
  );
}
