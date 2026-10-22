import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/access";
import NewPasswordForm from "@/components/NewPasswordForm";

export const metadata: Metadata = { title: "Set a New Password", robots: { index: false } };

// Reached from a password-reset email via /auth/confirm, which signs the
// person in with the recovery token first. Without that session there is
// nothing to update, so send them to request a reset.
export default async function ResetPasswordPage() {
  if (!isAuthConfigured()) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?reset=1");

  return (
    <section className="section flex-1 flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl mb-2 text-center">Set a new password</h1>
        <p className="text-[var(--ink-3)] text-center mb-8">For {user.email}</p>
        <div className="card p-8">
          <NewPasswordForm />
        </div>
      </div>
    </section>
  );
}
