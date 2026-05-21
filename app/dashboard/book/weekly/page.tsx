import { supabaseAdmin } from "@/lib/supabase-admin";
import { getWeeklySlots, AVAILABLE_BOOTHS } from "@/lib/booking-utils";
import Link from "next/link";
import BookingFlow from "@/components/BookingFlow";

export const metadata = { title: "Weekly Booking — The Collective SoHo" };

export default async function WeeklyBooking() {
  const slots = getWeeklySlots();

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("start_date")
    .eq("booking_type", "weekly")
    .eq("status", "confirmed");

  const slotsWithAvailability = slots.map((slot) => ({
    ...slot,
    remaining: AVAILABLE_BOOTHS - (bookings ?? []).filter((b) => b.start_date === slot.startDate).length,
  }));

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <Link href="/dashboard/book" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">
          ← Booking Options
        </Link>
        <h1 className="mt-6 text-3xl font-medium">Weekly</h1>
        <p className="mt-2 text-sm text-muted">Saturday – Friday · 7 days · Select a date to continue.</p>
      </div>
      <BookingFlow slots={slotsWithAvailability} type="weekly" />
    </div>
  );
}
