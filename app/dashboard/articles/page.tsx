import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { MEMBER_ARTICLES, PUBLIC_ARTICLES } from "@/content/articles";

export const metadata: Metadata = { title: "Member guides" };

const CATEGORIES = ["Marketing", "Business", "Operations"] as const;

export default async function GuidesPage() {
  await requireActiveMember();

  return (
    <div>
      <h1 className="mb-2 text-3xl">Member guides</h1>
      <p className="mb-8" style={{ color: "var(--ink-3)" }}>
        Playbooks written for animal-attraction and amusement operators —
        outreach scripts, pricing structure, and printable checklists.
      </p>

      {CATEGORIES.map((cat) => {
        const items = MEMBER_ARTICLES.filter((a) => a.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="mb-3 text-xl">{cat}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <Link key={a.slug} href={`/dashboard/articles/${a.slug}`} className="card card-hover block p-5">
                  {a.printable && <span className="badge mb-2 inline-flex !px-2 !py-0.5 text-[10px]">Printable</span>}
                  <h3 className="mb-1 font-semibold">{a.title}</h3>
                  <p className="text-sm" style={{ color: "var(--ink-3)" }}>{a.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mb-4">
        <h2 className="mb-3 text-xl">Public guides</h2>
        <p className="mb-3 text-sm" style={{ color: "var(--ink-3)" }}>
          Also on the site&apos;s public learning hub — useful to share with venues and clients.
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
