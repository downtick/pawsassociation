import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import DirectorySearch from "@/components/DirectorySearch";
import { MEMBER_ARTICLES } from "@/content/articles";
import { DOWNLOADS } from "@/content/downloads";
import { SITE } from "@/lib/siteConfig";

// Campaign landing page for the brochure QR code and mailing-list links
// (/go/brochure, /go/email). Written for an animal-attraction owner seeing
// PAWS for the first time. Kept out of search results: it's an offer page,
// and /benefits already covers the same ground for organic visitors.
export const metadata: Metadata = {
  title: "Add PAWS membership to your animal business",
  description:
    "Get your petting zoo, pony ride, beer burro, or mobile farm listed in the PAWS directory, plus the 20-lesson marketing course, printable business tools, and partner discounts. $149 a year.",
  robots: { index: false, follow: true },
};

export default function StartPage() {
  return (
    <>
      <section className="px-6 py-14 text-center sm:py-20" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#FDBA74" }}>
            Petting zoos · Pony rides · Beer burros · Goat yoga · Reptile shows · and more
          </p>
          <h1 className="mt-4 text-3xl text-white sm:text-5xl">More bookings for your animal business</h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px]" style={{ color: "#DBEAFE" }}>
            Join {SITE.name} — the Professional Association of Wildlife &amp; Sports —
            and get listed where event planners, schools, and families look for
            animal attractions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/join" className="btn btn-primary">Join PAWS</Link>
            <Link href="/get-listed" className="btn" style={{ background: "#fff", color: "var(--blue)" }}>
              Already listed? Claim it
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">What membership includes</p>
          <h2 className="mt-2 text-2xl sm:text-3xl">Four things, one membership</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="panel">
              <span className="icbox"><Icon name="search" /></span>
              <h3 className="text-lg">A directory listing that brings inquiries</h3>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                Your business on its own profile page, plus category, state, and
                city pages. &ldquo;Request availability&rdquo; messages go straight to your
                email and your leads inbox.
              </p>
            </div>
            <div className="panel">
              <span className="icbox"><Icon name="doc" /></span>
              <h3 className="text-lg">The {MEMBER_ARTICLES.length}-lesson marketing course</h3>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                Google Business Profile, getting booked by venues, schools,
                libraries, and fairs, pricing, referral partners, short video, and
                a review system — written for animal businesses.
              </p>
            </div>
            <div className="panel">
              <span className="icbox"><Icon name="printer" /></span>
              <h3 className="text-lg">{DOWNLOADS.length} printable business tools</h3>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                Event signs, a rate sheet, an inquiry form, a venue checklist, an
                animal care log, a marketing calendar, and a fillable flyer — each
                printed with your business name.
              </p>
            </div>
            <div className="panel">
              <span className="icbox"><Icon name="tag" /></span>
              <h3 className="text-lg">Partner discounts</h3>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                A rental car discount code, a member travel portal for hotels and
                cruise excursions, website hosting, virtual assistants, and life
                insurance quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ground-2)" }}>
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How to join</p>
            <h2 className="mt-2 text-2xl">Three steps, about ten minutes</h2>
            <div className="three !mt-6 !grid-cols-1 gap-4">
              <div className="step"><span className="stepno">01</span><h3 className="text-base">Join for $149 a year</h3><p>Backed by a 7-day money-back guarantee. Cancel online within 7 days for a full refund.</p></div>
              <div className="step"><span className="stepno">02</span><h3 className="text-base">Create your listing</h3><p>Attraction type, services, service area, and contact details.</p></div>
              <div className="step"><span className="stepno">03</span><h3 className="text-base">Start getting inquiries</h3><p>Your listing goes live after a quick review, and the course and downloads unlock right away.</p></div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Already in the directory?</p>
            <h2 className="mt-2 text-2xl">Search for your business</h2>
            <p className="mt-3 text-sm" style={{ color: "var(--ink-2)" }}>
              We pre-list established animal businesses. If yours is there, claim
              it to add your phone and website and receive inquiries by email.
            </p>
            <div className="mt-4"><DirectorySearch compact /></div>
            <Link href="/get-listed" className="btn btn-ghost mt-4">How claiming works</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center" style={{ background: "var(--blue)" }}>
        <h2 className="text-2xl text-white sm:text-3xl">Ready to get listed?</h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px]" style={{ color: "#DBEAFE" }}>
          $149 a year. Questions first? <Link href="/contact">Send us a message</Link>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/join" className="btn btn-primary">Join {SITE.name}</Link>
          <Link href="/benefits" className="btn" style={{ background: "#fff", color: "var(--blue)" }}>See every benefit</Link>
        </div>
        <p className="mx-auto mt-6 max-w-lg text-xs" style={{ color: "#BFDBFE" }}>
          A directory listing is not an endorsement or certification of any business.
        </p>
      </section>
    </>
  );
}
