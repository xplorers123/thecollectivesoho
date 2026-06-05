import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CATEGORY_LABELS: Record<string, string> = {
  jewelry: "Jewelry",
  clothing: "Clothing",
  other: "All Other Categories",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const { type, startDate, endDate, label, price, category, prime, paymentMethod } = await req.json();
  const isAch = paymentMethod === "ach";

  // Check availability
  const { count } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("booking_type", type)
    .eq("start_date", startDate)
    .eq("status", "confirmed");

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "This slot is now sold out." }, { status: 409 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${typeLabel} Booth — The Collective SoHo`,
          description: `${label} · ${categoryLabel}`,
        },
        unit_amount: price,
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: isAch ? ["us_bank_account"] : ["card"],
    line_items: lineItems,
    metadata: {
      vendorClerkId: userId,
      vendorEmail: user?.emailAddresses?.[0]?.emailAddress ?? "",
      brandName: (user?.unsafeMetadata?.brandName as string) ?? "",
      bookingType: type,
      startDate,
      endDate,
      priceCents: String(price),
      category,
      primePlacement: prime ? "yes" : "no",
      paymentMethod: isAch ? "ach" : "card",
    },
    allow_promotion_codes: true,
    success_url: `${baseUrl}/dashboard/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/book/${type}`,
  });

  return NextResponse.json({ url: session.url });
}
