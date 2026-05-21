import Link from "next/link";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata = { title: "Booking Confirmed — The Collective SoHo" };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function confirmBooking(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return;

    const m = session.metadata;
    if (!m?.vendorClerkId) return;

    // Upsert so re-visiting the page doesn't create duplicates
    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .single();

    if (!existing) {
      await supabaseAdmin.from("bookings").insert({
        vendor_clerk_id: m.vendorClerkId,
        vendor_email: m.vendorEmail,
        brand_name: m.brandName,
        booking_type: m.bookingType,
        start_date: m.startDate,
        end_date: m.endDate,
        price_cents: Number(m.priceCents),
        category: m.category ?? null,
        status: "confirmed",
        stripe_session_id: sessionId,
      });
    }
  } catch {
    // Non-fatal — webhook will also create the booking in production
  }
}

export default async function BookingSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (session_id) await confirmBooking(session_id);

  return (
    <div className="px-8 py-20 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-widest text-muted">Booking Confirmed</p>
        <h1 className="mt-4 text-4xl font-medium leading-tight">
          You&apos;re{" "}
          <span className="serif-italic font-normal">booked</span>.
        </h1>
        <p className="mt-6 text-sm text-muted leading-relaxed">
          Your payment was successful and your booth is reserved. We&apos;ll follow up by email with setup details and your booth placement.
        </p>
        <p className="mt-4 text-sm text-muted">
          Questions? Email{" "}
          <a href="mailto:info@popupcollectivenyc.com" className="underline underline-offset-2 hover:text-black transition-colors">
            info@popupcollectivenyc.com
          </a>
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            href="/dashboard/book"
            className="inline-flex items-center justify-center border border-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Book Another Slot
          </Link>
        </div>
      </div>
    </div>
  );
}
