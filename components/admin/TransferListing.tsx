"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { transferListing } from "@/lib/admin/actions";

// "Move to member" on an unclaimed listing: the last step of a claim, once
// the owner has joined and been verified.
export default function TransferListing({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(`Move this listing to ${email.trim()}? Only do this after you've confirmed they own the business.`)) return;
    startTransition(async () => {
      try {
        const r = await transferListing(listingId, email);
        setResult(r);
        if (r.ok) router.refresh();
      } catch (err) {
        setResult({ ok: false, message: err instanceof Error ? err.message : "Action failed." });
      }
    });
  }

  return (
    <form onSubmit={submit} className="mt-2 flex flex-wrap gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Member email"
        aria-label="Member email to move this listing to"
        className="form-input max-w-[220px] !py-1.5 text-xs"
      />
      <button type="submit" disabled={pending || !email.trim()} className="btn btn-ghost !px-3 !py-1.5 !text-xs">
        {pending ? "Moving…" : "Move to member"}
      </button>
      {result && (
        <p className="w-full text-xs" style={{ color: result.ok ? "var(--blue)" : "var(--danger)", margin: 0 }}>{result.message}</p>
      )}
    </form>
  );
}
