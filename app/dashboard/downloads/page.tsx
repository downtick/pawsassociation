import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { DOWNLOADS, DOWNLOAD_GROUPS } from "@/content/downloads";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = { title: "Downloads", robots: { index: false } };

export default async function DashboardDownloadsPage() {
  await requireActiveMember();

  return (
    <div>
      <h1 className="mb-2 text-3xl">Downloads</h1>
      <p className="mb-8" style={{ color: "var(--ink-3)" }}>
        Every file is generated with your business name on it (from your
        listing). Print, laminate, and reuse.
      </p>

      {DOWNLOAD_GROUPS.map((group) => (
        <section key={group} className="mb-10">
          <h2 className="mb-3 text-xl">{group}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOWNLOADS.filter((d) => d.group === group).map((d) => (
              <div key={d.slug} className="perk">
                <div className="perkhead">
                  <span className="icbox"><Icon name={d.kind === "sign" ? "badge" : d.kind === "flyer" ? "tag" : "doc"} /></span>
                  <div className="min-w-0">
                    <span className="cat">{d.pages}</span>
                    <h4>{d.title}</h4>
                  </div>
                </div>
                <p>{d.summary}</p>
                <div className="perkfoot">
                  <Link href={`/downloads/${d.slug}`} className="text-sm" style={{ color: "var(--ink-3)" }}>Details</Link>
                  <TrackedLink href={`/api/downloads/${d.slug}`} event="file_download" params={{ file_name: d.slug }} className="btn btn-deal">
                    <Icon name="doc" /> Download PDF
                  </TrackedLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
