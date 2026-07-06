import { supabaseAdmin } from "@/lib/supabase-admin";
import { getWeekendSlots, getWeeklySlots, getMonthlySlots, AVAILABLE_BOOTHS } from "@/lib/booking-utils";
import AvailabilityGrid, { SlotRow } from "./AvailabilityGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Availability — Admin" };

export default async function AvailabilityPage() {
  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("booking_type, start_date, vendor_clerk_id")
    .eq("status", "confirmed");

  const all = bookings ?? [];

  function buildRows(type: "weekend" | "weekly" | "monthly", slots: { startDate: string; endDate: string; label: string }[]): SlotRow[] {
    return slots.map((slot) => {
      const forSlot = all.filter((b) => b.booking_type === type && b.start_date === slot.startDate);
      const realCount = forSlot.filter((b) => b.vendor_clerk_id !== "admin_override").length;
      const adminSoldOut = forSlot.some((b) => b.vendor_clerk_id === "admin_override");
      return { type, startDate: slot.startDate, endDate: slot.endDate, label: slot.label, realCount, maxSpots: AVAILABLE_BOOTHS, adminSoldOut };
    });
  }

  const weekendSlots = buildRows("weekend", getWeekendSlots());
  const weeklySlots = buildRows("weekly", getWeeklySlots("saturday"));
  const monthlySlots = buildRows("monthly", getMonthlySlots());

  const slots: SlotRow[] = [...weekendSlots, ...weeklySlots, ...monthlySlots];

  const soldOutCount = slots.filter((s) => s.adminSoldOut || s.realCount >= s.maxSpots).length;

  return (
    <div className="px-8 py-10 max-w-3xl">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-medium">Availability</h1>
          <p className="text-sm text-muted mt-1">Manage spot availability for all booking types.</p>
        </div>
        <div className="flex gap-6 text-xs text-muted">
          <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5" />Available</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />Low (≤2)</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5" />Sold Out ({soldOutCount})</span>
        </div>
      </div>
      <AvailabilityGrid slots={slots} />
    </div>
  );
}
