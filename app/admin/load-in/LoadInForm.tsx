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
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function slotLabel(date: string, start: string, end: string) {
  if (!date || !start || !end) return "";
  return `${fmtDate(date)}, ${fmt12(start)} – ${fmt12(end)}`;
}

type SlotState = { date: string; start: string; end: string };

export default function LoadInForm({ bookings }: { bookings: Booking[] }) {
  const [selected, setSelected] = useState<Record<string, { checked: boolean; slot: "1" | "2" }>>({});
  const [slot1, setSlot1] = useState<SlotState>({ date: "", start: "", end: "" });
  const [slot2, setSlot2] = useState<SlotState>({ date: "", start: "", end: "" });
  const [status,  setStatus]  = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggle(id: string) {
    setSelected((prev) => ({
      ...prev,
      [id]: { checked: !prev[id]?.checked, slot: prev[id]?.slot ?? "1" },
    }));
  }

  function assignSlot(id: string, slot: "1" | "2") {
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
    const slot1Label = slotLabel(slot1.date, slot1.start, slot1.end);
    const slot2Label = slotLabel(slot2.date, slot2.start, slot2.end);

    const vendors = bookings
      .filter((b) => selected[b.id]?.checked)
      .map((b) => ({
        email: b.vendor_email,
        firstName: b.first_name || b.brand_name,
        brandName: b.brand_name,
        slot: selected[b.id]?.slot ?? "1",
      }));

    if (!vendors.length) { setMessage("Select at least one vendor."); return; }
    if (!slot1Label)     { setMessage("Fill in Slot 1 date and time."); return; }
    if (!slot2Label)     { setMessage("Fill in Slot 2 date and time."); return; }

    setStatus("sending");
    setMessage("");

    const res = await fetch("/api/admin/send-load-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendors, slot1Time: slot1Label, slot2Time: slot2Label }),
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

  function SlotInputs({ label, value, onChange }: { label: string; value: SlotState; onChange: (v: SlotState) => void }) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest">{label}</p>
        <div>
          <label className="block text-xs text-muted mb-1">Date</label>
          <input
            type="date"
            value={value.date}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
            className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black w-full"
          />
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-xs text-muted mb-1">Start</label>
            <input
              type="time"
              value={value.start}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <span className="text-muted pb-2">–</span>
          <div>
            <label className="block text-xs text-muted mb-1">End</label>
            <input
              type="time"
              value={value.end}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
        {slotLabel(value.date, value.start, value.end) && (
          <p className="text-xs text-muted">{slotLabel(value.date, value.start, value.end)}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Slots */}
      <div className="bg-white border border-border rounded-sm p-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-6">Load-In Time Slots</p>
        <div className="grid sm:grid-cols-2 gap-8">
          <SlotInputs label="Slot 1" value={slot1} onChange={setSlot1} />
          <SlotInputs label="Slot 2" value={slot2} onChange={setSlot2} />
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
                    onClick={() => assignSlot(b.id, "1")}
                    className={`px-3 py-1.5 transition-colors ${slot === "1" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"}`}
                  >
                    Slot 1
                  </button>
                  <button
                    onClick={() => assignSlot(b.id, "2")}
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
