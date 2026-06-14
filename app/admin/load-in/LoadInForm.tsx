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

function fmt12(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function fmtDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function LoadInForm({ bookings }: { bookings: Booking[] }) {
  const [selected, setSelected] = useState<Record<string, { checked: boolean; slot: "1" | "2" }>>({});
  const [loadInDate, setLoadInDate] = useState("");
  const [slot1Start, setSlot1Start] = useState("");
  const [slot1End,   setSlot1End]   = useState("");
  const [slot2Start, setSlot2Start] = useState("");
  const [slot2End,   setSlot2End]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "sending" | "done" | "error">("idle");
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
    const slot1Time = slot1Start && slot1End ? `${fmt12(slot1Start)} – ${fmt12(slot1End)}` : "";
    const slot2Time = slot2Start && slot2End ? `${fmt12(slot2Start)} – ${fmt12(slot2End)}` : "";

    const vendors = bookings
      .filter((b) => selected[b.id]?.checked)
      .map((b) => ({
        email: b.vendor_email,
        firstName: b.first_name || b.brand_name,
        brandName: b.brand_name,
        slot: selected[b.id]?.slot ?? "1",
      }));

    if (!vendors.length)  { setMessage("Select at least one vendor."); return; }
    if (!loadInDate)      { setMessage("Pick a load-in date."); return; }
    if (!slot1Time)       { setMessage("Enter Slot 1 start and end time."); return; }
    if (!slot2Time)       { setMessage("Enter Slot 2 start and end time."); return; }

    setStatus("sending");
    setMessage("");

    const res = await fetch("/api/admin/send-load-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendors, loadInDate: fmtDate(loadInDate), slot1Time, slot2Time }),
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
      {/* Load-in details */}
      <div className="bg-white border border-border rounded-sm p-6 space-y-5">
        <p className="text-xs uppercase tracking-widest text-muted">Load-In Details</p>

        {/* Date */}
        <div>
          <label className="block text-xs text-muted mb-1.5">Load-In Date</label>
          <input
            type="date"
            value={loadInDate}
            onChange={(e) => setLoadInDate(e.target.value)}
            className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
          {loadInDate && (
            <p className="text-xs text-muted mt-1">{fmtDate(loadInDate)}</p>
          )}
        </div>

        {/* Time slots */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest">Slot 1</p>
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-xs text-muted mb-1">Start</label>
                <input type="time" value={slot1Start} onChange={(e) => setSlot1Start(e.target.value)}
                  className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
              </div>
              <span className="text-muted mt-5">–</span>
              <div>
                <label className="block text-xs text-muted mb-1">End</label>
                <input type="time" value={slot1End} onChange={(e) => setSlot1End(e.target.value)}
                  className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
              </div>
            </div>
            {slot1Start && slot1End && (
              <p className="text-xs text-muted">{fmt12(slot1Start)} – {fmt12(slot1End)}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest">Slot 2</p>
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-xs text-muted mb-1">Start</label>
                <input type="time" value={slot2Start} onChange={(e) => setSlot2Start(e.target.value)}
                  className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
              </div>
              <span className="text-muted mt-5">–</span>
              <div>
                <label className="block text-xs text-muted mb-1">End</label>
                <input type="time" value={slot2End} onChange={(e) => setSlot2End(e.target.value)}
                  className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
              </div>
            </div>
            {slot2Start && slot2End && (
              <p className="text-xs text-muted">{fmt12(slot2Start)} – {fmt12(slot2End)}</p>
            )}
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
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggle(b.id)}>
                <p className="font-medium text-sm">{b.brand_name}</p>
                <p className="text-xs text-muted">{b.vendor_email} · {b.booking_type} · {b.start_date} → {b.end_date}</p>
              </div>

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
