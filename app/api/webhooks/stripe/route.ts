import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ADMIN_EMAIL = "info@popupcollectivenyc.com";
const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatAmount(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatDate(d: string) {
  const [y, mo, day] = d.split("-").map(Number);
  return new Date(y, mo - 1, day).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Email to admin when a new booking comes in
function adminNotificationHtml(
  brandName: string,
  vendorEmail: string,
  lines: { type: string; startDate: string; endDate: string; category: string; priceCents: number }[],
  totalCents: number,
  paymentMethod: string,
  sessionId: string,
  pending = false,
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
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin:0;">
      The Collective SoHo · ${pending ? "New Booking (ACH Pending)" : "New Booking Confirmed"}
    </p>
  </div>
  ${pending ? `<p style="background:#fef3c7;border:1px solid #fde68a;padding:12px 16px;font-size:13px;color:#92400e;margin-bottom:20px;">
    ⏳ ACH bank transfer initiated — payment will settle in 3–5 business days. Booking will be confirmed once funds clear.
  </p>` : ""}
  <p style="font-size:16px;margin-bottom:4px;"><strong>${brandName}</strong></p>
  <p style="font-size:14px;color:#555;margin-top:0;">${vendorEmail}</p>
  <table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:16px;">
    ${rows}
    <tr>
      <td style="padding-top:12px;font-weight:bold;">Total</td>
      <td style="padding-top:12px;text-align:right;font-weight:bold;">${formatAmount(totalCents)}</td>
    </tr>
  </table>
  <p style="font-size:13px;color:#888;margin-top:20px;">Payment: ${paymentMethod === "ach" ? "Bank Transfer (ACH)" : "Credit Card"}</p>
  <p style="font-size:12px;color:#aaa;">Session: ${sessionId}</p>
</div>`;
}

// Confirmation email to vendor
function vendorConfirmationHtml(
  brandName: string,
  lines: { type: string; startDate: string; endDate: string; priceCents: number }[],
  totalCents: number,
  pending: boolean,
) {
  const rows = lines
    .map(
      (l) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;font-size:14px;">
          ${capitalize(l.type)} — ${formatDate(l.startDate)} – ${formatDate(l.endDate)}
        </td>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;text-align:right;font-size:14px;">${formatAmount(l.priceCents)}</td>
      </tr>`)
    .join("");

  return `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6;">
  <div style="border-bottom:1px solid #eee;padding-bottom:16px;margin-bottom:28px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin:0;">The Collective SoHo · 435 Broadway, NYC</p>
  </div>

  <h2 style="font-size:22px;font-weight:normal;margin-bottom:4px;">
    ${pending ? "Your booking is being processed." : "Your booking is confirmed!"}
  </h2>
  <p style="color:#888;font-size:14px;margin-top:0;">Thank you for booking with <strong>The Collective SoHo</strong>.</p>

  ${pending ? `
  <div style="background:#fef3c7;border:1px solid #fde68a;padding:14px 18px;font-size:14px;color:#92400e;margin:20px 0;border-radius:2px;">
    Your bank transfer is being processed and typically takes <strong>3–5 business days</strong> to settle.
    Your dates are reserved and you'll receive a final confirmation once the payment clears.
    If you have any questions, reply to this email.
  </div>` : ""}

  <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border:1px solid #eee;margin:24px 0;">
    <thead>
      <tr style="background:#f3f3f3;">
        <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888;font-weight:normal;">Booking</th>
        <th style="padding:10px 16px;text-align:right;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888;font-weight:normal;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr>
        <td style="padding:10px 16px;font-weight:bold;font-size:14px;">Total</td>
        <td style="padding:10px 16px;text-align:right;font-weight:bold;font-size:14px;">${formatAmount(totalCents)}</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size:15px;">We'll be in touch before your start date with load-in details and setup instructions.</p>
  <p style="font-size:15px;">In the meantime, check out our <a href="${SITE_URL}/dashboard/vendor-guide" style="color:#111;font-weight:bold;">Vendor Guide</a> to get ready.</p>

  <div style="margin-top:36px;border-top:1px solid #eee;padding-top:20px;">
    <p style="font-size:13px;color:#888;margin:0;"><strong>The Collective SoHo</strong></p>
    <p style="font-size:12px;color:#aaa;margin:4px 0 0;">
      <a href="mailto:${ADMIN_EMAIL}" style="color:#aaa;">${ADMIN_EMAIL}</a> · @popupcollective.nyc
    </p>
  </div>
</div>`;
}

async function createBookings(session: Stripe.Checkout.Session, resend: Resend) {
  const m = session.metadata!;
  const paymentMethod = m.paymentMethod ?? "card";

  if (m.isCart === "true") {
    const cartItems = JSON.parse(m.cartItems ?? "[]");

    for (const item of cartItems) {
      await supabaseAdmin.from("bookings").upsert(
        {
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
        },
        { onConflict: "stripe_session_id,start_date" },
      );
    }

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Booking confirmed — ${m.brandName} (${cartItems.length} slot${cartItems.length === 1 ? "" : "s"})`,
      html: adminNotificationHtml(m.brandName, m.vendorEmail, cartItems, session.amount_total ?? 0, paymentMethod, session.id, false),
    });

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: m.vendorEmail,
      subject: `Booking confirmed — The Collective SoHo`,
      html: vendorConfirmationHtml(m.brandName, cartItems, session.amount_total ?? 0, false),
    });
  } else {
    await supabaseAdmin.from("bookings").upsert(
      {
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
      },
      { onConflict: "stripe_session_id,start_date" },
    );

    const lines = [{ type: m.bookingType, startDate: m.startDate, endDate: m.endDate, category: m.category ?? "", priceCents: Number(m.priceCents) }];

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Booking confirmed — ${m.brandName} · ${capitalize(m.bookingType)} ${m.startDate}`,
      html: adminNotificationHtml(m.brandName, m.vendorEmail, lines, session.amount_total ?? 0, paymentMethod, session.id, false),
    });

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: m.vendorEmail,
      subject: `Booking confirmed — The Collective SoHo`,
      html: vendorConfirmationHtml(m.brandName, lines, session.amount_total ?? 0, false),
    });
  }
}

