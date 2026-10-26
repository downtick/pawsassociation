import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "PAWS — the Professional Association of Wildlife & Sports — is a trade association for petting zoos, pony rides, beer burros, mobile farms, and amusement operators.",
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
    description:
      "A trade association for animal-attraction and amusement operators, with a public member directory of petting zoos, pony rides, beer burros, and mobile farms.",
  };

  return (
    <section className="section">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto px-6 py-16 prose-warm">
        <h1>About {SITE.name}</h1>
        <p>
          {SITE.fullName} is a trade association for the businesses that bring
          animals and amusements to events: petting zoos, pony ride operators,
          beer burro services, mobile farms, and similar attractions.
        </p>
        <p>
          The association exists to solve a problem on both sides of a booking.
          Event hosts — parents, schools, wedding planners, festival organizers —
          have no easy way to tell a professional operator from a hobbyist.
          Operators, meanwhile, are small businesses competing for attention
          against much bigger marketing budgets. A searchable national directory
          helps both.
        </p>
        <h2>What a listing is — and {`isn't`}</h2>
        <p>
          A listing is a way to find and compare operators, not a license,
          certification, or endorsement. PAWS does not supervise, inspect, or
          control member businesses. Event hosts should always confirm
          insurance, licensing, and practices directly with an operator before
          hiring them — our free hiring guides in the{" "}
          <Link href="/learn">learning hub</Link> cover exactly what to ask.
        </p>
        <h2>How the association is funded</h2>
        <p>
          Operator dues ($149 a year) fund the association. Some member benefits
          are affiliate partnerships — the association may earn a commission when
          a member uses a listed offer, at no extra cost to the member. See our{" "}
          <Link href="/disclaimer">disclaimer</Link> for details.
        </p>
        <p>
          Have a question we didn&apos;t answer? Visit the <Link href="/faq">FAQ</Link> or{" "}
          <Link href="/contact">contact us</Link>.
        </p>
      </div>
    </section>
  );
}
