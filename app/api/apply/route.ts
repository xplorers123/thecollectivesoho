import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createToken } from "@/lib/approval-token";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";
const ADMIN_EMAIL = "info@popupcollectivenyc.com";

async function uploadPhoto(file: File, folder: string): Promise<string | null> {
  try {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from("Applications")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) return null;
    const { data } = supabaseAdmin.storage.from("Applications").getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const phone = fd.get("phone") as string;
    const email = (fd.get("email") as string)?.toLowerCase().trim();
    const brandName = fd.get("brandName") as string;
    const category = fd.get("category") as string;
    const instagram = fd.get("instagram") as string;
    const website = fd.get("website") as string;
    const priceRange = fd.get("priceRange") as string;
    const brandStory = fd.get("brandStory") as string;
    const weeklyTier = fd.get("weeklyTier") as string;
    const monthlyTier = fd.get("monthlyTier") as string;
    const bookingType = fd.get("bookingType") as string;
    const threeMonthTier = fd.get("threeMonthTier") as string;
    const grandOpening = fd.get("grandOpening") as string;
    const additionalComments = fd.get("additionalComments") as string;
    const emailConsent = fd.get("emailConsent") === "true";

    // Upload photos
    const productPhotoFiles = fd.getAll("productPhotos") as File[];
    const displayPhotoFiles = fd.getAll("displayPhotos") as File[];

    const productPhotoUrls = (
      await Promise.all(productPhotoFiles.filter((f) => f.size > 0).map((f) => uploadPhoto(f, "product-photos")))
    ).filter(Boolean) as string[];

    const displayPhotoUrls = (
      await Promise.all(displayPhotoFiles.filter((f) => f.size > 0).map((f) => uploadPhoto(f, "display-photos")))
    ).filter(Boolean) as string[];

    // Save to Supabase — upsert so retries / duplicate submissions don't error
    const { error: dbError } = await supabaseAdmin.from("applications").upsert({
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      brand_name: brandName,
      product_category: category,
      instagram,
      website,
      price_range: priceRange,
      brand_story: brandStory,
      product_photo_urls: productPhotoUrls,
      display_photo_urls: displayPhotoUrls,
      weekly_tier: weeklyTier,
      monthly_tier: monthlyTier,
      booking_type: bookingType,
      three_month_tier: threeMonthTier,
      grand_opening: grandOpening,
      additional_comments: additionalComments,
      email_consent: emailConsent,
      status: "pending",
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: "Could not save application." }, { status: 500 });
    }

    // Send admin notification — wrapped so email failure never blocks submission
    try {
      const token = createToken(email);
      const resend = new Resend(process.env.RESEND_API_KEY);
      const approveUrl = `${SITE_URL}/api/approve-vendor?email=${encodeURIComponent(email)}&name=${encodeURIComponent(`${firstName} ${lastName}`)}&brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}&token=${token}`;

      function photoGrid(urls: string[], label: string) {
        if (!urls.length) return "";
        const thumbs = urls.map(u => `<a href="${u}" target="_blank" style="display:inline-block;margin:4px;"><img src="${u}" width="100" height="100" style="width:100px;height:100px;object-fit:cover;border:1px solid #eee;" /></a>`).join("");
        return `<div style="margin-top:16px;"><p style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">${label}</p>${thumbs}</div>`;
      }

      await resend.emails.send({
        from: `The Collective SoHo <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New vendor application — ${brandName || `${firstName} ${lastName}`}`,
        html: `
          <div style="font-family:sans-serif;max-width:620px;margin:0 auto;color:#111;">
            <h2 style="font-size:22px;margin-bottom:4px;">New Vendor Application</h2>
            <p style="color:#888;font-size:13px;margin-top:0;">The Collective SoHo</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#666;width:160px;">Name</td><td><strong>${firstName} ${lastName}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#666;">Email</td><td>${email}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Phone</td><td>${phone}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Brand</td><td>${brandName}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Category</td><td>${category}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Instagram</td><td>${instagram}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Website</td><td>${website || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Price range</td><td>${priceRange}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Booking type</td><td>${bookingType}</td></tr>
            </table>
            ${brandStory ? `<div style="margin:16px 0;padding:14px;background:#f9f9f9;font-size:13px;line-height:1.6;"><strong>Brand story:</strong><br/>${brandStory}</div>` : ""}
            ${additionalComments ? `<div style="margin:12px 0;padding:14px;background:#f9f9f9;font-size:13px;line-height:1.6;"><strong>Comments:</strong><br/>${additionalComments}</div>` : ""}
            ${photoGrid(productPhotoUrls, "Product photos")}
            ${photoGrid(displayPhotoUrls, "Display photos")}
            <div style="margin-top:32px;">
              <a href="${approveUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">
                ✓ Approve this vendor
              </a>
            </div>
            <p style="margin-top:14px;font-size:12px;color:#999;">Clicking approve adds them to the approved list, creates their portal account, and sends them the welcome email automatically.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Admin notification email failed (application still saved):", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
