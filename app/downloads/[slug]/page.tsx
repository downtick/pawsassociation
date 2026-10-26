import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOWNLOADS, getDownload } from "@/content/downloads";
import { getArticleBySlug } from "@/content/articles";
import { getCurrentAccess } from "@/lib/access";
import DownloadPreview from "@/components/DownloadPreview";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/JsonLd";

// Public, indexable preview of a member download. The PDF itself is only
// served by /api/downloads/[slug] to members with access.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDownload(slug);
  if (!d) return {};
  return {
    title: `${d.title} (Printable PDF)`,
    description: `${d.summary} ${d.description}`.slice(0, 300),
    alternates: { canonical: `/downloads/${d.slug}` },
  };
}

export default async function DownloadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locked?: string }>;
}) {
  const { slug } = await params;
  const { locked } = await searchParams;
  const d = getDownload(slug);
  if (!d) notFound();

  const access = await getCurrentAccess();
  const unlocked = Boolean(access && (access.has_access || access.role === "admin"));
  const lesson = d.lessonSlug ? getArticleBySlug(d.lessonSlug) : undefined;
  const others = DOWNLOADS.filter((x) => x.group === d.group && x.slug !== d.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: d.title,
    description: d.description,
    url: `${SITE.url}/downloads/${d.slug}`,
    encodingFormat: "application/pdf",
    isAccessibleForFree: false,
    publisher: { "@type": "Organization", name: SITE.fullName, url: SITE.url },
  };

  return (
    <section className="section">
      <JsonLd data={jsonLd} />
      <div className="wrap">
        <nav className="text-xs" style={{ color: "var(--ink-3)" }} aria-label="Breadcrumb">
          <Link href="/downloads" style={{ color: "var(--blue)" }}>Downloads</Link> / {d.group}
        </nav>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <h1 className="text-3xl sm:text-4xl">{d.title}</h1>
            <p className="lede mt-4 !max-w-none">{d.description}</p>
            <p className="mt-3 text-sm" style={{ color: "var(--ink-3)" }}>PDF · {d.pages}</p>

            <h2 className="mt-8 text-lg">What&apos;s inside</h2>
            <ul className="ticks mt-3">
              {d.whatsInside.map((w) => <li key={w}><Icon name="check" />{w}</li>)}
            </ul>

            <div className="panel mt-8">
              {unlocked ? (
                <>
                  <h2 className="text-xl">Ready to download</h2>
                  <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                    Your copy is generated with your business name on it.
                  </p>
                  <TrackedLink href={`/api/downloads/${d.slug}`} event="file_download" params={{ file_name: d.slug }} className="btn btn-primary w-fit">
                    <Icon name="doc" /> Download PDF
                  </TrackedLink>
                </>
              ) : (
                <>
                  {locked && (
                    <p className="form-alert"><Icon name="info" />Downloads are for PAWS members. Join or log in to get this file.</p>
                  )}
                  <span className="eyebrow">Members download free</span>
                  <h2 className="text-xl">Get this and every PAWS download</h2>
                  <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                    Membership is $149/year and includes all printable tools —
                    stamped with your business name — plus the 11-lesson marketing
                    course, your directory listing, and partner discounts.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/join" className="btn btn-primary">Join PAWS</Link>
                    {access ? (
                      <Link href="/membership" className="btn btn-ghost">Reactivate membership</Link>
                    ) : (
                      <Link href={`/login?next=/downloads/${d.slug}`} className="btn btn-ghost">Member log in</Link>
                    )}
                  </div>
                </>
              )}
            </div>

            {lesson && (
              <p className="mt-6 text-sm" style={{ color: "var(--ink-2)" }}>
                Taught in{" "}
                <Link href={`/learn/${lesson.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>
                  {lesson.lesson ? `Lesson ${lesson.lesson}: ` : ""}{lesson.title}
                </Link>
                .
              </p>
            )}
          </div>

          <div className="mx-auto w-full max-w-md">
            <DownloadPreview d={d} locked={!unlocked} />
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-16">
            <p className="eyebrow">More {d.group.toLowerCase()}</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/downloads/${o.slug}`} className="font-semibold" style={{ color: "var(--blue)" }}>{o.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
