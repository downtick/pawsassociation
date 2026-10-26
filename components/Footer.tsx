import Link from "next/link";
import Icon from "./Icon";
import { SITE } from "@/lib/siteConfig";
import { FEATURED_CATEGORIES } from "@/lib/directory";

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: "1px solid var(--rule)", background: "var(--ground-2)" }}>
      <div className="wrap py-12 grid gap-10 md:grid-cols-4">
        <div>
          <span className="logo mb-3">
            <span className="mark"><Icon name="spark" /></span>
            <span>{SITE.name}</span>
          </span>
          <p className="text-sm mt-3" style={{ color: "var(--ink-3)" }}>
            The Professional Association of Wildlife &amp; Sports — the national
            directory of animal-attraction and amusement operators: petting zoos,
            pony rides, beer burros, and mobile farms.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Find a member</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--ink-2)" }}>
            {FEATURED_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/directory/${c.slug}`} className="navlink !px-0">{c.name}</Link>
              </li>
            ))}
            <li><Link href="/directory" className="navlink !px-0">All attraction types</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Membership</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--ink-2)" }}>
            <li><Link href="/join" className="navlink !px-0">Become a member</Link></li>
            <li><Link href="/benefits" className="navlink !px-0">Member benefits</Link></li>
            <li><Link href="/get-listed" className="navlink !px-0">Get listed</Link></li>
            <li><Link href="/login" className="navlink !px-0">Log in</Link></li>
            <li><Link href="/faq" className="navlink !px-0">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Company</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--ink-2)" }}>
            <li><Link href="/about" className="navlink !px-0">About</Link></li>
            <li><Link href="/learn" className="navlink !px-0">Learning hub</Link></li>
            <li><Link href="/downloads" className="navlink !px-0">Printable downloads</Link></li>
            <li><Link href="/contact" className="navlink !px-0">Contact</Link></li>
            <li><Link href="/terms" className="navlink !px-0">Terms of Service</Link></li>
            <li><Link href="/privacy" className="navlink !px-0">Privacy Policy</Link></li>
            <li><Link href="/disclaimer" className="navlink !px-0">Disclaimer</Link></li>
            <li><Link href="/request-removal" className="navlink !px-0">Remove a listing</Link></li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="wrap py-5 text-xs flex flex-wrap gap-2 justify-between" style={{ color: "var(--ink-3)" }}>
          <p>&copy; {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</p>
          <p>Membership is $149 a year, renewing annually until you cancel. See Terms for cancellation details.</p>
        </div>
      </div>
    </footer>
  );
}
