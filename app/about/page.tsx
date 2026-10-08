import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/siteConfig";

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
      "A trade association for animal-attraction and amusement operators, with a public member directory and a code of safety and animal-care standards.",
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          against much bigger marketing budgets. A directory built on a shared
          code of standards helps both.
        </p>
        <h2>Our code of standards</h2>
        <p>Every member agrees to practices that protect animals and guests:</p>
        <ul>
          <li>Trained handlers stay with animals for the duration of every event</li>
          <li>Hand-washing or sanitizer stations at animal pens</li>
          <li>Hand-led pony rides, with helmets available on request</li>
          <li>Rest rotations, shade, and water for working animals</li>
          <li>Liability insurance the member can document to a venue on request</li>
        </ul>
        <p>
          Membership is not a license and not a guarantee — hosts should still
          confirm insurance and practices for their specific event — but it sets
          a bar, and it gives venues a place to start.
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
