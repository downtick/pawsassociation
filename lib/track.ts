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

// Fire an event, then navigate. A bare track() followed by
// window.location.href loses the hit (the page unloads before gtag sends),
// which is why begin_checkout never showed in GA4. Beacon transport survives
// the unload; event_callback navigates as soon as the hit is out, with a
// timeout fallback so a blocked or missing tag never strands the visitor.
export function trackThenGo(event: string, params: Record<string, unknown>, url: string, timeoutMs = 800) {
  if (typeof window === "undefined") return;
  let gone = false;
  const go = () => {
    if (gone) return;
    gone = true;
    window.location.href = url;
  };
  const gtag = (window as GtagWindow).gtag;
  if (!gtag) return go();
  try {
    gtag("event", event, { ...params, transport_type: "beacon", event_callback: go, event_timeout: timeoutMs });
  } catch {
    return go();
  }
  setTimeout(go, timeoutMs + 100);
}
