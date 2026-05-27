import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";
const ADMIN_EMAIL = "info@popupcollectivenyc.com";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, brandName, category } = await req.json();

    if (!email || !firstName || !lastName || !brandName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Add to approved_vendors + applications
    await supabaseAdmin
      .from("approved_vendors")
      .upsert({ email: normalizedEmail, brand_name: brandName }, { onConflict: "email" });

    await supabaseAdmin
      .from("applications")
      .upsert(
        {
          first_name: firstName,
          last_name: lastName,
          email: normalizedEmail,
          brand_name: brandName,
          product_category: category ?? null,
          status: "approved",
          approved_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    // 2. Create Clerk account
    const client = await clerkClient();
    try {
      await client.users.createUser({
        emailAddress: [normalizedEmail],
        unsafeMetadata: { brandName },
        skipPasswordRequirement: true,
      });
    } catch (err: any) {
      if (err?.errors?.[0]?.code === "form_identifier_exists") {
        try {
          const existing = await client.users.getUserList({ emailAddress: [normalizedEmail] });
          if (existing.data[0]) {
            await client.users.updateUserMetadata(existing.data[0].id, {
              unsafeMetadata: { brandName },
            });
          }
        } catch {}
      }
    }

    // 3. Send welcome email
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: normalizedEmail,
      subject: "You're approved — Welcome to The Collective SoHo",
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#111;">
          <div style="border-bottom:1px solid #eee;padding-bottom:20px;margin-bottom:28px;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin:0;">The Collective SoHo · 435 Broadway, NYC</p>
          </div>

          <p style="font-size:16px;line-height:1.7;">Hi ${firstName},</p>

          <p style="font-size:16px;line-height:1.7;">
            We are thrilled to invite you to join <strong>The Collective SoHo</strong> market at 435 Broadway, New York${category ? ` in the <strong>${category}</strong> category` : ""}.
          </p>

          <p style="font-size:16px;line-height:1.7;">
            Our merchant community of artists, crafters, vintage curators and creatives of all types is what makes our markets so special — so thank you for joining us.
          </p>

          <p style="font-size:15px;font-weight:bold;margin-top:32px;margin-bottom:8px;">To start selling with us, follow these steps:</p>

          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.7;">
            <tr>
              <td style="padding:10px 0;vertical-align:top;width:32px;font-weight:bold;">1.</td>
              <td style="padding:10px 0;">
                Register a vendor portal account using the same email address as your application.
                <br/>
                <a href="${SITE_URL}/register" style="color:#000;font-weight:bold;">${SITE_URL}/register</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;vertical-align:top;font-weight:bold;">2.</td>
              <td style="padding:10px 0;">
                Make your booking from the portal, or visit
                <a href="${SITE_URL}/dashboard/book" style="color:#000;font-weight:bold;">${SITE_URL}/dashboard/book</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;vertical-align:top;font-weight:bold;">3.</td>
              <td style="padding:10px 0;">
                Read our <strong>Vendor Guide</strong> before completing your booking — it includes everything you need to know to set up your booth.
                <br/>
                <a href="${SITE_URL}/dashboard/vendor-guide" style="color:#000;font-weight:bold;">${SITE_URL}/dashboard/vendor-guide</a>
              </td>
            </tr>
          </table>

          <div style="margin-top:36px;">
            <a href="${SITE_URL}/login"
               style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-family:sans-serif;">
              Log In to Your Portal
            </a>
          </div>

          <p style="font-size:14px;color:#666;margin-top:40px;line-height:1.7;">
            Questions? Reach us at <a href="mailto:${ADMIN_EMAIL}" style="color:#111;">${ADMIN_EMAIL}</a> or follow us on Instagram <a href="https://instagram.com/popupcollective.nyc" style="color:#111;">@popupcollective.nyc</a>.
          </p>

          <div style="border-top:1px solid #eee;margin-top:40px;padding-top:20px;">
            <p style="font-size:12px;color:#999;margin:0;">The Collective SoHo · 435 Broadway, New York, NY 10013</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("add-vendor error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
