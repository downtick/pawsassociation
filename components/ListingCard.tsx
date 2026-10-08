import Link from "next/link";
import Icon from "./Icon";
import type { PublicListing } from "@/lib/types";

// One member card, shared by the homepage featured grid and every directory
// results page. Deliberately compact: name, place, type, service tags.
export default function ListingCard({ listing }: { listing: PublicListing }) {
  const initials = listing.business_name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  return (
    <Link
      href={`/members/${listing.slug}`}
      className="perk !no-underline"
      style={{ textDecoration: "none" }}
    >
      <div className="perkhead">
        <span
          className="grid h-11 w-11 flex-none place-items-center rounded-xl text-sm font-bold"
          style={{ background: "var(--blue-wash)", color: "var(--blue)", border: "1px solid #BFDBFE" }}
          aria-hidden="true"
        >
          {initials || "•"}
        </span>
        <div className="min-w-0">
          <h4 className="truncate">{listing.business_name}</h4>
          <p className="!m-0 flex items-center gap-1 text-xs" style={{ color: "var(--ink-3)" }}>
            {listing.city ? `${listing.city}, ${listing.state}` : listing.state ?? "United States"}
          </p>
        </div>
        {listing.featured && (
          <span className="pill on ml-auto flex-none">Featured</span>
        )}
      </div>
      {listing.category_name && <span className="cat">{listing.category_name}</span>}
      {listing.bio && <p className="line-clamp-2">{listing.bio}</p>}
      {listing.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {listing.services.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ background: "var(--ground-3)", color: "var(--ink-2)", border: "1px solid var(--rule)" }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
      <span className="perkfoot text-sm font-semibold" style={{ color: "var(--blue)" }}>
        View profile <Icon name="right" />
      </span>
    </Link>
  );
}
