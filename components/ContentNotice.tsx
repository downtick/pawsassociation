// Short inline notice (§B of _reference/disclaimer-content-blog.md) — top of
// every article/content page, above the body. Verbatim text.
export default function ContentNotice() {
  return (
    <p
      className="mb-6 rounded-lg px-4 py-3 text-[13px]"
      style={{ background: "var(--ground-3)", border: "1px solid var(--rule)", color: "var(--ink-3)" }}
    >
      This article is for general informational purposes only and does not
      constitute insurance, legal, financial, or professional advice. Coverage
      terms vary by carrier, policy, and jurisdiction. Consult a licensed
      insurance professional for advice specific to your situation.
    </p>
  );
}
