import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/access";

// Sends a freshly-signed-in user to the right place based on their role,
// or back to the page that sent them (?next=) when that's a same-site path.
// Used as the landing target for both password login and magic-link login.
function safeNext(next: string | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

export default async function PostLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  const next = safeNext((await searchParams).next);
  if (next) redirect(next);
  if (profile.role === "admin") redirect("/admin");

  redirect("/dashboard");
}
