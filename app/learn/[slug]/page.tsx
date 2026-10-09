import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PUBLIC_ARTICLES, MEMBER_ARTICLES, getArticleBySlug } from "@/content/articles";
import { getDownload } from "@/content/downloads";
import { getCurrentAccess } from "@/lib/access";
import ContentNotice from "@/components/ContentNotice";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { SITE } from "@/lib/siteConfig";

// One URL per article. Public articles render in full. Course lessons
// ("memberOnly") render the public teaser + a locked outline for everyone
// — that's what search engines index — and the full lesson only for a
// signed-in member with access. "Index the promise, gate the payoff."
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.lesson ? `${article.title} (Lesson ${article.lesson})` : article.title,
    description: article.summary,
    alternates: { canonical: `/learn/${article.slug}` },
  };
}

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const access = article.memberOnly ? await getCurrentAccess() : null;
  const unlocked = !article.memberOnly || Boolean(access && (access.has_access || access.role === "admin"));
  const download = article.download ? getDownload(article.download) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    url: `${SITE.url}/learn/${article.slug}`,
    isAccessibleForFree: !article.memberOnly,
    publisher: { "@type": "Organization", name: SITE.fullName, url: SITE.url },
  };

  const siblings = article.memberOnly ? MEMBER_ARTICLES : PUBLIC_ARTICLES;
  const related = article.lesson
    ? MEMBER_ARTICLES.filter((a) => a.lesson === (article.lesson ?? 0) + 1)
    : siblings.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2);

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap" style={{ maxWidth: 760 }}>
        <nav className="text-xs" style={{ color: "var(--ink-3)" }} aria-label="Breadcrumb">
          <Link href="/learn" style={{ color: "var(--blue)" }}>Learning hub</Link>
          {" / "}
          {article.lesson ? `Grow Your Animal Business — Lesson ${article.lesson} of ${MEMBER_ARTICLES.length}` : article.category}
        </nav>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {article.memberOnly && (
            <span className="badge"><Icon name="badge" /> Member lesson</span>
          )}
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl">{article.title}</h1>
        <div className="mt-6"><ContentNotice /></div>

        <article className="prose-warm">
          {article.teaser}
          {unlocked ? article.body : null}
        </article>

        {!unlocked && (
          <div className="relative mt-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-0 right-0 h-24"
              style={{ background: "linear-gradient(to bottom, rgba(248,250,252,0), var(--ground))" }}
            />
            <div className="panel">
              <span className="eyebrow">Members only</span>
              <h2 className="text-xl">Keep reading with a PAWS membership</h2>
              {article.outline && (
                <>
                  <p className="text-sm" style={{ color: "var(--ink-2)" }}>The rest of this lesson covers:</p>
                  <ul className="ticks">
                    {article.outline.map((o) => (
                      <li key={o}><Icon name="check" />{o}</li>
                    ))}
                  </ul>
                </>
              )}
              {download && (
                <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                  Includes the printable{" "}
                  <Link href={`/downloads/${download.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>
                    {download.title}
                  </Link>
                  , stamped with your business name.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link href="/join" className="btn btn-primary">Join for $149/year</Link>
                {access ? (
                  <Link href="/membership" className="btn btn-ghost">Reactivate membership</Link>
                ) : (
                  <Link href={`/login?next=/learn/${article.slug}`} className="btn btn-ghost">Member log in</Link>
                )}
              </div>
              <p className="fineprint">
                Membership includes all {MEMBER_ARTICLES.length} lessons, every printable
                download, your directory listing, and partner discounts.
              </p>
            </div>
          </div>
        )}

        {unlocked && download && (
          <div className="note mt-8">
            <Icon name="doc" />
            <span>
              Companion download:{" "}
              <TrackedLink href={`/api/downloads/${download.slug}`} event="file_download" params={{ file_name: download.slug }} className="font-semibold" style={{ color: "var(--blue)" }}>
                {download.title} (PDF)
              </TrackedLink>
            </span>
          </div>
        )}

        {!article.memberOnly && (
          <div className="note mt-10">
            <span>
              Planning an event?{" "}
              <Link href="/directory" className="font-semibold" style={{ color: "var(--blue)" }}>
                Search the member directory
              </Link>{" "}
              — free, with requests going straight to the operator. Operators:{" "}
              <Link href="/join" className="font-semibold" style={{ color: "var(--blue)" }}>
                join {SITE.name}
              </Link>{" "}
              to get listed.
            </span>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow">{article.lesson ? "Next lesson" : "Related"}</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link href={`/learn/${a.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>
                    {a.lesson ? `Lesson ${a.lesson}: ` : ""}{a.title}
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

