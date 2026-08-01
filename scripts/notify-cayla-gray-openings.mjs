// Tracks the Cayla Gray (Kelly) application — sourced from an Instagram DM rather
// than the Jotform/apply flow — and emails her about our current open spots.
// Usage: SUPABASE_SERVICE_ROLE_KEY=... RESEND_API_KEY=... node scripts/notify-cayla-gray-openings.mjs

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const SITE_URL = "https://popupcollectivenyc.com";
const ADMIN_EMAIL = "info@popupcollectivenyc.com";

const LEAD = {
  email: "kelly@caylagray.com",
  first_name: "Kelly",
  brand_name: "Cayla Gray",
  instagram: "caylagrayco",
  additional_comments:
    "Applied via Instagram DM (@caylagrayco). Lou originally reached out about the Broadway-facing window spot for Aug 1; following up with current open spots.",
  status: "pending",
};

const OPENINGS = [
  {
    label: "Front Window",
    size: "12ft x 7ft",
    availability: "Available after Aug 21",
  },
  {
    label: "Prime Entrance Spot (first spot at entrance)",
    size: "8ft x 5ft",
    availability: "Available now",
  },
  {
    label: "Extra Large Prime Wall Space",
    size: "12ft x 5ft",
    availability: "Available now",
  },
];

const supabase = createClient(
  "https://xrttxrisvsolsscmubbn.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Track the application so it shows up in /admin/applications
const { error: dbError } = await supabase.from("applications").upsert(
  {
    email: LEAD.email,
    first_name: LEAD.first_name,
    brand_name: LEAD.brand_name,
    instagram: LEAD.instagram,
    additional_comments: LEAD.additional_comments,
    status: LEAD.status,
  },
  { onConflict: "email" }
);

if (dbError) {
  console.error("✗ Could not save application:", dbError.message);
  process.exit(1);
}
console.log(`✓ Application tracked for ${LEAD.brand_name} (${LEAD.email})`);

// 2. Email her about the current openings
const resend = new Resend(process.env.RESEND_API_KEY);

const openingsRows = OPENINGS.map(
  (o) => `
    <tr>
      <td style="padding:12px 0;border-top:1px solid #eee;">
        <p style="margin:0;font-size:15px;font-weight:bold;">${o.label}</p>
        <p style="margin:2px 0 0;font-size:14px;color:#666;">${o.size} · ${o.availability}</p>
      </td>
    </tr>`
).join("");

const { error: emailError } = await resend.emails.send({
  from: `The Collective SoHo <${ADMIN_EMAIL}>`,
  to: LEAD.email,
  subject: "A few spots just opened up at The Collective SoHo",
  html: `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#111;">
  <div style="border-bottom:1px solid #eee;padding-bottom:20px;margin-bottom:28px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin:0;">The Collective SoHo · 435 Broadway, NYC</p>
  </div>
  <p style="font-size:16px;line-height:1.7;">Hi ${LEAD.first_name},</p>
  <p style="font-size:16px;line-height:1.7;">
    Thanks again for applying with <strong>${LEAD.brand_name}</strong> — we loved your brand aesthetic. A few new spots just opened up that we think could be a great fit:
  </p>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">${openingsRows}</table>
  <p style="font-size:16px;line-height:1.7;margin-top:28px;">
    Let us know if you'd like more details on any of these, or if you'd like us to hold one for you.
  </p>
  <div style="margin-top:32px;">
    <a href="mailto:${ADMIN_EMAIL}"
       style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-family:sans-serif;">
      Reply to Claim a Spot
    </a>
  </div>
  <p style="font-size:14px;color:#666;margin-top:40px;line-height:1.7;">
    Questions? Reach us at <a href="mailto:${ADMIN_EMAIL}" style="color:#111;">${ADMIN_EMAIL}</a> or follow us on Instagram <a href="https://instagram.com/popupcollective.nyc" style="color:#111;">@popupcollective.nyc</a>.
  </p>
  <div style="border-top:1px solid #eee;margin-top:40px;padding-top:20px;">
    <p style="font-size:12px;color:#999;margin:0;">The Collective SoHo · 435 Broadway, New York, NY 10013</p>
  </div>
</div>`,
});

if (emailError) {
  console.error("✗ Email failed:", emailError.message);
  process.exit(1);
}
console.log(`✓ Openings email sent to ${LEAD.email}`);
