import { supabaseAdmin } from "@/lib/supabase-admin";
import { getWeekendSlots, AVAILABLE_BOOTHS, SOLD_OUT_WEEKEND_STARTS } from "@/lib/booking-utils";
import Link from "next/link";
import BookingFlow from "@/components/BookingFlow";

export const metadata = { title: "Weekend Booking — The Collective SoHo" };

export default async function WeekendBooking() {
  const slots = getWeekendSlots();

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("start_date")
    .eq("booking_type", "weekend")
    .eq("status", "confirmed");

  const slotsWithAvailability = slots.map((slot) => ({
    ...slot,
    remaining: SOLD_OUT_WEEKEND_STARTS.has(slot.startDate)
      ? 0
      : AVAILABLE_BOOTHS - (bookings ?? []).filter((b) => b.start_date === slot.startDate).length,
  }));

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <Link href="/dashboard/book" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">
          ← Booking Options
        </Link>
        <h1 className="mt-6 text-3xl font-medium">Weekend</h1>
        <p className="mt-2 text-sm text-muted">Saturday – Sunday · 2 days · Select a date to continue.</p>
      </div>
      <BookingFlow slots={slotsWithAvailability} type="weekend" />
    </div>
  );
}
