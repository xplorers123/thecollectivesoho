import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_EMAIL = "info@popupcollectivenyc.com";
const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";

export async function POST(req: NextRequest) {
  try {
    const { email, brandName } = await req.json();
    if (!email) return NextResponse.json({ ok: true });

    // Look up their application for more details
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("first_name, last_name, brand_name, product_category")
      .eq("email", email)
      .single();

    const name = app ? `${app.first_name} ${app.last_name}` : email;
    const brand = app?.brand_name ?? brandName ?? "—";
    const category = app?.product_category ?? "—";

    // Mark as registered in approved_vendors
    await supabaseAdmin
      .from("approved_vendors")
      .update({ registered: true, last_login_at: new Date().toISOString() })
      .eq("email", email.toLowerCase().trim());

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🎉 ${brand} just registered`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111;">
          <h2 style="font-size:20px;margin-bottom:4px;">New Vendor Registration</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">The Collective SoHo · Vendor Portal</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#666;width:120px;">Name</td><td><strong>${name}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666;">Brand</td><td>${brand}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Category</td><td>${category}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Email</td><td>${email}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Registered at</td><td>${new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td></tr>
          </table>
          <div style="margin-top:28px;">
            <a href="${SITE_URL}/dashboard/book"
               style="display:inline-block;background:#000;color:#fff;padding:12px 24px;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">
              View Vendor Portal
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("notify-registered error:", err);
    return NextResponse.json({ ok: true }); // never block the user
  }
}
