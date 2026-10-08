import type { Metadata } from "next";
import Link from "next/link";
import { PUBLIC_ARTICLES } from "@/content/articles";
import ContentNotice from "@/components/ContentNotice";

export const metadata: Metadata = {
  title: "Learning hub — hiring guides & operator resources",
  description:
    "Guides for hiring petting zoos, pony rides, beer burros, and mobile farms — plus resources for operators starting or growing an animal-attraction business.",
};

const CATEGORIES = ["Hiring Guides", "Safety", "Business"] as const;

export default function LearnPage() {
  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">Learning hub</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">Guides for planners and operators</h1>
        <p className="lede mt-4">
          How to hire an animal attraction with confidence — and how to run one
          well. Members get the full playbook library in their dashboard.
        </p>
        <div className="mt-6 max-w-2xl"><ContentNotice /></div>

        {CATEGORIES.map((cat) => {
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

        <div className="note mt-4">
          <span>
            Operators: members also get the venue outreach playbook, the pricing
            rate-sheet guide, the printable event-day run sheet, and the review
            engine —{" "}
            <Link href="/benefits" className="font-semibold" style={{ color: "var(--blue)" }}>
              see all member benefits
            </Link>.
          </span>
        </div>
      </div>
    </section>
  );
}
