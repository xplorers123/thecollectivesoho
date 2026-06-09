import { supabaseAdmin } from "@/lib/supabase-admin";
import { getWeeklySlots, AVAILABLE_BOOTHS } from "@/lib/booking-utils";
import Link from "next/link";
import BookingFlow from "@/components/BookingFlow";

export const metadata = { title: "Weekly Booking — The Collective SoHo" };

export default async function WeeklyBooking({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  const startDay = start === "monday" ? "monday" : "saturday";
  const slots = getWeeklySlots(startDay);

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
        <p className="mt-2 text-sm text-muted">7 days · Select a start day and date to continue.</p>

        {/* Start day toggle */}
        <div className="mt-5 inline-flex border border-black overflow-hidden text-xs uppercase tracking-widest">
          <Link
            href="/dashboard/book/weekly"
            className={`px-5 py-2 transition-colors ${startDay === "saturday" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"}`}
          >
            Sat start
          </Link>
          <Link
            href="/dashboard/book/weekly?start=monday"
            className={`px-5 py-2 border-l border-black transition-colors ${startDay === "monday" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"}`}
          >
            Mon start
          </Link>
        </div>

        <p className="mt-3 text-xs text-muted">
          {startDay === "saturday" ? "Saturday – Friday" : "Monday – Sunday"}
        </p>
      </div>
      <BookingFlow slots={slotsWithAvailability} type="weekly" />
    </div>
  );
}
