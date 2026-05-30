import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { invoices } from "@/lib/invoices";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";
const CARD_SURCHARGE = 0.03;

export async function POST(req: NextRequest) {
  const { slug, method } = await req.json();

  const invoice = invoices[slug];
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const isCard = method === "card";
  const baseAmount = invoice.amountCents;
  const chargeAmount = isCard ? Math.round(baseAmount * (1 + CARD_SURCHARGE)) : baseAmount;
  const surcharge = chargeAmount - baseAmount;

  const lineItems = isCard
    ? [
        {
          price_data: {
            currency: "usd",
            unit_amount: baseAmount,
            product_data: { name: invoice.description },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            unit_amount: surcharge,
            product_data: { name: "Credit card surcharge (3%)" },
          },
          quantity: 1,
        },
      ]
    : [
        {
          price_data: {
            currency: "usd",
            unit_amount: baseAmount,
            product_data: { name: invoice.description },
          },
          quantity: 1,
        },
      ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: invoice.email,
    payment_method_types: isCard ? ["card"] : ["us_bank_account"],
    line_items: lineItems,
    success_url: `${SITE_URL}/invoice/${slug}/success`,
    cancel_url: `${SITE_URL}/invoice/${slug}`,
    metadata: { slug, invoiceId: invoice.id },
  });

  return NextResponse.json({ url: session.url });
}
