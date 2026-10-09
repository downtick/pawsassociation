import Icon from "./Icon";
import type { DownloadMeta } from "@/content/downloads";

// HTML mock of a download's first page, shown on public pages. The real PDF
// is never served publicly; this is a recognizable thumbnail with a lock.
export default function DownloadPreview({ d, locked = true }: { d: DownloadMeta; locked?: boolean }) {
  const landscape = d.kind === "sign" || d.kind === "table";
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-white"
      style={{
        aspectRatio: landscape ? "11 / 8.5" : "8.5 / 11",
        border: "1px solid var(--rule)",
        boxShadow: "var(--shadow-lg)",
      }}
      aria-hidden="true"
    >
      {d.kind === "sign" ? (
        <div className="flex h-full flex-col" style={{ border: "5px solid var(--blue)", margin: 8, height: "calc(100% - 16px)" }}>
          <div className="h-[14%]" style={{ background: "var(--blue)", borderBottom: "3px solid var(--orange)" }} />
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <p className="font-bold leading-tight" style={{ color: "var(--ink)", fontSize: "clamp(18px, 4.5vw, 34px)" }}>
              {d.headline ?? d.title}
            </p>
          </div>
          <p className="pb-2 text-center text-[9px]" style={{ color: "var(--ink-3)" }}>pawsassociation.com</p>
        </div>
      ) : d.kind === "flyer" ? (
        <div className="flex h-full flex-col">
          <div className="h-[19%] p-3" style={{ background: "var(--blue)", borderBottom: "4px solid var(--orange)" }}>
            <div className="h-3 w-24 rounded bg-white/80" />
            <div className="mt-2 h-2 w-36 rounded bg-white/50" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3 p-3">
            <div className="rounded" style={{ border: "1.5px dashed var(--rule)" }} />
            <div className="space-y-2">
              {[90, 75, 85, 60].map((w, i) => <div key={i} className="h-2 rounded" style={{ width: `${w}%`, background: "var(--ground-3)" }} />)}
            </div>
          </div>
          <div className="py-2 text-center text-[9px] font-semibold" style={{ background: "var(--blue-wash)", color: "var(--blue)" }}>
            pawsassociation.com
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: "var(--blue)", borderBottom: "3px solid var(--orange)" }}>
            <span className="text-[10px] font-bold text-white">PAWS</span>
            <span className="text-[7px] text-white/70">Member resource</span>
          </div>
          <div className="flex-1 space-y-2 p-3">
            <p className="text-[11px] font-bold leading-tight" style={{ color: "var(--ink)" }}>{d.title.split(" for ")[0]}</p>
            {d.kind === "table" ? (
              <div className="mt-2 grid grid-cols-5 gap-px" style={{ background: "var(--rule)" }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="h-3" style={{ background: i < 5 ? "var(--blue-wash)" : "#fff" }} />
                ))}
              </div>
            ) : (
              [70, 100, 55, 100, 80, 100, 65].map((w, i) => (
                <div key={i} className="h-px" style={{ width: `${w}%`, background: "var(--rule)", marginTop: 10 }} />
              ))
            )}
          </div>
          <p className="px-3 pb-2 text-[8px] font-semibold" style={{ color: "var(--blue)" }}>pawsassociation.com</p>
        </div>
      )}

      {locked && (
        <div
          className="absolute inset-x-0 bottom-0 flex h-1/2 items-end justify-center pb-4"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.95) 60%)" }}
        >
          <span className="badge"><Icon name="badge" /> Members download free</span>
        </div>
      )}
    </div>
  );
}
