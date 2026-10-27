import type { Metadata } from "next";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about PAWS — the Professional Association of Wildlife & Sports — membership, the directory, and hiring an animal attraction.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: `What is ${SITE.name}?`,
    a: "PAWS — the Professional Association of Wildlife & Sports — is a trade association for animal-attraction and amusement operators: petting zoos, pony rides, beer burros, mobile farms, and similar businesses. The public side is a free searchable directory; the member side is a paid membership with a public listing, a leads inbox, partner discounts, and operator guides.",
  },
  {
    q: "Is it free to search the directory and contact an operator?",
    a: "Yes. Searching, browsing profiles, and sending a request through a member's listing are free, with no account needed. We don't charge event hosts anything.",
  },
  {
    q: "Does PAWS vet or certify operators?",
    a: "No. Listings are created by operators themselves or pre-listed by the association from public information and its own business records, and a listing is not a license, certification, or endorsement. PAWS does not supervise or inspect member businesses. Always confirm insurance, licensing, and practices directly with an operator before hiring them — our free hiring guides cover what to ask.",
  },
  {
    q: "How much does membership cost for operators?",
    a: "$149 per year, billed annually and renewing automatically until you cancel.",
  },
  {
    q: "What does membership include?",
    a: "A public directory listing with your services and service area, leads emailed to you and collected in your dashboard, partner discounts (vehicle rentals, hosting, business tools, animal supplies), the member guide library, and the PAWS member badge for your website and booth.",
  },
  {
    q: "Can I cancel my membership?",
    a: "Yes, online, anytime, from your dashboard's Billing page. New members get a 7-day money-back guarantee: cancel within 7 days of joining for a full refund. Membership renews automatically each year, and we email you a reminder about 30 days before. If you cancel within 30 days after an automatic renewal, that renewal is refunded in full.",
  },
  {
    q: "My membership was provided through a partner — what can I change?",
    a: "Nothing was charged to you and there is no recurring charge on your end, so there is nothing to cancel. Your account settings let you update your email and password, and you manage your listing like any other member.",
  },
  {
    q: "My business is listed but I never signed up. Why?",
    a: "To make the directory useful to event planners from day one, the association pre-lists established operators from public information and its own business records. You can claim your listing — which moves it under your control and adds the member benefits — or ask us to remove it from the contact page.",
  },
  {
    q: "Does PAWS sell insurance?",
    a: "No. PAWS is a trade association, not an insurance agency, and membership does not include insurance. Members carry their own coverage; our learning hub points operators to specialists who quote this class of business.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="section">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {FAQS.map((f) => (
            <div key={f.q} className="card p-6">
              <h2 className="text-lg mb-2">{f.q}</h2>
              <p className="text-[var(--ink-3)]">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
