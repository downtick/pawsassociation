import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAccess } from "@/lib/access";
import ResumeCheckoutButton from "@/components/ResumeCheckoutButton";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Your membership", robots: { index: false } };
export const dynamic = "force-dynamic";

// Where a signed-in member WITHOUT access lands. Deliberately outside
// /dashboard: the dashboard layout requires access, so any status page inside
// it would redirect to itself forever.
export default async function MembershipStatusPage() {
  const access = await getCurrentAccess();
  if (!access) redirect("/login");
  if (access.role === "admin") redirect("/admin");
  if (access.has_access) redirect("/dashboard");

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;

  // 1. Partner-provided (comp) membership whose term has ended.
  if (access.billing_source === "comp") {
    return (
      <Shell title="Your membership has ended">
        <p>
          Your {SITE.name} membership
          {fmt(access.comp_until) ? <> ended on <strong>{fmt(access.comp_until)}</strong></> : " has ended"}.
        </p>
        <p>
          If your membership was provided through a partner, check with them about
          renewing — or rejoin on your own and keep your listing live without
          interruption.
        </p>
        <ResumeCheckoutButton label="Rejoin — $149/year" />
      </Shell>
    );
  }

  // 2. Created an account but never completed payment.
  if (access.membership_status === "pending") {
    return (
      <Shell title="One step left">
        <p>
          Your account is set up — the last step is payment. Membership is $149 a
          year and renews automatically until you cancel. Your directory listing
          goes live after this step.
        </p>
        <ResumeCheckoutButton label="Continue to payment — $149/year" />
      </Shell>
    );
  }

  // 3. A membership that lapsed or was cancelled.
  return (
    <Shell title="Your membership isn't active">
      <p>
        Your {SITE.name} membership is no longer active, so your directory listing
        is hidden and the benefits vault is locked. Rejoin to get both back.
      </p>
      <ResumeCheckoutButton label="Rejoin — $149/year" />
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 620 }}>
        <div className="card p-6" style={{ display: "grid", gap: 14, lineHeight: 1.6 }}>
          <h1 className="display" style={{ fontSize: 30 }}>{title}</h1>
          {children}
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 8 }}>
            Questions? <Link href="/contact" style={{ color: "var(--blue)" }}>Contact us</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
