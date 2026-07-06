"use client";

import { useState } from "react";

export type SlotRow = {
  type: "weekend" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  label: string;
  realCount: number;
  maxSpots: number;
  adminSoldOut: boolean;
};

function SlotCard({ slot: initial }: { slot: SlotRow }) {
  const [slot, setSlot] = useState(initial);
  const [loading, setLoading] = useState(false);

  const remaining = slot.adminSoldOut ? 0 : Math.max(0, slot.maxSpots - slot.realCount);
  const isSoldOut = slot.adminSoldOut || remaining === 0;

  async function toggle() {
    setLoading(true);
    const newSoldOut = !slot.adminSoldOut;
    await fetch("/api/admin/toggle-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: slot.type,
        startDate: slot.startDate,
        endDate: slot.endDate,
        soldOut: newSoldOut,
      }),
    });
    setSlot((s) => ({ ...s, adminSoldOut: newSoldOut }));
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: isSoldOut ? "#ef4444" : remaining <= 2 ? "#f59e0b" : "#22c55e" }} />
        <div>
          <p className="text-sm font-medium">{slot.label}</p>
          <p className="text-xs text-muted mt-0.5">
            {slot.realCount} booked · {isSoldOut ? "Sold out" : `${remaining} of ${slot.maxSpots} remaining`}
            {slot.adminSoldOut && <span className="ml-2 text-red-500">· Admin override</span>}
          </p>
        </div>
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`shrink-0 ml-4 px-4 py-1.5 text-xs uppercase tracking-widest border transition-colors disabled:opacity-40 ${
          slot.adminSoldOut
            ? "border-black bg-black text-white hover:bg-neutral-800"
            : "border-black text-black hover:bg-black hover:text-white"
        }`}
      >
        {loading ? "…" : slot.adminSoldOut ? "Mark Available" : "Mark Sold Out"}
      </button>
    </div>
  );
}

export default function AvailabilityGrid({ slots }: { slots: SlotRow[] }) {
  const weekends = slots.filter((s) => s.type === "weekend");
  const weekly = slots.filter((s) => s.type === "weekly");
  const monthly = slots.filter((s) => s.type === "monthly");

  const sections = [
    { label: "Weekend", slots: weekends },
    { label: "Weekly", slots: weekly },
    { label: "Monthly", slots: monthly },
  ];

  return (
    <div className="space-y-10">
      {sections.map(({ label, slots }) => (
        <div key={label}>
          <p className="text-xs uppercase tracking-widest text-muted mb-3">{label}</p>
          <div className="border border-border bg-white px-5">
            {slots.length === 0 ? (
              <p className="py-4 text-sm text-muted">No upcoming slots.</p>
            ) : (
              slots.map((s) => <SlotCard key={`${s.type}-${s.startDate}`} slot={s} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
