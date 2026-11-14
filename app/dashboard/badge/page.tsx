import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/siteConfig";
import CopyCodeButton from "@/components/CopyCodeButton";
import TrackedLink from "@/components/TrackedLink";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Member Badge", robots: { index: false } };

// Member badge: a hosted image (public/badge/, rebuilt by
// scripts/build-badge.mjs) that members paste onto their own website, linked
// to their PAWS listing. Each badge is a referral link and a backlink.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function DashboardBadgePage() {
  const access = await requireActiveMember();
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("business_name, slug, approved")
    .eq("profile_id", access.id)
    .maybeSingle();

  const base = SITE.url.replace(/\/$/, "");
  const img = `${base}/badge/paws-member-badge.png`;
  const target = listing?.slug
    ? `${base}/members/${listing.slug}?utm_source=member_badge&utm_medium=referral&utm_campaign=member_badge`
    : base;
  const name = listing?.business_name ?? "Our business";
  const code = `<a href="${target}" target="_blank" rel="noopener" title="${esc(name)} on the PAWS directory"><img src="${img}" alt="${esc(name)} is a member of PAWS, the Professional Association of Wildlife &amp; Sports" width="200" height="69" style="border:0;height:auto;max-width:100%"></a>`;

  return (
    <div>
      <h1 className="mb-2 text-3xl">Your member badge</h1>
      <p className="mb-8" style={{ color: "var(--ink-3)" }}>
        Show customers you&apos;re part of PAWS. The badge links to your directory
        listing, so anyone who clicks it can see your profile and request a date.
      </p>

      {!listing && (
        <div className="note mb-8">
          <Icon name="info" />
          <span>
            Set up your <Link href="/dashboard/profile" style={{ color: "var(--blue)" }} className="font-semibold">directory listing</Link> first.
            Until then, the badge links to the PAWS homepage instead of your profile.
          </span>
        </div>
      )}
      {listing && !listing.approved && (
        <div className="note mb-8">
          <Icon name="info" />
          <span>Your listing is waiting for review. The badge link will open your profile as soon as it&apos;s approved.</span>
        </div>
      )}

      <section className="panel mb-8" style={{ maxWidth: "none" }}>
        <h2 className="text-xl">1. Add it to your website</h2>
        <div className="my-5 flex justify-center rounded-xl p-6" style={{ background: "var(--ground-2)", border: "1px solid var(--rule)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static badge preview, same file members embed */}
          <img src="/badge/paws-member-badge.png" alt="PAWS member badge" width={240} height={83} />
        </div>
        <p className="text-sm" style={{ color: "var(--ink-2)" }}>
          Copy this code and paste it where you want the badge to show, usually your
          website&apos;s footer or &ldquo;About&rdquo; page:
        </p>
        <pre className="my-3 overflow-x-auto rounded-lg p-3 text-xs" style={{ background: "var(--ground-2)", border: "1px solid var(--rule)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {code}
        </pre>
        <CopyCodeButton code={code} />
        <ul className="ticks mt-5 text-sm">
          <li><Icon name="check" /> <span><b>Wix:</b> Add → Embed code → Embed HTML, then paste.</span></li>
          <li><Icon name="check" /> <span><b>Squarespace:</b> add a Code block, then paste.</span></li>
          <li><Icon name="check" /> <span><b>WordPress:</b> add a Custom HTML block (or a Custom HTML widget in the footer), then paste.</span></li>
          <li><Icon name="check" /> <span><b>GoDaddy / Shopify / others:</b> look for &ldquo;HTML&rdquo;, &ldquo;Embed&rdquo; or &ldquo;Custom code&rdquo;.</span></li>
        </ul>
        <p className="mt-3 text-xs" style={{ color: "var(--ink-3)" }}>
          Someone else runs your website? Copy the code and email it to them.
        </p>
      </section>

      <section className="panel mb-8" style={{ maxWidth: "none" }}>
        <h2 className="text-xl">2. Use the image anywhere</h2>
        <p className="text-sm" style={{ color: "var(--ink-2)" }}>
          For Facebook and Instagram posts, your email signature, quotes and proposals.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <TrackedLink href="/badge/paws-member-badge.png" download event="file_download" params={{ file_name: "member-badge-png" }} className="btn btn-deal">
            <Icon name="doc" /> Badge (PNG)
          </TrackedLink>
          <TrackedLink href="/badge/paws-member-badge-large.png" download event="file_download" params={{ file_name: "member-badge-png-large" }} className="btn btn-ghost">
            Large PNG for print
          </TrackedLink>
          <TrackedLink href="/badge/paws-member-badge.svg" download event="file_download" params={{ file_name: "member-badge-svg" }} className="btn btn-ghost">
            SVG (for designers)
          </TrackedLink>
        </div>
      </section>

      <section className="panel" style={{ maxWidth: "none" }}>
        <h2 className="text-xl">3. Print a sign for your booth</h2>
        <p className="text-sm" style={{ color: "var(--ink-2)" }}>
          A letter-size &ldquo;Proud member of PAWS&rdquo; sign with your business name and
          a QR code to your listing. Guests can scan it to find you again for their next event.
        </p>
        <TrackedLink href="/api/badge/sign" event="file_download" params={{ file_name: "member-booth-sign" }} className="btn btn-primary mt-4">
          <Icon name="doc" /> Download booth sign (PDF)
        </TrackedLink>
      </section>
    </div>
  );
}
