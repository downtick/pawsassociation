import type { Metadata } from "next";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Email preferences", robots: { index: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ u?: string; t?: string; status?: string }> }) {
  const { u = "", t = "", status } = await searchParams;

  const message =
    status === "done"
      ? "You're unsubscribed from PAWS tips emails. You'll still get account and billing notices, like renewal reminders."
      : status === "resubscribed"
        ? "You're subscribed to PAWS tips emails again."
        : status === "invalid"
          ? "This link isn't valid anymore. Log in and contact us, and we'll update your email preferences."
          : null;

  return (
    <section className="section flex-1 flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full card p-8 text-center">
        <h1 className="text-2xl mb-3">Email preferences</h1>
        {message ? (
          <p className="text-[var(--ink-2)] mb-6">{message}</p>
        ) : (
          <p className="text-[var(--ink-2)] mb-6">
            Stop the {SITE.name} member tips emails (getting started, course, benefits)? Account and
            billing notices will still come, because they&apos;re about your membership.
          </p>
        )}
        {status !== "invalid" && (
          <form action="/api/email/unsubscribe" method="post">
            <input type="hidden" name="u" value={u} />
            <input type="hidden" name="t" value={t} />
            {status === "done" ? (
              <button type="submit" name="resubscribe" value="1" className="btn-outline">Resubscribe</button>
            ) : status === "resubscribed" ? null : (
              <button type="submit" className="btn-primary justify-center w-full">Unsubscribe from tips emails</button>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
