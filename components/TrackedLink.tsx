"use client";
import { track } from "@/lib/track";

// A plain <a> that fires a GA4 event on click (e.g. member PDF downloads,
// whose /api/... URLs GA's automatic file-download tracking can't see).
export default function TrackedLink({
  href,
  event,
  params,
  className,
  style,
  download,
  children,
}: {
  href: string;
  event: string;
  params?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
  /** Sets the <a download> attribute (save instead of open). */
  download?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} style={style} download={download || undefined} onClick={() => track(event, params)}>
      {children}
    </a>
  );
}
