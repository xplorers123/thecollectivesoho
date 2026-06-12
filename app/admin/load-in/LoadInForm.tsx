"use client";

import { useState } from "react";

type Booking = {
  id: string;
  brand_name: string;
  vendor_email: string;
  first_name: string;
  booking_type: string;
  start_date: string;
  end_date: string;
};

export default function LoadInForm({ bookings }: { bookings: Booking[] }) {
  const [selected, setSelected] = useState<Record<string, { checked: boolean; slot: "1" | "2" }>>({});
  const [loadInDate, setLoadInDate] = useState("");
  const [slot1Time, setSlot1Time] = useState("");
  const [slot2Time, setSlot2Time] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggle(id: string) {
    setSelected((prev) => ({
      ...prev,
      [id]: { checked: !prev[id]?.checked, slot: prev[id]?.slot ?? "1" },
    }));
  }

  function setSlot(id: string, slot: "1" | "2") {
    setSelected((prev) => ({
      ...prev,
      [id]: { checked: prev[id]?.checked ?? true, slot },
    }));
  }

  function selectAll() {
    const allChecked = bookings.every((b) => selected[b.id]?.checked);
    if (allChecked) {
      setSelected({});
    } else {
      const next: typeof selected = {};
      bookings.forEach((b) => { next[b.id] = { checked: true, slot: selected[b.id]?.slot ?? "1" }; });
      setSelected(next);
    }
  }

  async function send() {
    const vendors = bookings
      .filter((b) => selected[b.id]?.checked)
      .map((b) => ({
        email: b.vendor_email,
        firstName: b.first_name || b.brand_name,
        brandName: b.brand_name,
        slot: selected[b.id]?.slot ?? "1",
      }));

    if (!vendors.length) { setMessage("Select at least one vendor."); return; }
    if (!loadInDate)      { setMessage("Enter the load-in date."); return; }
    if (!slot1Time)       { setMessage("Enter Slot 1 time."); return; }
    if (!slot2Time)       { setMessage("Enter Slot 2 time."); return; }

    setStatus("sending");
    setMessage("");

    const res = await fetch("/api/admin/send-load-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendors, loadInDate, slot1Time, slot2Time }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("done");
      setMessage(`✓ Sent to ${data.sent} vendor${data.sent === 1 ? "" : "s"}.`);
      setSelected({});
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  const checkedCount = Object.values(selected).filter((v) => v.checked).length;

  return (
    <div className="space-y-10">
      {/* Time slots */}
      <div className="bg-white border border-border rounded-sm p-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-5">Load-In Details</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-muted mb-1.5">Date (e.g. Saturday, June 13, 2026)</label>
            <input
              type="text"
              placeholder="Saturday, June 13, 2026"
              value={loadInDate}
              onChange={(e) => setLoadInDate(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Slot 1 time</label>
            <input
              type="text"
              placeholder="9:00 AM – 10:00 AM"
              value={slot1Time}
              onChange={(e) => setSlot1Time(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Slot 2 time</label>
            <input
              type="text"
              placeholder="10:00 AM – 11:00 AM"
              value={slot2Time}
              onChange={(e) => setSlot2Time(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Vendor list */}
      <div className="bg-white border border-border rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-neutral-50">
          <p className="text-xs uppercase tracking-widest text-muted">Select Vendors</p>
          <button onClick={selectAll} className="text-xs uppercase tracking-widest hover:text-black text-muted transition-colors">
            {bookings.every((b) => selected[b.id]?.checked) ? "Deselect All" : "Select All"}
          </button>
        </div>

        {bookings.length === 0 && (
          <p className="px-5 py-10 text-sm text-muted text-center">No upcoming bookings found.</p>
        )}

        {bookings.map((b) => {
          const isChecked = !!selected[b.id]?.checked;
          const slot = selected[b.id]?.slot ?? "1";
          return (
            <div key={b.id} className={`flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 transition-colors ${isChecked ? "bg-stone-50" : ""}`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(b.id)}
                className="w-4 h-4 accent-black flex-shrink-0"
              />
              <div className="flex-1 min-w-0" onClick={() => toggle(b.id)} role="button">
                <p className="font-medium text-sm">{b.brand_name}</p>
                <p className="text-xs text-muted">{b.vendor_email} · {b.booking_type} · {b.start_date} → {b.end_date}</p>
              </div>

              {/* Slot toggle — only shown when checked */}
              {isChecked && (
                <div className="flex items-center border border-border text-xs uppercase tracking-widest overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => setSlot(b.id, "1")}
                    className={`px-3 py-1.5 transition-colors ${slot === "1" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"}`}
                  >
                    Slot 1
                  </button>
                  <button
                    onClick={() => setSlot(b.id, "2")}
                    className={`px-3 py-1.5 border-l border-border transition-colors ${slot === "2" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"}`}
                  >
                    Slot 2
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Send */}
      <div className="flex items-center gap-5">
        <button
          onClick={send}
          disabled={status === "sending" || checkedCount === 0}
          className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-neutral-800 transition-colors"
        >
          {status === "sending" ? "Sending…" : `Send to ${checkedCount || "—"} Vendor${checkedCount === 1 ? "" : "s"}`}
        </button>
        {message && (
          <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
