import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { memberNumberDigits } from "@/lib/membership";
import { requireAdmin } from "@/lib/access";
import { getAuthActivity, formatDay } from "@/lib/admin/authActivity";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; verified?: string }>;
}) {
  await requireAdmin();
  const { q = "", status = "", verified = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, email, first_name, last_name, member_number, role, membership_status, plan, billing_source, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("membership_status", status);
  if (q) query = query.or(`email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,member_number.ilike.%${q}%`);

  const [{ data: rows }, activity] = await Promise.all([query, getAuthActivity()]);
  const members = (rows ?? []).filter((m) => {
    if (!verified) return true;
    const isVerified = Boolean(activity.get(m.id)?.email_confirmed_at);
    return verified === "yes" ? isVerified : !isVerified;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl">Members</h1>
        <Link href="/admin/members/new" className="btn-dark !py-2 !px-4 text-sm">+ Add member</Link>
      </div>
      <p className="text-sm text-[var(--ink-3)] -mt-3 mb-6">
        Click <strong>Manage</strong> on a row to resend the welcome or verification email, send a
        password reset, grant free days, change status, or make someone an admin.
      </p>

      <form className="flex flex-wrap gap-3 mb-6" method="GET">
        <input name="q" defaultValue={q} placeholder="Search name, email, member #…" className="form-input max-w-xs" />
        <select name="status" defaultValue={status} className="form-input max-w-[180px]">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="past_due">Past due</option>
          <option value="lapsed">Lapsed</option>
          <option value="canceled">Canceled</option>
          <option value="pending">Pending</option>
        </select>
        <select name="verified" defaultValue={verified} className="form-input max-w-[180px]">
          <option value="">Verified or not</option>
          <option value="no">Email NOT verified</option>
          <option value="yes">Email verified</option>
        </select>
        <button type="submit" className="btn-outline">Filter</button>
      </form>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: "var(--rule)" }}>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Member no.</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last login</th>
              <th className="p-3">Last active</th>
              <th className="p-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const a = activity.get(m.id);
              return (
              <tr key={m.id} className="border-b" style={{ borderColor: "var(--rule)" }}>
                <td className="p-3">
                  {/* Fall back to the email so the link is never a bare "—". */}
                  <Link href={`/admin/members/${m.id}`} className="nav-link font-semibold" style={{ color: "var(--blue)" }}>
                    {[m.first_name, m.last_name].filter(Boolean).join(" ") || m.email}
                  </Link>
                  {m.role === "admin" && <span className="ml-2 text-xs font-semibold" style={{ color: "var(--blue)" }}>ADMIN</span>}
                </td>
                <td className="p-3">
                  {m.email}
                  <span
                    className="block text-xs font-semibold"
                    style={{ color: a?.email_confirmed_at ? "var(--good)" : "var(--danger)" }}
                  >
                    {a?.email_confirmed_at ? "✓ Verified" : "Not verified"}
                  </span>
                </td>
                <td className="p-3 mono">{memberNumberDigits(m.member_number)}</td>
                <td className="p-3">{m.billing_source === "comp" ? "Comp" : "Retail"}</td>
                <td className="p-3 capitalize">{m.membership_status}</td>
                <td className="p-3 whitespace-nowrap">{formatDay(a?.last_sign_in_at)}</td>
                <td className="p-3 whitespace-nowrap">{formatDay(a?.last_active_at)}</td>
                <td className="p-3 whitespace-nowrap">
                  <Link href={`/admin/members/${m.id}`} className="btn-outline !py-1.5 !px-3 !text-xs">
                    Manage →
                  </Link>
                </td>
              </tr>
              );
            })}
            {members.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-[var(--ink-3)]">No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
