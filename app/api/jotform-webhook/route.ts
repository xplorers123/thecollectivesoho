import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createToken } from "@/lib/approval-token";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";
const ADMIN_EMAIL = "info@popupcollectivenyc.com";

function extractField(data: Record<string, any>, fieldName: string): string {
  if (data[fieldName] !== undefined) {
    const v = data[fieldName];
    if (typeof v === "object" && v !== null) return [v.first, v.last].filter(Boolean).join(" ");
    return String(v ?? "");
  }
  const key = Object.keys(data).find(
    (k) => k.toLowerCase() === `q_${fieldName.toLowerCase()}` ||
           k.toLowerCase().endsWith(`_${fieldName.toLowerCase()}`)
  );
  if (key) {
    const v = data[key];
    if (typeof v === "object" && v !== null) return [v.first, v.last].filter(Boolean).join(" ");
    return String(v ?? "");
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawRequest = formData.get("rawRequest") as string;

    if (!rawRequest) {
      return NextResponse.json({ error: "No rawRequest" }, { status: 400 });
    }

    const data = JSON.parse(rawRequest);

    const name = extractField(data, "fullName");
    const email = extractField(data, "email")?.toLowerCase().trim();
    const brand = extractField(data, "companyBrandName");
    const category = extractField(data, "productCategory");
    const instagram = extractField(data, "socialMedia");
    const bookingType = extractField(data, "bookingType");
    const priceRange = extractField(data, "priceRange");
    const brandStory = extractField(data, "brandStory");

    if (!email) {
      return NextResponse.json({ error: "No email in submission" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const token = createToken(email);
    const approveUrl = `${SITE_URL}/api/approve-vendor?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&brand=${encodeURIComponent(brand)}&category=${encodeURIComponent(category)}&token=${token}`;

    await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New vendor application — ${brand || name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
          <h2 style="font-size:22px;margin-bottom:4px;">New Vendor Application</h2>
          <p style="color:#666;font-size:13px;margin-top:0;">The Collective SoHo</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#666;width:140px;">Name</td><td><strong>${name}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666;">Email</td><td>${email}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Brand</td><td>${brand}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Category</td><td>${category}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Booking type</td><td>${bookingType}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Price range</td><td>${priceRange}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Instagram</td><td>${instagram}</td></tr>
          </table>
          ${brandStory ? `<div style="margin-top:16px;padding:14px;background:#f9f9f9;font-size:13px;line-height:1.6;">${brandStory}</div>` : ""}
          <div style="margin-top:32px;">
            <a href="${approveUrl}"
               style="display:inline-block;background:#000;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">
              ✓ Approve this vendor
            </a>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#999;">Clicking approve will add them to the approved vendors list, create their portal account, and send them the welcome email automatically.</p>
        </div>
      `,
    });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Jotform webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
