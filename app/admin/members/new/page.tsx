import NewMemberForm from "@/components/admin/NewMemberForm";
import { requireAdmin } from "@/lib/access";

export default async function NewMemberPage() {
  await requireAdmin();

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl mb-2">Add a Member</h1>
      <p className="text-[var(--ink-3)] mb-8">
        Hand-create a comp or manually-managed member and send the welcome email.
      </p>
      <NewMemberForm />
    </div>
  );
}
