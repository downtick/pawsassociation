// Fire a GA4 event from client code. No-op when the tag isn't loaded
// (dev, previews, ad blockers) — tracking must never break a form.
type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    (window as GtagWindow).gtag?.("event", event, params);
  } catch {
    /* ignore */
  }
}
