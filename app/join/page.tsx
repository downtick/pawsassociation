"use client";
import { useState } from "react";
import Link from "next/link";
import JoinButton from "@/components/JoinButton";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/siteConfig";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">Membership</span>
        <h1 className="display" style={{ fontSize: "clamp(28px,4vw,42px)", marginTop: 8 }}>
          Join the association. Get found. Get booked.
        </h1>
        <p className="lede" style={{ marginTop: 14 }}>
          {SITE.name} membership is built for petting zoos, pony rides, beer
          burros, mobile farms, and amusement operators. Your public directory
          listing works for you year-round — and the benefits vault pays you
          back on things you already buy.
        </p>

        <div className="grid gap-8 lg:grid-cols-2 items-start" style={{ marginTop: 36 }}>
          {/* What you get */}
          <div className="panel pricebox" style={{ maxWidth: "none" }}>
            <span className="badge">Annual membership</span>
            <div className="price">
              <span className="amt">$149</span>
              <span className="per">per year</span>
            </div>
            <ul className="ticks">
              {[
                "Your public directory listing — found by planners, schools, and families",
                "Leads emailed to you and collected in your leads inbox",
                "Partner discounts: rentals, hosting, business tools, and more",
                "Member guides: venue outreach, pricing, reviews, event-day checklists",
                `The ${SITE.name} member badge for your website and booth`,
                "Manage or cancel your membership yourself, anytime",
              ].map((t) => (
                <li key={t}><Icon name="check" />{t}</li>
              ))}
            </ul>
            <p className="terms">
              Cancel within 7 days of purchase for a full refund. After 7 days the membership is
              non-refundable. Renews automatically each year unless you cancel.
            </p>
          </div>

          {/* Sign-up */}
          <div className="panel">
            <h2 className="display" style={{ fontSize: 21 }}>Become a member</h2>
            <div>
              <label className="form-label" htmlFor="j-email">Email</label>
              <input id="j-email" type="email" autoComplete="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="j-password">Create a password</label>
              <input id="j-password" type="password" autoComplete="new-password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <JoinButton email={email} password={password} />

            <p className="fineprint">
              After payment you&apos;ll set up your listing — business name, attraction
              type, service area — and it goes live once our team reviews it.
            </p>
          </div>
        </div>

        <p className="text-center fineprint" style={{ marginTop: 28 }}>
          Already a member?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--blue)" }}>Log in</Link>
          {" · "}
          Membership provided by a partner? Your welcome email has your sign-in link.
        </p>
      </div>
    </section>
  );
}
