import type { Metadata } from "next";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto px-6 py-16 prose-warm">
        <h1>Terms of Service</h1>
        <p className="text-sm text-[var(--ink-3)]">Last updated: September 24, 2026</p>

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of {SITE.domain} (the
          &ldquo;Site&rdquo;) and the {SITE.name} membership program, operated by{" "}
          {SITE.legalEntity} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By
          creating an account, purchasing a membership, submitting a request through the
          directory, or using the Site, you agree to these Terms. If you do not agree, do not
          use the Site.
        </p>

        <h2>1. What {SITE.name} Is</h2>
        <p>
          {SITE.name} is a trade association for animal-attraction and amusement operators. The
          Site provides (a) a public directory of member operators that anyone may search and use
          to contact an operator, and (b) a paid membership program for operators that includes a
          directory listing, lead notifications, third-party partner discounts, and educational
          guides. We are <strong>not</strong> a party to any booking, contract, or transaction
          between an event host and an operator, we are not an insurance agency, and membership
          does not include insurance of any kind.
        </p>

        <h2>2. The Directory — No Endorsement or Guarantee</h2>
        <p>
          <strong>We do not supervise, inspect, or control any operator&apos;s
          services</strong>.
          A listing (including a &ldquo;featured&rdquo; placement) is not a license,
          certification, endorsement, or guarantee of quality, safety, licensure, or insurance.
          Event hosts are solely responsible for vetting an operator — including confirming
          insurance, licensing, and safety practices — before hiring them. Some listings are
          created by the association from public information and have not been claimed by the
          business; these are identified on the listing page.
        </p>

        <h2>3. Membership, Price, and Refunds</h2>
        <p>
          Operators may join at <a href="/join">/join</a> for <strong>$149 per year</strong>,
          billed via our payment processor (Stripe) and <strong>auto-renewing annually</strong>{" "}
          until canceled. You may cancel free of charge within{" "}
          <strong>7 days of your original signup date</strong> for a full refund. After that
          7-day window, <strong>membership fees are non-refundable</strong>, including for
          partial or unused periods. You can view billing history and cancel future renewals
          anytime from your account&apos;s billing page (Stripe Customer Portal). Memberships may
          also be provided on a complimentary basis through partner programs; such memberships
          run for a fixed term, do not auto-renew, and involve no charge to the member.
        </p>

        <h2>4. Listings and Member Content</h2>
        <p>
          Members are responsible for the accuracy of their listing content and must have the
          right to publish everything they submit. By submitting listing content, you grant{" "}
          {SITE.legalEntity} a non-exclusive, worldwide, royalty-free license to display, format,
          and distribute that content on the Site and in association marketing of the directory.
          We may edit, decline, or remove any listing at our discretion, including for
          complaints, inaccurate information, or lapsed membership. Businesses that
          appear in an unclaimed pre-listed entry may request removal via the{" "}
          <a href="/contact">contact page</a>.
        </p>

        <h2>5. Leads</h2>
        <p>
          The directory lead form transmits an inquirer&apos;s contact details to the listed
          operator. We do not verify inquiries, do not guarantee any volume or quality of leads,
          and are not responsible for either party&apos;s conduct after an introduction. Operators
          may use lead information only to respond to that inquiry and as permitted by law.
        </p>

        <h2>6. Partner Discounts and Third-Party Offers</h2>
        <p>
          The member benefits vault contains <strong>affiliate links</strong> — {SITE.name} may
          receive a commission when a member uses a link or discount code, at no extra cost to
          the member. Discounts, pricing, and availability are set and controlled entirely by the
          third-party provider and may change or end without notice. We do our best to keep
          listings accurate but do not guarantee any specific discount, price, or availability.
          Some listed products (for example, dietary supplements) make general wellness claims
          that have not been evaluated by the FDA and are not intended to diagnose, treat, cure,
          or prevent any disease.
        </p>

        <h2>7. Eligibility and Acceptable Use</h2>
        <p>
          You must be at least 18 years old and able to form a binding contract to create an
          account. You agree not to:
        </p>
        <ul>
          <li>Share your login credentials or member benefits with non-members;</li>
          <li>Submit false listing information, fake reviews, or fraudulent lead inquiries;</li>
          <li>Use bots, scrapers, or automated means to access the Site except standard search indexing;</li>
          <li>Harvest contact information from the directory for unsolicited marketing;</li>
          <li>Attempt to gain unauthorized access to, probe, or disrupt the Site or its systems;</li>
          <li>Use the Site for any unlawful purpose.</li>
        </ul>

        <h2>8. Intellectual Property</h2>
        <p>
          The Site and its content (text, graphics, logos, design) are owned by{" "}
          {SITE.legalEntity} or its licensors. You may not copy, reproduce, or redistribute Site
          content except for your own personal or internal business use (for example, printing a
          member checklist for your own event day). The {SITE.name} member badge may be used only
          by current members and only in the forms we provide.
        </p>

        <h2>9. Disclaimers</h2>
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT
          THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, THAT ANY LISTING IS
          ACCURATE, THAT ANY OPERATOR IS LICENSED, INSURED, OR SUITABLE, OR THAT ANY THIRD-PARTY
          DISCOUNT, OFFER, OR PRODUCT WILL BE AVAILABLE, ACCURATE, OR SUITABLE FOR YOU.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE.legalEntity.toUpperCase()} AND ITS
          OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE, YOUR
          MEMBERSHIP, ANY LISTING OR LEAD, ANY EVENT OR SERVICE PROVIDED BY AN OPERATOR, OR ANY
          THIRD-PARTY OFFER. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SITE OR YOUR
          MEMBERSHIP WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM
          AROSE.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {SITE.legalEntity} from any claims, damages,
          or expenses (including reasonable attorneys&apos; fees) arising from your listing
          content, your services or events, your misuse of the Site, or your violation of these
          Terms.
        </p>

        <h2>12. Governing Law and Disputes</h2>
        <p>
          These Terms are governed by the laws of the State of Nevada, without regard to
          conflict-of-law rules. Any dispute will be resolved in the state or federal courts
          located in Clark County, Nevada.{" "}
          <em>[Counsel: confirm entity name, venue, and whether arbitration is preferred.]</em>
        </p>

        <h2>13. Changes to These Terms</h2>
        <p>
          We may update these Terms at any time. Changes are effective when posted with a new
          &ldquo;Last updated&rdquo; date. Continued use of the Site after changes means you
          accept the updated Terms.
        </p>

        <h2>14. Contact Us</h2>
        <p>
          {SITE.legalEntity}
          <br />
          Email: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
          <br />
          Or use our <a href="/contact">contact form</a>.
        </p>
      </div>
    </section>
  );
}
