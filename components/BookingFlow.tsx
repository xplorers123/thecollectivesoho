"use client";

import { useRouter } from "next/navigation";

type Slot = {
  id: string;
  label: string;
  remaining: number;
  type: string;
  badge?: string;
  note?: string;
};

export default function BookingFlow({ slots, type }: { slots: Slot[]; type: string }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {slots.map((s) => {
        const soldOut = s.remaining <= 0;
        return (
          <button
            key={s.id}
            disabled={soldOut}
            onClick={() => router.push(`/dashboard/book/${type}/${s.id}`)}
            className={`w-full flex items-center justify-between border p-5 text-left transition-colors ${
              soldOut
                ? "border-border bg-neutral-50 opacity-50 cursor-not-allowed"
                : "border-border bg-white hover:border-black hover:bg-neutral-50"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{s.label}</p>
                {s.badge && (
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest bg-black text-white">
                    {s.badge}
                  </span>
                )}
              </div>
              {s.note && <p className="mt-0.5 text-xs text-muted">{s.note}</p>}
              <p className="mt-1 text-xs text-muted">
                {soldOut
                  ? "Sold out"
                  : s.remaining <= 2
                  ? `${s.remaining} spot${s.remaining === 1 ? "" : "s"} remaining`
                  : "Available"}
              </p>
            </div>
            {!soldOut && (
              <span className="text-xs uppercase tracking-widest text-muted">Select →</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
