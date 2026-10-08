import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PUBLIC_ARTICLES, getArticleBySlug } from "@/content/articles";
import ContentNotice from "@/components/ContentNotice";
import { SITE } from "@/lib/siteConfig";

// Public article pages — the SEO/LLM surface. Member-only slugs 404 here;
// they render behind the paywall at /dashboard/articles/[slug].

export function generateStaticParams() {
  return PUBLIC_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.memberOnly) return {};
  return { title: article.title, description: article.summary };
}

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.memberOnly) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    url: `${SITE.url}/learn/${article.slug}`,
    publisher: { "@type": "Organization", name: SITE.fullName, url: SITE.url },
  };

  const related = PUBLIC_ARTICLES.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2);

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap" style={{ maxWidth: 760 }}>
        <nav className="text-xs" style={{ color: "var(--ink-3)" }} aria-label="Breadcrumb">
          <Link href="/learn" style={{ color: "var(--blue)" }}>Learning hub</Link> / {article.category}
        </nav>
        <h1 className="mt-3 text-3xl sm:text-4xl">{article.title}</h1>
        <div className="mt-6"><ContentNotice /></div>
        <article className="prose-warm">{article.body}</article>

        <div className="note mt-10">
          <span>
            Planning an event?{" "}
            <Link href="/directory" className="font-semibold" style={{ color: "var(--blue)" }}>
              Search the member directory
            </Link>{" "}
            — free, and every member agrees to our safety standards. Operators:{" "}
            <Link href="/join" className="font-semibold" style={{ color: "var(--blue)" }}>
              join {SITE.name}
            </Link>{" "}
            to get listed.
          </span>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow">Related</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link href={`/learn/${a.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
