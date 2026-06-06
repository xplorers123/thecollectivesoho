import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CartItem } from "@/lib/cart-context";

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
  const { items, paymentMethod, totalCents }: { items: CartItem[]; paymentMethod: string; totalCents: number } = await req.json();

  if (!items?.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });

  const isAch = paymentMethod === "ach";
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

  // Check availability for all slots
  for (const item of items) {
    const { count } = await supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("booking_type", item.type)
      .eq("start_date", item.startDate)
      .eq("status", "confirmed");

    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: `${item.label} is now sold out.` }, { status: 409 });
    }
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Booth — The Collective SoHo`,
        description: `${item.label} · ${CATEGORY_LABELS[item.category] ?? item.category}${item.prime ? " · Prime Placement" : ""}`,
      },
      unit_amount: item.price,
    },
    quantity: 1,
  }));

  // Add card fee line item if paying by card
  if (!isAch) {
    const fee = totalCents - items.reduce((s, i) => s + i.price, 0);
    if (fee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Credit card surcharge (3%)", description: "" },
          unit_amount: fee,
        },
        quantity: 1,
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: isAch ? ["us_bank_account"] : ["card"],
    line_items: lineItems,
    allow_promotion_codes: true,
    metadata: {
      vendorClerkId: userId,
      vendorEmail: user?.emailAddresses?.[0]?.emailAddress ?? "",
      brandName: (user?.unsafeMetadata?.brandName as string) ?? "",
      cartItems: JSON.stringify(items.map((i) => ({
        type: i.type,
        startDate: i.startDate,
        endDate: i.endDate,
        category: i.category,
        prime: i.prime,
        priceCents: i.price,
      }))),
      paymentMethod: isAch ? "ach" : "card",
      isCart: "true",
    },
    success_url: `${baseUrl}/dashboard/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/cart`,
  });

  return NextResponse.json({ url: session.url });
}
