import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { invoices } from "@/lib/invoices";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";

export async function POST(req: NextRequest) {
  const { slug, method } = await req.json();

  const invoice = invoices[slug];
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: invoice.email,
    payment_method_types: method === "bank" ? ["us_bank_account"] : ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: invoice.amountCents,
          product_data: { name: invoice.description },
        },
        quantity: 1,
      },
    ],
    success_url: `${SITE_URL}/invoice/${slug}/success`,
    cancel_url: `${SITE_URL}/invoice/${slug}`,
    metadata: { slug, invoiceId: invoice.id },
  });

  return NextResponse.json({ url: session.url });
}
