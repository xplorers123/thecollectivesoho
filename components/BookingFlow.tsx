"use client";

import { useRouter } from "next/navigation";

type Slot = {
  id: string;
  label: string;
  remaining: number;
  type: string;
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
              <p className="text-sm font-medium">{s.label}</p>
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
