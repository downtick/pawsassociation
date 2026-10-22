"use client";
import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

export default function NewPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setStatus("saving");
    const { error: err } = await createClient().auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setStatus("error");
      return;
    }
    window.location.href = "/post-login";
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="form-label" htmlFor="np-password">New password</label>
        <input id="np-password" type="password" required autoComplete="new-password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="np-confirm">Type it again</label>
        <input id="np-confirm" type="password" required autoComplete="new-password" className="form-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      {error && <p className="form-error mb-3"><Icon name="info" />{error}</p>}
      <button type="submit" disabled={status === "saving"} className="btn-primary w-full justify-center">
        {status === "saving" ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
