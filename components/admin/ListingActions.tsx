"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setListingApproved, setListingFeatured, deleteListing } from "@/lib/admin/actions";

export default function ListingActions({
  listingId,
  approved,
  featured,
}: {
  listingId: string;
  approved: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Action failed.");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        className={approved ? "btn btn-ghost !px-3 !py-1.5 !text-xs" : "btn btn-primary !px-3 !py-1.5 !text-xs"}
        onClick={() => run(() => setListingApproved(listingId, !approved))}
      >
        {approved ? "Unapprove" : "Approve"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="btn btn-ghost !px-3 !py-1.5 !text-xs"
        onClick={() => run(() => setListingFeatured(listingId, !featured))}
      >
        {featured ? "Unfeature" : "Feature"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="btn btn-danger !px-3 !py-1.5 !text-xs"
        onClick={() => {
          if (confirm("Delete this listing permanently? Its leads are deleted with it.")) {
            run(() => deleteListing(listingId));
          }
        }}
      >
        Delete
      </button>
    </div>
  );
}
