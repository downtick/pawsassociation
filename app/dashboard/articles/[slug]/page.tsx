import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireActiveMember } from "@/lib/access";
import { MEMBER_ARTICLES, getArticleBySlug } from "@/content/articles";
import { getDownload } from "@/content/downloads";
import PrintButton from "@/components/PrintButton";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  return { title: article?.title || "Article", robots: { index: false } };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireActiveMember();
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const download = article.download ? getDownload(article.download) : undefined;
  const next = article.lesson ? MEMBER_ARTICLES.find((a) => a.lesson === (article.lesson ?? 0) + 1) : undefined;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/articles" className="text-sm text-[var(--ink-3)] nav-link mb-4 inline-block">
        Back to the course
      </Link>
      {article.lesson && (
        <p className="stepno">Lesson {article.lesson} of {MEMBER_ARTICLES.length}</p>
      )}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl">{article.title}</h1>
        {article.printable && <PrintButton />}
      </div>
      <article className={`prose-warm ${article.printable ? "print-sheet" : ""}`}>
        {article.teaser}
        {article.body}
      </article>
      {download && (
        <div className="note mt-8 no-print">
          <Icon name="doc" />
          <span>
            Companion download:{" "}
            <TrackedLink href={`/api/downloads/${download.slug}`} event="file_download" params={{ file_name: download.slug }} className="font-semibold" style={{ color: "var(--blue)" }}>
              {download.title} (PDF)
            </TrackedLink>
          </span>
        </div>
      )}
      {next && (
        <p className="mt-8 no-print">
          <Link href={`/dashboard/articles/${next.slug}`} className="btn btn-primary">
            Next: Lesson {next.lesson} <Icon name="right" />
          </Link>
        </p>
      )}
    </div>
  );
}
