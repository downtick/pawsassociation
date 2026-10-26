import { createHmac, timingSafeEqual } from "node:crypto";

// Signed, non-guessable unsubscribe links: /unsubscribe?u=<profile id>&t=<sig>.
// Signing means nobody can unsubscribe someone else by editing the id.
// EMAIL_LINK_SECRET is a random string in Vercel; rotating it invalidates
// old links (they then just ask the member to log in).
function key(): string {
  const k = process.env.EMAIL_LINK_SECRET;
  if (!k) throw new Error("EMAIL_LINK_SECRET is not set");
  return k;
}

export function unsubscribeToken(profileId: string): string {
  return createHmac("sha256", key()).update(`unsub:${profileId}`).digest("base64url");
}

export function verifyUnsubscribeToken(profileId: string, token: string): boolean {
  try {
    const a = Buffer.from(unsubscribeToken(profileId));
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
