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
  load_in_sent_at?: string | null;
};

type SlotState = { date: string; start: string; end: string };
type VendorState = { checked: boolean; slot: "1" | "2"; spot: "wall" | "middle" };

function fmt12(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function fmtDate(iso: string) {
  if (!iso) return "";
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function slotLabel(s: SlotState) {
  if (!s.date || !s.start || !s.end) return "";
  return `${fmtDate(s.date)}, ${fmt12(s.start)} – ${fmt12(s.end)}`;
}

function SlotInputs({ label, value, onChange }: { label: string; value: SlotState; onChange: (v: SlotState) => void }) {
  const preview = slotLabel(value);
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest">{label}</p>
      <div>
        <label className="block text-xs text-muted mb-1">Date</label>
        <input type="date" value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })}
          className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black w-full" />
      </div>
      <div className="flex items-end gap-2">
        <div>
          <label className="block text-xs text-muted mb-1">Start</label>
          <input type="time" value={value.start} onChange={(e) => onChange({ ...value, start: e.target.value })}
            className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <span className="text-muted pb-2">–</span>
        <div>
          <label className="block text-xs text-muted mb-1">End</label>
          <input type="time" value={value.end} onChange={(e) => onChange({ ...value, end: e.target.value })}
            className="border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
      </div>
      {preview && <p className="text-xs text-muted">{preview}</p>}
    </div>
  );
}

