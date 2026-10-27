import type { Metadata } from "next";
import Link from "next/link";
import { DOWNLOADS, DOWNLOAD_GROUPS } from "@/content/downloads";
import DownloadPreview from "@/components/DownloadPreview";

export const metadata: Metadata = {
  title: "Printable signs, forms & templates for animal businesses",
  description:
    "Printable hand washing and petting zoo signs, rate sheet and inquiry forms, a venue checklist, an animal care log, a 12-month marketing calendar, and a fillable flyer — free for PAWS members.",
  alternates: { canonical: "/downloads" },
};

export default function DownloadsPage() {
  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">Member downloads</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">Printable tools for animal businesses</h1>
        <p className="lede mt-4">
          Event signs, business forms, and marketing templates built for petting
          zoos, pony rides, beer burros, and mobile farms. Members download every
          file free, printed with their own business name.
        </p>

        {DOWNLOAD_GROUPS.map((group) => (
          <div key={group} className="mt-12">
            <h2 className="mb-4 text-xl">{group}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DOWNLOADS.filter((d) => d.group === group).map((d) => (
                <Link key={d.slug} href={`/downloads/${d.slug}`} className="card card-hover flex flex-col gap-3 p-4 !no-underline">
                  <DownloadPreview d={d} />
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--ink)" }}>{d.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--ink-3)" }}>{d.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="note mt-12">
          <span>
            Every download is included with PAWS membership ($149/year), along
            with the 20-lesson marketing course and your directory listing.{" "}
            <Link href="/benefits" className="font-semibold" style={{ color: "var(--blue)" }}>See all member benefits</Link>.
          </span>
        </div>
      </div>
    </section>
  );
}
