import Link from "next/link";
import Icon from "@/components/Icon";
import DirectorySearch from "@/components/DirectorySearch";
import ListingCard from "@/components/ListingCard";
import Reveal from "@/components/Reveal";
import HeroPaws from "@/components/HeroPaws";
import { getFeaturedListings } from "@/lib/listings";
import { DIRECTORY, FEATURED_CATEGORIES } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

// Homepage — "Arena" template of the membership-website skill: the directory
// IS the product, so the hero is the search bar. Trust band uses process
// facts only (never invented counts, testimonials, or fake "live activity").
// Motion: .rise stagger on load, <Reveal> on scroll, hero paws + blobs,
// attraction-type marquee — all off under reduce-motion.
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function HomePage() {
  const featured = await getFeaturedListings(6);
  // Doubled so the marquee loops seamlessly (track slides by -50%).
  const marqueeTypes = [...DIRECTORY.categories, ...DIRECTORY.categories];

  return (
    <>
      {/* ── Search hero ── */}
      <section
        className="hero-stage px-6 py-16 text-center sm:py-24"
        style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
      >
        <HeroPaws />
        <div className="mx-auto max-w-3xl">
          <p
            className="rise inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ ...d(0), color: "#FDBA74", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)" }}
          >
            <span className="pulse-dot" /> Petting zoos · Pony rides · Beer burros · Goat yoga
          </p>
          <h1 className="rise mt-5 text-3xl text-white sm:text-5xl" style={d(90)}>
            Find trusted animal attractions for your next event
          </h1>
          <p className="rise mx-auto mt-4 max-w-xl text-[15px]" style={{ ...d(180), color: "#DBEAFE" }}>
            {SITE.fullName}: the national directory of animal attractions —
            free to search, with requests going straight to the operator.
          </p>
          <div className="rise mx-auto mt-8 max-w-xl" style={d(270)}>
            <DirectorySearch />
          </div>
        </div>
      </section>

      {/* ── Every attraction type, scrolling ── */}
      <section aria-label="Attraction types in the directory" style={{ background: "var(--ground-2)", borderBottom: "1px solid var(--rule)" }}>
        <div className="marquee py-4">
          <div className="marquee-track">
            {marqueeTypes.map((c, i) => (
              <Link
                key={`${c.slug}-${i}`}
                href={`/directory/${c.slug}`}
                aria-hidden={i >= DIRECTORY.categories.length ? true : undefined}
                tabIndex={i >= DIRECTORY.categories.length ? -1 : undefined}
                className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold !no-underline transition-colors hover:bg-[var(--blue-wash)]"
                style={{ border: "1px solid var(--rule)", color: "var(--ink-2)" }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust band: process facts, not invented numbers ── */}
      <section style={{ background: "var(--ground-2)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap grid grid-cols-1 gap-6 py-8 text-center sm:grid-cols-3">
          {[
            { t: "Free to search", s: "Browse the directory and send requests at no cost", c: "var(--blue)" },
            { t: "Direct to the operator", s: "Your request lands in the business owner’s own inbox", c: "var(--orange)" },
            { t: "Nationwide", s: "Search by attraction type, state, and city", c: "var(--blue)" },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 110}>
              <p className="display text-lg" style={{ color: x.c }}>{x.t}</p>
              <p className="text-sm" style={{ color: "var(--ink-3)" }}>{x.s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Browse by attraction</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">What are you planning?</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 110 + Math.floor(i / 3) * 60}>
                <Link href={`/directory/${c.slug}`} className="card card-hover flex h-full flex-col gap-2 p-6 !no-underline">
                  <h3 className="text-lg">{c.name}</h3>
                  <p className="text-sm" style={{ color: "var(--ink-2)" }}>{c.blurb}</p>
                  <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-semibold" style={{ color: "var(--blue)" }}>
                    Browse {c.name.toLowerCase()} <Icon name="right" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6 text-center" delay={120}>
            <Link href="/directory" className="text-sm font-semibold" style={{ color: "var(--blue)" }}>
              See all {DIRECTORY.categories.length} attraction types →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── How it works, both audiences ── */}
      <section className="section" style={{ background: "var(--ground-2)" }}>
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow">Planning an event?</p>
              <h2 className="mt-2 text-2xl">Book with confidence</h2>
            </Reveal>
            <div className="three !mt-6 !grid-cols-1 gap-4">
              {[
                ["01", "Search your area", "Filter by attraction type, state, and city."],
                ["02", "Compare members", "Profiles show services, service area, and photos."],
                ["03", "Request availability", "Contact the operator directly — free, no account needed."],
              ].map(([n, h, p], i) => (
                <Reveal key={n} delay={i * 120} className="step">
                  <span className="stepno">{n}</span>
                  <h3 className="text-base">{h}</h3>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={150}>
            <p className="eyebrow">Run an attraction?</p>
            <h2 className="mt-2 text-2xl">Membership that books you jobs</h2>
            <ul className="ticks mt-6">
              <li><Icon name="check" /> A public listing that ranks in search and sends leads to your inbox</li>
              <li><Icon name="check" /> An 11-lesson marketing course and printable business tools</li>
              <li><Icon name="check" /> Partner discounts: rentals, hosting, business tools, and more</li>
              <li><Icon name="check" /> The {SITE.name} member badge for your website and booth</li>
            </ul>
            <div className="herocta mt-6">
              <Link href="/join" className="btn btn-primary">Join PAWS</Link>
              <Link href="/benefits" className="btn btn-ghost">See all benefits</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured members ── */}
      {featured.length > 0 && (
        <section className="section">
          <div className="wrap">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">The directory</p>
                <h2 className="mt-2 text-2xl sm:text-3xl">Featured members</h2>
              </div>
              <Link href="/directory" className="btn btn-ghost">Browse all members</Link>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((l, i) => (
                <Reveal key={l.id} delay={(i % 3) * 110}>
                  <ListingCard listing={l} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS: insert here once real quotes with permission exist */}

      {/* ── Join CTA ── */}
      <section className="hero-stage px-6 py-14 text-center" style={{ background: "var(--blue)" }}>
        <HeroPaws />
        <Reveal>
          <h2 className="text-2xl text-white sm:text-3xl">Put your attraction in front of event planners</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px]" style={{ color: "#DBEAFE" }}>
            $149 a year with a 7-day money-back guarantee. Includes your public listing, a
            leads inbox, partner discounts, and the member guide library.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/get-listed" className="btn btn-primary">Claim your listing</Link>
            <Link href="/join" className="btn" style={{ background: "#fff", color: "var(--blue)" }}>
              New here? Become a member
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