export default function LoadInForm({ upcoming, sent }: { upcoming: Booking[]; sent: Booking[] }) {
  const [tab, setTab] = useState<"upcoming" | "sent">("upcoming");
  const [vendors, setVendors] = useState<Record<string, VendorState>>({});
  const [slot1, setSlot1] = useState<SlotState>({ date: "", start: "", end: "" });
  const [slot2, setSlot2] = useState<SlotState>({ date: "", start: "", end: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setVendors((prev) => ({
      ...prev,
      [id]: { checked: !prev[id]?.checked, slot: prev[id]?.slot ?? "1", spot: prev[id]?.spot ?? "wall" },
    }));
  }

  function set(id: string, patch: Partial<VendorState>) {
    setVendors((prev) => ({
      ...prev,
      [id]: { checked: true, slot: "1", spot: "wall", ...prev[id], ...patch },
    }));
  }

  function selectAll() {
    const allOn = upcoming.every((b) => vendors[b.id]?.checked);
    if (allOn) {
      setVendors({});
    } else {
      const next: Record<string, VendorState> = {};
      upcoming.forEach((b) => {
        next[b.id] = { checked: true, slot: vendors[b.id]?.slot ?? "1", spot: vendors[b.id]?.spot ?? "wall" };
      });
      setVendors(next);
    }
  }

  async function send() {
    const s1 = slotLabel(slot1);
    const s2 = slotLabel(slot2);
    const selected = upcoming.filter((b) => vendors[b.id]?.checked);

    if (!selected.length) { setMessage("Select at least one vendor."); return; }
    if (!s1) { setMessage("Fill in Slot 1 date and time."); return; }

    setStatus("sending");
    setMessage("");

    const payload = selected.map((b) => ({
      id:        b.id,
      email:     b.vendor_email,
      firstName: b.first_name || b.brand_name,
      brandName: b.brand_name,
      spot:      vendors[b.id]?.spot ?? "wall",
    }));

    const res = await fetch("/api/admin/send-load-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendors: payload, slot1Time: s1, slot2Time: s2 }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("done");
      setMessage(`✓ Sent to ${data.sent} vendor${data.sent === 1 ? "" : "s"}.`);
      setSentIds((prev) => new Set([...prev, ...selected.map((b) => b.id)]));
      setVendors({});
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  const visibleUpcoming = upcoming.filter((b) => !sentIds.has(b.id));
  const checkedCount = visibleUpcoming.filter((b) => vendors[b.id]?.checked).length;
  const slot2Label = slotLabel(slot2);

  return (
    <div className="space-y-10">
      {/* Tabs */}
      <div className="inline-flex border border-black overflow-hidden text-xs uppercase tracking-widest">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-5 py-2 transition-colors ${tab === "upcoming" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"}`}
        >
          Upcoming {visibleUpcoming.length > 0 && `(${visibleUpcoming.length})`}
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`px-5 py-2 border-l border-black transition-colors ${tab === "sent" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"}`}
        >
          Sent {(sent.length + sentIds.size) > 0 && `(${sent.length + sentIds.size})`}
        </button>
      </div>

      {tab === "upcoming" ? (
        <>
          {/* Time slots */}
          <div className="bg-white border border-border rounded-sm p-6">
            <p className="text-xs uppercase tracking-widest text-muted mb-6">Load-In Time Slots</p>
            <div className="grid sm:grid-cols-2 gap-8">
              <SlotInputs label="Slot 1" value={slot1} onChange={setSlot1} />
              <SlotInputs label="Slot 2" value={slot2} onChange={setSlot2} />
            </div>
          </div>

          {/* Vendor list */}
          <div className="bg-white border border-border rounded-sm overflow-hidden">
            <div className="grid items-center gap-4 px-5 py-3 border-b border-border bg-neutral-50 grid-cols-[auto_1fr_auto]">
              <input type="checkbox" className="w-4 h-4 accent-black opacity-0 pointer-events-none" />
              <button onClick={selectAll} className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors text-left">
                {visibleUpcoming.every((b) => vendors[b.id]?.checked) ? "Deselect All" : "Select All"}
              </button>
              <p className="text-xs uppercase tracking-widest text-muted w-32 text-center">Spot Type</p>
            </div>

            {visibleUpcoming.length === 0 && (
              <p className="px-5 py-10 text-sm text-muted text-center">No upcoming vendors to send.</p>
            )}

            {visibleUpcoming.map((b) => {
              const v = vendors[b.id];
              const isChecked = !!v?.checked;
              const slot = v?.slot ?? "1";
              const spot = v?.spot ?? "wall";
              return (
                <div key={b.id} className={`grid items-center gap-4 px-5 py-4 border-b border-border last:border-0 transition-colors grid-cols-[auto_1fr_auto] ${isChecked ? "bg-stone-50" : ""}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggle(b.id)} className="w-4 h-4 accent-black flex-shrink-0" />
                  <div className="min-w-0 cursor-pointer" onClick={() => toggle(b.id)}>
                    <p className={`font-medium text-sm ${!isChecked ? "text-muted" : ""}`}>{b.brand_name}</p>
                    <p className="text-xs text-muted">{b.vendor_email} · {b.booking_type} · {b.start_date} → {b.end_date}</p>
                  </div>
                  <div className={`flex border border-border text-xs uppercase tracking-widest overflow-hidden w-32 ${!isChecked ? "opacity-30 pointer-events-none" : ""}`}>
                    <button onClick={() => set(b.id, { spot: "wall" })} className={`flex-1 py-1.5 transition-colors ${spot === "wall" ? "bg-black text-white" : "hover:bg-neutral-50"}`}>7×5</button>
                    <button onClick={() => set(b.id, { spot: "middle" })} className={`flex-1 py-1.5 border-l border-border transition-colors ${spot === "middle" ? "bg-black text-white" : "hover:bg-neutral-50"}`}>9×4</button>
                  </div>
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
        </>
      ) : (
        /* Sent tab */
        <div className="bg-white border border-border rounded-sm overflow-hidden">
          {(sent.length + sentIds.size) === 0 ? (
            <p className="px-5 py-10 text-sm text-muted text-center">No load-in emails sent yet.</p>
          ) : (
            <>
              {/* Optimistically added this session */}
              {upcoming.filter((b) => sentIds.has(b.id)).map((b) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{b.brand_name}</p>
                    <p className="text-xs text-muted">{b.vendor_email} · {b.booking_type} · {b.start_date} → {b.end_date}</p>
                  </div>
                  <span className="text-xs text-green-700 uppercase tracking-widest">✓ Just sent</span>
                </div>
              ))}
              {/* Previously sent (from DB) */}
              {sent.map((b) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{b.brand_name}</p>
                    <p className="text-xs text-muted">{b.vendor_email} · {b.booking_type} · {b.start_date} → {b.end_date}</p>
                  </div>
                  <span className="text-xs text-muted">
                    Sent {b.load_in_sent_at ? new Date(b.load_in_sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
