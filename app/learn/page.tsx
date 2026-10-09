import type { Metadata } from "next";
import Link from "next/link";
import { PUBLIC_ARTICLES, MEMBER_ARTICLES } from "@/content/articles";
import ContentNotice from "@/components/ContentNotice";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Learning hub — hiring guides & how to market an animal business",
  description:
    "Free guides for hiring petting zoos, pony rides, beer burros, and mobile farms — plus the Grow Your Animal Business course: 11 lessons on marketing, pricing, and running an animal attraction.",
  alternates: { canonical: "/learn" },
};

const PUBLIC_CATEGORIES = ["Hiring Guides", "Safety", "Business"] as const;

export default function LearnPage() {
  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">Learning hub</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">Guides for planners and operators</h1>
        <p className="lede mt-4">
          How to hire an animal attraction with confidence — and how to grow one.
          Free guides below; the full marketing course and printable business
          tools are part of PAWS membership.
        </p>
        <div className="mt-6 max-w-2xl"><ContentNotice /></div>

        {/* ── The course ── */}
        <div className="panel mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="badge"><Icon name="badge" /> Member course</span>
              <h2 className="mt-2 text-2xl">Grow Your Animal Business</h2>
              <p className="!m-0 text-sm" style={{ color: "var(--ink-3)" }}>
                {MEMBER_ARTICLES.length} lessons on marketing, pricing, and operations — each opening is free to read.
              </p>
            </div>
            <Link href="/downloads" className="btn btn-ghost">Printable downloads</Link>
          </div>
          <ol className="mt-2 grid gap-2 sm:grid-cols-2">
            {MEMBER_ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/learn/${a.slug}`}
                  className="flex items-start gap-3 rounded-xl border p-3 !no-underline transition-colors hover:bg-[var(--blue-wash)]"
                  style={{ borderColor: "var(--rule)" }}
                >
                  <span className="stepno mt-0.5 w-6 flex-none">{String(a.lesson).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-semibold" style={{ color: "var(--ink)" }}>{a.title}</span>
                    <span className="text-sm" style={{ color: "var(--ink-3)" }}>{a.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {PUBLIC_CATEGORIES.map((cat) => {
          const items = PUBLIC_ARTICLES.filter((a) => a.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-10">
              <h2 className="mb-3 text-xl">{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <Link key={a.slug} href={`/learn/${a.slug}`} className="card card-hover block p-5">
                    <h3 className="mb-1 font-semibold">{a.title}</h3>
                    <p className="text-sm" style={{ color: "var(--ink-3)" }}>{a.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
