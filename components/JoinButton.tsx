"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import AutoRenewConsent from "./AutoRenewConsent";
import { GUARANTEE_DAYS, PRICE_DOLLARS } from "@/lib/membershipPolicy";
import { track } from "@/lib/track";

// Starts Stripe Checkout for the $149/yr retail plan. If the visitor isn't
// signed in yet, creates a bare Supabase auth account first (email +
// password from this same form) so Checkout has a profile_id to attach to.
export default function JoinButton({ email, password }: { email: string; password: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentMissing, setConsentMissing] = useState(false);

  async function handleJoin() {
    if (!consent) {
      setConsentMissing(true);
      setError("Please check the box to confirm you understand the automatic renewal.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");

    if (!email || !password) {
      setError("Enter an email and password to continue.");
      setStatus("error");
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          // Without this the confirmation link lands on the site root, which
          // never exchanges the auth code — the visitor arrives signed out.
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (signUpErr && !signUpErr.message.toLowerCase().includes("already registered")) {
          setError(signUpErr.message);
          setStatus("error");
          return;
        }
        // "Confirm email" is ON in Supabase, so a new account gets NO session
        // until the emailed link is clicked. Calling checkout now can only
        // fail with "must be signed in" — tell them what to do instead. The
        // link returns them via /post-login to /membership, which resumes
        // payment.
        if (!signUpErr && !signUpData.session) {
          setConfirmSent(true);
          setStatus("idle");
          return;
        }
        // If the account already existed, try signing in instead
        if (signUpErr) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (signInErr) {
            setError("An account with this email already exists. Try logging in instead.");
            setStatus("error");
            return;
          }
        }
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoRenewConsent: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Unable to start checkout.");
        setStatus("error");
        return;
      }
      track("begin_checkout", { currency: "USD", value: 149 });
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (confirmSent) {
    return (
      <div className="note" style={{ textAlign: "left" }}>
        <Icon name="info" />
        <span>
          <strong>Check your email to continue.</strong> We sent a confirmation link to{" "}
          <strong>{email}</strong>. Click it and you&apos;ll come straight back here to finish
          payment. Not there in a couple of minutes? Check spam.
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <AutoRenewConsent checked={consent} invalid={consentMissing && !consent} onChange={(v) => { setConsent(v); if (v) { setConsentMissing(false); setError(""); } }} />
      <button onClick={handleJoin} disabled={status === "loading"} className="btn-primary btn-join w-full justify-center">
        {status === "loading" ? "Redirecting to checkout…" : `Join PAWS for $${PRICE_DOLLARS}/year`}
      </button>
      <p className="text-center text-xs" style={{ color: "var(--ink-3)", margin: 0 }}>
        {GUARANTEE_DAYS}-day money-back guarantee. Cancel online anytime.
      </p>
      {error && <p className="form-error mt-3"><Icon name="info" />{error}</p>}
    </div>
  );
}
