import type { Metadata } from "next";
import { ALL_PHOTOS } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Credits and licenses for the photos used on the PAWS website.",
  robots: { index: false },
};

export default function PhotoCreditsPage() {
  return (
    <section className="section flex-1">
      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl mb-3">Photo credits</h1>
        <p className="text-[var(--ink-2)] mb-8">
          The animal photos on our homepage come from Wikimedia Commons and are used under
          the licenses below. We cropped and resized them. The photographers have no
          connection to PAWS and don&apos;t endorse it.
        </p>
        <ul className="grid gap-4">
          {ALL_PHOTOS.map((p) => (
            <li key={p.src} className="card p-4 text-sm" style={{ color: "var(--ink-2)" }}>
              <a href={p.source} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold" style={{ color: "var(--blue)" }}>
                {p.title}
              </a>{" "}
              by {p.author} ·{" "}
              {p.licenseUrl ? (
                <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "var(--blue)" }}>{p.license}</a>
              ) : (
                p.license
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
