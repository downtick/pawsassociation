// A plain form POST to /auth/signout — no client JS needed, so it works in
// the header, the admin bar and the member dashboard alike.
export default function LogoutButton({ className = "btn btn-ghost", label = "Log out" }: { className?: string; label?: string }) {
  return (
    <form action="/auth/signout" method="post" className="contents">
      <button type="submit" className={className}>{label}</button>
    </form>
  );
}
