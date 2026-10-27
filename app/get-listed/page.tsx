import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/siteConfig";
import BusinessTypes from "@/components/BusinessTypes";

export const metadata: Metadata = {
  title: "Get listed in the directory",
  description:
    "Two ways into the PAWS directory: join as a member and create your listing, or claim a listing the association already created for your business.",
};

// The "claim your listing" growth page. Pre-seeded listings already rank and
// already collect leads — this page turns that into the membership pitch.
// v1 claim flow is manual (contact form) — a self-serve verify-by-email flow
// can replace it once claim volume justifies it.
export default function GetListedPage() {
  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">For operators</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">Get listed. Get found.</h1>
        <p className="lede mt-4">
          Event planners, schools, and families search the {SITE.name} directory
          when they need an attraction for an event. There are two ways in.
        </p>

        <BusinessTypes className="mt-8" />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="panel">
            <span className="badge">New listing</span>
            <h2 className="text-xl">Join and create your listing</h2>
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              Membership is $149/year. You create your listing from your
              dashboard — attraction type, services, service area, photos — and
              it goes live after a quick review. Leads go straight to your inbox.
            </p>
            <Link href="/join" className="btn btn-primary w-fit">Join {SITE.name}</Link>
          </div>

          <div className="panel">
            <span className="badge">Existing listing</span>
            <h2 className="text-xl">Claim a listing we created</h2>
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              To help planners find operators from day one, the association
              pre-lists established businesses. If one of them is yours, claiming
              it takes over the profile, unlocks lead notifications, and adds the
              member benefits — same $149/year membership.
            </p>
            <ul className="ticks">
              <li><Icon name="check" />Contact us with your business name and the listing link</li>
              <li><Icon name="check" />We verify you own the business (email or phone)</li>
              <li><Icon name="check" />Join, and the listing moves under your account</li>
            </ul>
            <Link href="/contact" className="btn btn-ghost w-fit">Start a claim</Link>
          </div>
        </div>

        <div className="note mt-10">
          <Icon name="info" />
          <span>
            Not sure if {`you're`} already listed?{" "}
            <Link href="/directory" className="font-semibold" style={{ color: "var(--blue)" }}>
              Search the directory
            </Link>{" "}
            for your business name.
          </span>
        </div>
      </div>
    </section>
  );
}
