import type { CSSProperties } from "react";

// Small festive illustrations used as floating decorations. All are
// decorative only: hidden from screen readers and never clickable.

type Kind = "bauble" | "star" | "snowflake" | "candyCane" | "gift" | "holly" | "tree";

const RED = "var(--cranberry)";
const GOLD = "var(--gold)";
const GREEN = "#2f6b48";

function Art({ kind, color }: { kind: Kind; color?: string }) {
  switch (kind) {
    case "bauble":
      return (
        <svg viewBox="0 0 40 48" className="h-full w-full">
          <rect x="16" y="2" width="8" height="7" rx="1.5" fill={GOLD} />
          <circle cx="20" cy="28" r="18" fill={color ?? RED} />
          <path d="M4 26c10 4 22 4 32 0" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.8" />
          <ellipse cx="13" cy="20" rx="4" ry="6" fill="white" opacity="0.28" transform="rotate(30 13 20)" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <path
            d="M20 2l5.3 11.6 12.7 1.4-9.5 8.6 2.7 12.5L20 29.8 8.8 36.1l2.7-12.5L2 15l12.7-1.4z"
            fill={color ?? GOLD}
          />
        </svg>
      );
    case "snowflake":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full" stroke={color ?? "white"} strokeWidth="2" strokeLinecap="round" fill="none">
          {[0, 60, 120].map((r) => (
            <g key={r} transform={`rotate(${r} 20 20)`}>
              <path d="M20 3v34" />
              <path d="M20 9l-4-4M20 9l4-4M20 31l-4 4M20 31l4 4" />
            </g>
          ))}
        </svg>
      );
    case "candyCane":
      return (
        <svg viewBox="0 0 30 50" className="h-full w-full" fill="none" strokeLinecap="round">
          <path d="M20 47V16a7 7 0 0 0-14 0" stroke="white" strokeWidth="7" />
          <path d="M20 47V16a7 7 0 0 0-14 0" stroke={RED} strokeWidth="7" strokeDasharray="4 5" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 40 42" className="h-full w-full">
          <rect x="4" y="14" width="32" height="26" rx="2" fill={color ?? RED} />
          <rect x="2" y="10" width="36" height="8" rx="2" fill={color ?? RED} />
          <rect x="17" y="10" width="6" height="30" fill={GOLD} />
          <path d="M20 10c-4-8-12-8-11-3s11 3 11 3zM20 10c4-8 12-8 11-3s-11 3-11 3z" fill={GOLD} />
        </svg>
      );
    case "holly":
      return (
        <svg viewBox="0 0 48 34" className="h-full w-full">
          <path d="M24 18C18 8 8 4 2 8c4 2 3 6 7 7-3 3 0 6 4 5 1 4 6 3 11-2z" fill={color ?? GREEN} />
          <path d="M24 18c6-10 16-14 22-10-4 2-3 6-7 7 3 3 0 6-4 5-1 4-6 3-11-2z" fill={color ?? GREEN} />
          <circle cx="21" cy="20" r="4" fill={RED} />
          <circle cx="28" cy="20" r="4" fill={RED} />
          <circle cx="24.5" cy="25.5" r="4" fill={RED} />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 40 50" className="h-full w-full">
          <path d="M20 6L6 26h7L4 40h32l-9-14h7z" fill={color ?? GREEN} />
          <rect x="17" y="40" width="6" height="7" fill="#7a5532" />
          <path d="M20 0l1.8 3.8 4.2.5-3.1 2.8.9 4.1L20 9.1l-3.8 2.1.9-4.1-3.1-2.8 4.2-.5z" fill={GOLD} />
          <circle cx="15" cy="30" r="1.8" fill={RED} />
          <circle cx="25" cy="23" r="1.8" fill={GOLD} />
          <circle cx="23" cy="35" r="1.8" fill={RED} />
        </svg>
      );
  }
}

export type DecorItem = {
  kind: Kind;
  /** Tailwind classes for position and size, e.g. "top-10 left-[6%] w-10 h-10" */
  className: string;
  color?: string;
  tilt?: number;
  delay?: number;
  duration?: number;
  opacity?: number;
};

/** Ornaments that bob gently in place. Parent must be `relative`. */
export function FloatingDecor({ items }: { items: DecorItem[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {items.map((it, i) => (
        <div
          key={i}
          className={`decor-float absolute ${it.className}`}
          style={
            {
              "--tilt": `${it.tilt ?? 0}deg`,
              "--delay": `${it.delay ?? 0}s`,
              "--dur": `${it.duration ?? 7}s`,
              opacity: it.opacity ?? 1,
            } as CSSProperties
          }
        >
          <Art kind={it.kind} color={it.color} />
        </div>
      ))}
    </div>
  );
}

/** Baubles hanging from the top edge on thin gold threads, swaying slightly. */
export function HangingOrnaments({
  ornaments,
  className = "",
}: {
  ornaments: { left: string; length: number; size: number; kind?: Kind; color?: string; delay?: number }[];
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 z-[3] ${className}`}>
      {ornaments.map((o, i) => (
        <div
          key={i}
          className="decor-sway absolute top-0 flex flex-col items-center"
          style={{ left: o.left, "--delay": `${o.delay ?? 0}s`, "--dur": `${5 + i}s` } as CSSProperties}
        >
          <span className="block w-px bg-gold/70" style={{ height: o.length }} />
          <span className="block" style={{ width: o.size, height: o.size * 1.2 }}>
            <Art kind={o.kind ?? "bauble"} color={o.color} />
          </span>
        </div>
      ))}
    </div>
  );
}

// Fixed values (not random) so server and browser render the same snow.
const FLAKES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 2 + ((i * 7) % 4),
  delay: -((i * 1.7) % 14),
  duration: 10 + ((i * 3) % 9),
  drift: ((i % 5) - 2) * 18,
  opacity: 0.35 + ((i * 13) % 50) / 100,
}));

/** Soft falling snow over a dark section. Parent must be `relative`. */
export function Snowfall({ density = 1 }: { density?: number }) {
  const flakes = FLAKES.slice(0, Math.round(FLAKES.length * density));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className={`snowflake ${i % 2 ? "hidden sm:block" : ""}`}
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              "--delay": `${f.delay}s`,
              "--dur": `${f.duration}s`,
              "--drift": `${f.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
