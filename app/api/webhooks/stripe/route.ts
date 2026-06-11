import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ADMIN_EMAIL = "info@popupcollectivenyc.com";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatAmount(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function notificationHtml(
  brandName: string,
  vendorEmail: string,
  lines: { type: string; startDate: string; endDate: string; category: string; priceCents: number }[],
  totalCents: number,
  paymentMethod: string,
  sessionId: string,
) {
  const rows = lines
    .map(
      (l) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">
          <strong>${capitalize(l.type)}</strong> — ${l.startDate} → ${l.endDate}<br/>
          <span style="font-size:13px;color:#666;">${l.category ? capitalize(l.category) : "—"}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatAmount(l.priceCents)}</td>
      </tr>`,
    )
    .join("");

  return `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#111;">
  <div style="border-bottom:1px solid #eee;padding-bottom:16px;margin-bottom:24px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin:0;">The Collective SoHo · New Booking</p>
  </div>

  <p style="font-size:16px;margin-bottom:4px;"><strong>${brandName}</strong></p>
  <p style="font-size:14px;color:#555;margin-top:0;">${vendorEmail}</p>

  <table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:16px;">
    ${rows}
    <tr>
      <td style="padding-top:12px;font-weight:bold;">Total paid</td>
      <td style="padding-top:12px;text-align:right;font-weight:bold;">${formatAmount(totalCents)}</td>
    </tr>
  </table>

  <p style="font-size:13px;color:#888;margin-top:20px;">Payment: ${paymentMethod === "ach" ? "Bank Transfer (ACH)" : "Credit Card"}</p>
  <p style="font-size:12px;color:#aaa;">Session: ${sessionId}</p>
</div>`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata!;
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (m.isCart === "true") {
      const cartItems = JSON.parse(m.cartItems ?? "[]");

      for (const item of cartItems) {
        await supabaseAdmin.from("bookings").insert({
          vendor_clerk_id: m.vendorClerkId,
          vendor_email: m.vendorEmail,
          brand_name: m.brandName,
          booking_type: item.type,
          start_date: item.startDate,
          end_date: item.endDate,
          price_cents: item.priceCents,
          category: item.category ?? null,
          status: "confirmed",
          stripe_session_id: session.id,
        });
      }

      // Notify Lou — one email listing all items
      await resend.emails.send({
        from: `The Collective SoHo <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New booking — ${m.brandName} (${cartItems.length} slot${cartItems.length === 1 ? "" : "s"})`,
        html: notificationHtml(
          m.brandName,
          m.vendorEmail,
          cartItems,
          session.amount_total ?? 0,
          m.paymentMethod ?? "card",
          session.id,
        ),
      });
    } else {
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

      // Notify Lou — single booking
      await resend.emails.send({
        from: `The Collective SoHo <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New booking — ${m.brandName} · ${capitalize(m.bookingType)} ${m.startDate}`,
        html: notificationHtml(
          m.brandName,
          m.vendorEmail,
          [{ type: m.bookingType, startDate: m.startDate, endDate: m.endDate, category: m.category ?? "", priceCents: Number(m.priceCents) }],
          session.amount_total ?? 0,
          m.paymentMethod ?? "card",
          session.id,
        ),
      });
    }
  }

  return NextResponse.json({ received: true });
}
