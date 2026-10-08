import Link from "next/link";
import Icon from "@/components/Icon";
import DirectorySearch from "@/components/DirectorySearch";
import ListingCard from "@/components/ListingCard";
import { getFeaturedListings } from "@/lib/listings";
import { DIRECTORY } from "@/lib/directory";
import { SITE } from "@/lib/siteConfig";

// Homepage — "Arena" template of the membership-website skill: the directory
// IS the product, so the hero is the search bar. Trust band uses process
// facts only (never invented counts or testimonials).
export default async function HomePage() {
  const featured = await getFeaturedListings(6);

  return (
    <>
      {/* ── Search hero ── */}
      <section
        className="px-6 py-16 text-center sm:py-24"
        style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#FDBA74" }}>
            Petting zoos · Pony rides · Beer burros · Mobile farms
          </p>
          <h1 className="mt-4 text-3xl text-white sm:text-5xl">
            Find trusted animal attractions for your next event
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px]" style={{ color: "#DBEAFE" }}>
            {SITE.fullName}: the national directory of animal attractions —
            free to search, with requests going straight to the operator.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <DirectorySearch />
          </div>
        </div>
      </section>

      {/* ── Trust band: process facts, not invented numbers ── */}
      <section style={{ background: "var(--ground-2)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap grid grid-cols-1 gap-6 py-8 text-center sm:grid-cols-3">
          <div>
            <p className="display text-lg" style={{ color: "var(--blue)" }}>Free to search</p>
            <p className="text-sm" style={{ color: "var(--ink-3)" }}>Browse the directory and send requests at no cost</p>
          </div>
          <div>
            <p className="display text-lg" style={{ color: "var(--orange)" }}>Direct to the operator</p>
            <p className="text-sm" style={{ color: "var(--ink-3)" }}>Your request lands in the business owner&apos;s own inbox</p>
          </div>
          <div>
            <p className="display text-lg" style={{ color: "var(--blue)" }}>Nationwide</p>
            <p className="text-sm" style={{ color: "var(--ink-3)" }}>Search by attraction type, state, and city</p>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Browse by attraction</p>
          <h2 className="mt-2 text-2xl sm:text-3xl">What are you planning?</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTORY.categories.map((c) => (
              <Link key={c.slug} href={`/directory/${c.slug}`} className="card card-hover flex flex-col gap-2 p-6 !no-underline">
                <h3 className="text-lg">{c.name}</h3>
                <p className="text-sm" style={{ color: "var(--ink-2)" }}>{c.blurb}</p>
                <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-semibold" style={{ color: "var(--blue)" }}>
                  Browse {c.name.toLowerCase()} <Icon name="right" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works, both audiences ── */}
      <section className="section" style={{ background: "var(--ground-2)" }}>
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Planning an event?</p>
            <h2 className="mt-2 text-2xl">Book with confidence</h2>
            <div className="three !mt-6 !grid-cols-1 gap-4">
              <div className="step"><span className="stepno">01</span><h3 className="text-base">Search your area</h3><p>Filter by attraction type, state, and city.</p></div>
              <div className="step"><span className="stepno">02</span><h3 className="text-base">Compare members</h3><p>Profiles show services, service area, and photos.</p></div>
              <div className="step"><span className="stepno">03</span><h3 className="text-base">Request availability</h3><p>Contact the operator directly — free, no account needed.</p></div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Run an attraction?</p>
            <h2 className="mt-2 text-2xl">Membership that books you jobs</h2>
            <ul className="ticks mt-6">
              <li><Icon name="check" /> A public listing that ranks in search and sends leads to your inbox</li>
              <li><Icon name="check" /> Partner discounts: rentals, hosting, business tools, and more</li>
              <li><Icon name="check" /> Marketing playbooks written for event operators</li>
              <li><Icon name="check" /> The {SITE.name} member badge for your website and booth</li>
            </ul>
            <div className="herocta mt-6">
              <Link href="/join" className="btn btn-primary">Join for $149/year</Link>
              <Link href="/benefits" className="btn btn-ghost">See all benefits</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured members ── */}
      {featured.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">The directory</p>
                <h2 className="mt-2 text-2xl sm:text-3xl">Featured members</h2>
              </div>
              <Link href="/directory" className="btn btn-ghost">Browse all members</Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS: insert here once real quotes with permission exist */}

      {/* ── Join CTA ── */}
      <section className="px-6 py-14 text-center" style={{ background: "var(--blue)" }}>
        <h2 className="text-2xl text-white sm:text-3xl">Put your attraction in front of event planners</h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px]" style={{ color: "#DBEAFE" }}>
          Membership is $149 a year and includes your public listing, a leads
          inbox, partner discounts, and the member guide library.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/get-listed" className="btn btn-primary">Claim your listing</Link>
          <Link href="/join" className="btn" style={{ background: "#fff", color: "var(--blue)" }}>
            New here? Become a member
          </Link>
        </div>
      </section>
    </>
  );
}
