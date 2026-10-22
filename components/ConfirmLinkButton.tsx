"use client";
import { useState } from "react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

export type ConfirmKind = "signup" | "magiclink" | "recovery";

const COPY: Record<ConfirmKind, { title: string; body: string; button: string }> = {
  signup: {
    title: "Confirm your email",
    body: "One more click and your PAWS account is ready.",
    button: "Confirm my email",
  },
  magiclink: {
    title: "Sign in to PAWS",
    body: "Click below to finish signing in.",
    button: "Sign me in",
  },
  recovery: {
    title: "Reset your password",
    body: "Click below, then choose a new password.",
    button: "Continue to set a new password",
  },
};

// The token is only spent when a person presses the button — see
// app/auth/confirm/page.tsx for why that matters.
export default function ConfirmLinkButton({
  tokenHash,
  type,
  kind,
}: {
  tokenHash: string;
  type: EmailOtpType;
  kind: ConfirmKind;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const copy = COPY[kind];

  async function confirm() {
    setStatus("loading");
    try {
      const { error } = await createClient().auth.verifyOtp({ token_hash: tokenHash, type });
      if (error) throw error;
    } catch {
      setStatus("error");
      return;
    }
    window.location.href = type === "recovery" ? "/reset-password" : "/post-login";
  }

  if (status === "error") {
    return (
      <>
        <h1 className="text-2xl mb-2">This link has expired</h1>
        <p className="text-[var(--ink-3)] mb-6">
          Links work once and expire after a while. If your email is already
          confirmed, just log in. Otherwise request a fresh link.
        </p>
        <a href="/login" className="btn-primary justify-center">Go to the login page</a>
      </>
    );
  }

  return (
    <>
      <span className="icbox" style={{ margin: "0 auto 12px" }}><Icon name="check" /></span>
      <h1 className="text-2xl mb-2">{copy.title}</h1>
      <p className="text-[var(--ink-3)] mb-6">{copy.body}</p>
      <button type="button" onClick={confirm} disabled={status === "loading"} className="btn-primary w-full justify-center">
        {status === "loading" ? "Please wait…" : copy.button}
      </button>
    </>
  );
}
