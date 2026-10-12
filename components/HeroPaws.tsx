// Decorative paw prints drifting up through the hero. Pure CSS animation
// (.paw in globals.css); hidden from screen readers and disabled under
// reduce-motion.
const PAWS: { left: string; top: string; size: number; r: number; t: number; d: number; o: number }[] = [
  { left: "6%", top: "70%", size: 34, r: -20, t: 13, d: 0, o: 0.16 },
  { left: "16%", top: "35%", size: 22, r: 15, t: 11, d: 3, o: 0.12 },
  { left: "29%", top: "82%", size: 28, r: -8, t: 14, d: 6, o: 0.14 },
  { left: "71%", top: "78%", size: 30, r: 22, t: 12, d: 1.5, o: 0.16 },
  { left: "83%", top: "40%", size: 24, r: -14, t: 15, d: 4.5, o: 0.12 },
  { left: "92%", top: "75%", size: 36, r: 10, t: 13, d: 8, o: 0.15 },
  { left: "52%", top: "92%", size: 20, r: -25, t: 16, d: 9.5, o: 0.1 },
];

export default function HeroPaws() {
  return (
    <div aria-hidden="true">
      <span className="hero-blob a" />
      <span className="hero-blob b" />
      {PAWS.map((p, i) => (
        <svg
          key={i}
          className="paw"
          width={p.size}
          height={p.size}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ left: p.left, top: p.top, "--r": `${p.r}deg`, "--t": `${p.t}s`, "--d": `${p.d}s`, "--o": p.o } as React.CSSProperties}
        >
          <ellipse cx="12" cy="16.5" rx="5.2" ry="4.6" />
          <ellipse cx="5.2" cy="10.5" rx="2.1" ry="2.7" />
          <ellipse cx="9.3" cy="6.2" rx="2.1" ry="2.8" />
          <ellipse cx="14.7" cy="6.2" rx="2.1" ry="2.8" />
          <ellipse cx="18.8" cy="10.5" rx="2.1" ry="2.7" />
        </svg>
      ))}
    </div>
  );
}
