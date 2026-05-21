import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata!;

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
      stripe_session_id: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
