import { DIRECTORY } from "@/lib/directory";

// "Who PAWS is for" — every attraction type in the directory, as chips. Shown
// on /join and /get-listed so an operator arriving from an email or a call
// sees their own kind of business named right away.
export default function BusinessTypes({ className = "" }: { className?: string }) {
  return (
    <div className={`panel ${className}`} style={{ maxWidth: "none" }}>
      <h2 className="text-xl">Built for animal-attraction businesses</h2>
      <p className="text-sm" style={{ color: "var(--ink-2)" }}>
        PAWS is a trade association made for the people who bring animals to events:
        a public directory where planners and families find you, plus marketing
        training, printable business tools, and partner discounts. If you run one of
        these, it&apos;s for you:
      </p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Business types in the PAWS directory">
        {DIRECTORY.categories.map((c) => (
          <li key={c.slug} className="typechip">{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
