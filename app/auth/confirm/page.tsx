import type { Metadata } from "next";
import ConfirmLinkButton, { type ConfirmKind } from "@/components/ConfirmLinkButton";

export const metadata: Metadata = { title: "Continue", robots: { index: false } };

// Landing page for every link in a PAWS auth email (signup confirmation,
// sign-in link, password reset, admin-sent set-password link).
//
// Why a page with a button instead of Supabase's default one-click link:
// corporate mail filters (Microsoft 365 Safe Links, Mimecast, Proofpoint)
// open every link in an email before the person sees it. A one-click link
// is "used up" by the scanner, so the member gets "link expired". Scanners
// load pages but don't press buttons, so nothing is spent until a human
// clicks. verifyOtp with the token hash also works on a different browser
// or device than the one that signed up (no PKCE cookie needed).
const KINDS: ConfirmKind[] = ["signup", "magiclink", "recovery"];
const OTP_TYPES = ["email", "signup", "magiclink", "recovery", "invite", "email_change"] as const;

export default async function AuthConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; kind?: string }>;
}) {
  const { token_hash, type, kind } = await searchParams;
  const otpType = OTP_TYPES.find((t) => t === type);
  const confirmKind: ConfirmKind =
    KINDS.find((k) => k === kind) ?? (type === "recovery" ? "recovery" : "magiclink");

  return (
    <section className="section flex-1 flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {token_hash && otpType ? (
            <ConfirmLinkButton tokenHash={token_hash} type={otpType} kind={confirmKind} />
          ) : (
            <>
              <h1 className="text-2xl mb-2">This link is incomplete</h1>
              <p className="text-[var(--ink-3)] mb-6">
                Part of the link may have been cut off. Request a fresh one from the login page.
              </p>
              <a href="/login" className="btn-primary justify-center">Go to the login page</a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
