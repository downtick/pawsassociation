import { createAdminClient } from "@/lib/supabase/admin";

// Login facts from the auth schema (verified? last sign-in? last active?),
// read through the service-role-only admin_user_activity() SQL function.
// Callers must have passed requireAdmin() first.
export interface AuthActivity {
  email_confirmed_at: string | null;
  confirmation_sent_at: string | null;
  last_sign_in_at: string | null;
  last_active_at: string | null;
}

export async function getAuthActivity(): Promise<Map<string, AuthActivity>> {
  const { data, error } = await createAdminClient().rpc("admin_user_activity");
  if (error) console.error("admin_user_activity failed:", error.message);
  return new Map(((data ?? []) as (AuthActivity & { id: string })[]).map(({ id, ...rest }) => [id, rest]));
}

// "Oct 21, 2026" in Pacific time; "—" when never.
export function formatDay(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
