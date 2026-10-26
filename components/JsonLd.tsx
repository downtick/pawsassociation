// Structured data (schema.org JSON-LD) for search engines.
//
// JSON.stringify alone is NOT safe inside <script>: a string containing
// "</script>" ends the tag early and whatever follows runs as HTML/JS.
// Member-written text (bio, notes, business name) reaches this tag on public
// profile pages, so <, >, & and the U+2028/2029 line separators are escaped
// to their \u forms. JSON parsers read them back identically.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />;
}
