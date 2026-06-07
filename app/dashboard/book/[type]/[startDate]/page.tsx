import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getWeekendSlots, getWeeklySlots, getMonthlySlots, AVAILABLE_BOOTHS } from "@/lib/booking-utils";
import { getOOSCategories } from "@/lib/inventory";
import BookingDetail from "@/components/BookingDetail";

const PHOTOS: Record<string, string> = {
  weekend: "/images/DSC_0361-scaled.jpg",
  weekly:  "/images/DSC_0381-scaled.jpg",
  monthly: "/images/DSC_0378-scaled.jpg",
};

const PRIME_PRICE: Record<string, number> = {
  weekend: 0,
  weekly:  0,
  monthly: 0,
};

const ORIGINAL_PRICE: Record<string, number> = {
  weekly: 105000,
};

function getAllSlots(type: string) {
  if (type === "weekend") return getWeekendSlots();
  if (type === "weekly")  return getWeeklySlots();
  if (type === "monthly") return getMonthlySlots();
  return [];
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ type: string; startDate: string }>;
}) {
  const { type, startDate } = await params;

  if (!["weekend", "weekly", "monthly"].includes(type)) notFound();

  const slots = getAllSlots(type);
  const slot = slots.find((s) => s.id === startDate);
  if (!slot) notFound();

  // Check availability
  const { count } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("booking_type", type)
    .eq("start_date", startDate)
    .eq("status", "confirmed");

  const remaining = AVAILABLE_BOOTHS - (count ?? 0);
  if (remaining <= 0) notFound();

  const photo = PHOTOS[type];
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const oosCategories = getOOSCategories(type, startDate);

  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="px-8 pt-8 pb-4">
        <Link
          href={`/dashboard/book/${type}`}
          className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
        >
          ← {typeLabel} Dates
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="md:grid md:grid-cols-2">
        {/* Photo */}
        <div className="relative aspect-[4/3] md:aspect-[4/5]">
          <Image
            src={photo}
            alt={typeLabel}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        {/* Booking form */}
        <div className="px-8 py-10 overflow-y-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">{typeLabel} Booking</p>
          <h1 className="text-3xl font-medium mb-1">{slot.label.toUpperCase()}</h1>
          {remaining <= 2 && (
            <p className="text-xs text-red-600 uppercase tracking-widest mb-6">
              {remaining} spot{remaining === 1 ? "" : "s"} remaining
            </p>
          )}

          <div className="mt-8">
            <BookingDetail
              slot={{
                id: slot.id,
                startDate: slot.startDate,
                endDate: slot.endDate,
                label: slot.label,
                price: slot.price,
                type: slot.type,
              }}
              primePlacementPrice={PRIME_PRICE[type]}
              originalPrice={ORIGINAL_PRICE[type]}
              oosCategories={oosCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
