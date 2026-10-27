import type { Metadata } from "next";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="section">
      <div className="max-w-3xl mx-auto px-6 py-16 prose-warm">
        <h1>Terms of Service</h1>
        <p className="text-sm text-[var(--ink-3)]">Last updated: October 26, 2026</p>

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
          created by the association from public information and the association's own business
          records and have not been claimed by the
          business; these are identified on the listing page.
        </p>

        <h2>3. Membership, Money-Back Guarantee, Automatic Renewal, and Refunds</h2>
        <p>
          <strong>Price.</strong> Operators may join at <a href="/join">/join</a> for{" "}
          <strong>$149 per year</strong>, billed through our payment processor (Stripe).
        </p>
        <p>
          <strong>7-day money-back guarantee.</strong> The first $149 annual fee is charged when
          you join. First-time members who cancel online from their Billing page within{" "}
          <strong>7 days of that first charge</strong> receive a full refund, and their
          membership and listing end immediately. The guarantee is available once per business
          or person; returning members are not eligible.
        </p>
        <p>
          <strong>Automatic renewal.</strong> Your membership <strong>renews automatically every
          year</strong> at the then-current annual price, charged to your card on file, until you
          cancel. You agree to this when you check the automatic-renewal box at signup. We will
          email you a reminder about 30 days before each renewal. You can cancel online anytime
          from your account&apos;s Billing page, and cancellation stops all future renewals.
        </p>
        <p>
          <strong>Refunds.</strong> If you cancel within <strong>30 days after an automatic
          renewal charge</strong>, that renewal is refunded in full, and you can do this yourself
          from your Billing page. Apart from the 7-day guarantee and this 30-day renewal window,
          membership fees are non-refundable, including for partial or unused periods.
        </p>
        <p>
          Memberships may also be provided on a complimentary basis through partner programs;
          such memberships run for a fixed term, do not auto-renew, and involve no charge to the
          member.
        </p>

        <h2>4. Listings and Member Content</h2>
        <p>
          Members are responsible for the accuracy of their listing content and must have the
          right to publish everything they submit. By submitting listing content, you grant{" "}
          {SITE.legalEntity} a non-exclusive, worldwide, royalty-free license to display, format,
          and distribute that content on the Site and in association marketing of the directory.
          We may edit, decline, or remove any listing at our discretion, including for
          complaints, inaccurate information, or lapsed membership. Businesses that
          appear in an unclaimed pre-listed entry may ask us to remove it using the{" "}
          <a href="/request-removal">listing removal request form</a>.
        </p>

        <h2>5. Leads</h2>
        <p>
          The directory lead form transmits an inquirer&apos;s contact details to the listed
          operator. We do not verify inquiries, do not guarantee any volume or quality of leads,
          and are not responsible for either party&apos;s conduct after an introduction. Operators
          may use lead information only to respond to that inquiry and as permitted by law.
        </p>

        <h2>6. No Guarantee of Availability or Results</h2>
        <p>
          We do not guarantee that the Site, the directory, your listing, the lead form, or any
          member feature will be available at any particular time or without interruption, and
          we assume no responsibility for downtime, outages, maintenance, errors, data loss, or
          delays, whether caused by us, our hosting, email, or payment providers, or anyone
          else. We may suspend, change, or discontinue any part of the Site at any time.
        </p>
        <p>
          Membership does not guarantee any number of leads, inquiries, bookings, search
          ranking, visibility, or revenue, and membership fees are not contingent on results.
          We assume no responsibility for lead generation or for the outcome of any inquiry.
        </p>

        <h2>7. Partner Discounts and Third-Party Offers</h2>
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

        <h2>8. Eligibility and Acceptable Use</h2>
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

        <h2>9. Intellectual Property</h2>
        <p>
          The Site and its content (text, graphics, logos, design) are owned by{" "}
          {SITE.legalEntity} or its licensors. You may not copy, reproduce, or redistribute Site
          content except for your own personal or internal business use (for example, printing a
          member checklist for your own event day). The {SITE.name} member badge may be used only
          by current members and only in the forms we provide.
        </p>

        <h2>10. Disclaimers</h2>
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT
          THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, THAT ANY LISTING IS
          ACCURATE, THAT ANY OPERATOR IS LICENSED, INSURED, OR SUITABLE, OR THAT ANY THIRD-PARTY
          DISCOUNT, OFFER, OR PRODUCT WILL BE AVAILABLE, ACCURATE, OR SUITABLE FOR YOU.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE.legalEntity.toUpperCase()} AND ITS
          OWNERS, MEMBERS, MANAGERS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES,
          SUCCESSORS, AND ASSIGNS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE, YOUR
          MEMBERSHIP, ANY LISTING OR LEAD, ANY EVENT OR SERVICE PROVIDED BY AN OPERATOR, OR ANY
          THIRD-PARTY OFFER. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SITE OR YOUR
          MEMBERSHIP WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM
          AROSE.
        </p>

        <h2>12. Release, Defense, and Indemnification</h2>
        <p>
          In these Terms, the &ldquo;PAWS Parties&rdquo; means {SITE.legalEntity}, the Site
          owner, and each of their owners, members, managers, officers, directors, employees,
          agents, representatives, affiliates, successors, and assigns, and anyone else acting
          on their behalf in connection with the Site.
        </p>
        <p>
          To the maximum extent permitted by law, you agree to <strong>hold harmless</strong>{" "}
          the PAWS Parties from any and all liability, claims, demands, losses, damages, costs,
          and expenses of every kind, and to <strong>defend and indemnify</strong> the PAWS
          Parties against any such claim, including reasonable attorneys&apos; fees and costs,
          arising out of or relating to: your use of the Site or membership; your listing or
          any content you submit; any event, service, animal, or attraction you provide or
          book; any dealings between you and another user, operator, or event host; any
          third-party offer you use; or your violation of these Terms or any law or the rights
          of anyone else.
        </p>
        <p>
          We may choose to control the defense of any claim subject to this section, at your
          expense, and you agree to cooperate with that defense. You may not settle any such
          claim without our written consent. This section survives the end of your membership
          and your use of the Site.
        </p>

        <h2>13. Governing Law and Disputes</h2>
        <p>
          These Terms are governed by the laws of the State of Nevada, without regard to
          conflict-of-law rules. Any dispute will be resolved in the state or federal courts
          located in Clark County, Nevada.{" "}
          <em>[Counsel: confirm entity name, venue, and whether arbitration is preferred.]</em>
        </p>

        <h2>14. Changes to These Terms and Site Rules</h2>
        <p>
          These Terms, our directory and listing rules, member benefits, features, and
          policies are subject to change at any time. Changes are effective when posted with a
          new &ldquo;Last updated&rdquo; date. If we change the membership price, the new price
          applies from your next renewal, and we will tell you before it does. Continued use of
          the Site after changes means you accept them.
        </p>

        <h2>15. Contact Us</h2>
        <p>
          {SITE.legalEntity}
          <br />
          Please use our <a href="/contact">contact form</a>. To have a pre-listed business
          removed from the directory, use the{" "}
          <a href="/request-removal">listing removal request form</a>.
        </p>
      </div>
    </section>
  );
}
