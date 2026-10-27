import Link from "next/link";
import { getCurrentProfile } from "@/lib/access";
import { SITE } from "@/lib/siteConfig";
import Icon from "./Icon";
import OmniSearch from "./OmniSearch";
import MobileNav from "./MobileNav";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const profile = await getCurrentProfile();
  const dashboardHref = profile?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo shrink-0">
          <span className="mark"><Icon name="paw" /></span>
          <span className="flex flex-col leading-tight">
            <span>{SITE.name}</span>
            <span className="hidden sm:block text-[10px] font-normal tracking-wide" style={{ color: "var(--ink-3)" }}>
              Professional Association of Wildlife &amp; Sports
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden md:flex items-center gap-1">
          <Link href="/directory" className="navlink">Find a member</Link>
          <Link href="/benefits" className="navlink">Member benefits</Link>
          <Link href="/learn" className="navlink">Learn</Link>
          <Link href="/downloads" className="navlink">Downloads</Link>
          <Link href="/faq" className="navlink hidden xl:inline-flex">FAQ</Link>
          <Link href="/contact" className="navlink hidden xl:inline-flex">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 md:ml-2 ml-auto">
          {profile && <OmniSearch />}
          {profile ? (
            <>
              <Link href={dashboardHref} className="btn btn-primary">Dashboard</Link>
              <span className="hidden md:contents"><LogoutButton /></span>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost hidden sm:inline-flex">Log in</Link>
              <Link href="/join" className="btn btn-primary">Join</Link>
            </>
          )}
          <MobileNav loggedIn={!!profile} dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  );
}