async function notifyAchPending(session: Stripe.Checkout.Session, resend: Resend) {
  const m = session.metadata!;
  const paymentMethod = "ach";

  if (m.isCart === "true") {
    const cartItems = JSON.parse(m.cartItems ?? "[]");

    // Notify admin immediately
    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `ACH pending — ${m.brandName} (${cartItems.length} slot${cartItems.length === 1 ? "" : "s"})`,
      html: adminNotificationHtml(m.brandName, m.vendorEmail, cartItems, session.amount_total ?? 0, paymentMethod, session.id, true),
    });

    // Tell vendor their booking is processing
    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: m.vendorEmail,
      subject: `Your booking is being processed — The Collective SoHo`,
      html: vendorConfirmationHtml(m.brandName, cartItems, session.amount_total ?? 0, true),
    });
  } else {
    const lines = [{ type: m.bookingType, startDate: m.startDate, endDate: m.endDate, category: m.category ?? "", priceCents: Number(m.priceCents) }];

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `ACH pending — ${m.brandName} · ${capitalize(m.bookingType)} ${m.startDate}`,
      html: adminNotificationHtml(m.brandName, m.vendorEmail, lines, session.amount_total ?? 0, paymentMethod, session.id, true),
    });

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: m.vendorEmail,
      subject: `Your booking is being processed — The Collective SoHo`,
      html: vendorConfirmationHtml(m.brandName, lines, session.amount_total ?? 0, true),
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      // Card payment — confirmed immediately
      await createBookings(session, resend);
    } else {
      // ACH — payment pending, notify but don't create booking yet
      await notifyAchPending(session, resend);
    }
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    // ACH settled — now create the booking and send confirmations
    const session = event.data.object as Stripe.Checkout.Session;
    await createBookings(session, resend);
  }

  return NextResponse.json({ received: true });
}
