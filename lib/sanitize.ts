// Cleaning for free text that members write and the public reads (listing
// bio, additional-services notes).
//
// Defence in depth — React already escapes text when rendering, so markup
// in these fields can't execute on the page. These rules keep stored text
// clean everywhere else it travels (JSON-LD, emails, CSV exports, admin
// screens) and keep the directory free of spam links:
//   - HTML tags are removed (stored text is always plain text)
//   - control characters are removed (newlines and tabs kept)
//   - line endings normalized; runs of blank lines collapsed
export function cleanText(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "")
    .replace(/[<>]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Web addresses and email addresses. Notes must not carry them: the listing
// has a Website field (shown only for paid, claimed listings), and links in
// free text are how directories get filled with spam and phishing.
const LINKISH = /(https?:\/\/|www\.)\S+|\b[\w.+-]+@[\w-]+\.[\w.]+\b|\b[a-z0-9-]+\.(com|net|org|io|co|us|biz|info|app|site|online|shop|xyz)\b/i;

export function containsLink(text: string): boolean {
  return LINKISH.test(text);
}
