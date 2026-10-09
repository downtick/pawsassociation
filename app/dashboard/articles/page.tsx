import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { MEMBER_ARTICLES, PUBLIC_ARTICLES } from "@/content/articles";

export const metadata: Metadata = { title: "Grow Your Animal Business", robots: { index: false } };

export default async function GuidesPage() {
  await requireActiveMember();

  return (
    <div>
      <h1 className="mb-2 text-3xl">Grow Your Animal Business</h1>
      <p className="mb-8" style={{ color: "var(--ink-3)" }}>
        {MEMBER_ARTICLES.length} lessons on marketing, pricing, and operations.
        Most come with a printable download in the Downloads tab.
      </p>

      <ol className="mb-12 grid gap-3">
        {MEMBER_ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link href={`/dashboard/articles/${a.slug}`} className="card card-hover flex items-start gap-4 p-5">
              <span className="stepno mt-1 w-6 flex-none">{String(a.lesson).padStart(2, "0")}</span>
              <span>
                <span className="block font-semibold" style={{ color: "var(--ink)" }}>{a.title}</span>
                <span className="text-sm" style={{ color: "var(--ink-3)" }}>{a.summary}</span>
                {a.download && <span className="badge mt-2 inline-flex !px-2 !py-0.5 text-[10px]">Includes download</span>}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mb-4">
        <h2 className="mb-3 text-xl">Public guides</h2>
        <p className="mb-3 text-sm" style={{ color: "var(--ink-3)" }}>
          On the public learning hub — useful to share with venues and clients.
        </p>
        <ul className="space-y-2 text-[15px]">
          {PUBLIC_ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link href={`/learn/${a.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
