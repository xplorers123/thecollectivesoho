import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_EMAIL = "info@popupcollectivenyc.com";
const SITE_URL    = "https://popupcollectivenyc.com";

type Vendor = {
  email: string;
  firstName: string;
  brandName: string;
  slot: "1" | "2";
  spot: "wall" | "middle";
};

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const {
    vendors,
    slot1Time,
    slot2Time,
  }: { vendors: Vendor[]; slot1Time: string; slot2Time: string } = await req.json();

  if (!vendors?.length) return NextResponse.json({ error: "No vendors selected." }, { status: 400 });

  const results: { email: string; ok: boolean }[] = [];

  for (const v of vendors) {
    const assignedTime = v.slot === "1" ? slot1Time : slot2Time;
    const spotInfo = v.spot === "wall"
      ? { size: "7′ × 5′", placement: "Against the wall", traffic: "Single-sided" }
      : { size: "9′ × 4′", placement: "Middle floor", traffic: "Double-sided traffic" };

    const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6;">
  <div style="border-bottom:1px solid #eee;padding-bottom:16px;margin-bottom:28px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin:0;">The Collective SoHo · 435 Broadway, NYC</p>
  </div>

  <p style="font-size:16px;">Hi ${v.firstName},</p>

  <p style="font-size:16px;">We're so excited to have <strong>${v.brandName}</strong> at <strong>The Collective SoHo</strong>. Please read through the logistics below carefully before load-in day.</p>

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:6px;">Market Address</p>
  <p style="font-size:15px;margin-top:0;">435 Broadway, New York, NY 10013</p>

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:6px;">Load-In & Setup</p>
  <p style="font-size:15px;margin-top:0;">
    Your load-in window: <strong>${assignedTime}</strong>
  </p>
  <p style="font-size:15px;">Please arrive within your assigned window. Our onsite manager will be there to greet you.</p>
  <p style="font-size:15px;">Onsite Manager: <strong>+1 (646) 423-7308</strong></p>

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:6px;">Your Booth Spot</p>
  <table style="font-size:15px;border-collapse:collapse;width:100%;background:#f9f9f9;border:1px solid #eee;">
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#888;width:40%;">Size</td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;"><strong>${spotInfo.size}</strong></td>
    </tr>
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#888;">Placement</td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;"><strong>${spotInfo.placement}</strong></td>
    </tr>
    <tr>
      <td style="padding:12px 16px;color:#888;">Traffic</td>
      <td style="padding:12px 16px;"><strong>${spotInfo.traffic}</strong></td>
    </tr>
  </table>
  <p style="font-size:13px;color:#888;margin-top:8px;">Your exact booth position will be pointed out by our onsite manager upon arrival.</p>

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:6px;">Wi-Fi</p>
  <table style="font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:3px 16px 3px 0;color:#888;">Network</td><td><strong>Cubico.co</strong></td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#888;">Password</td><td><strong>cubico123</strong></td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#888;">Backup</td><td><strong>cubico-compatibility</strong> · cubico123</td></tr>
  </table>

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:6px;">Market Hours</p>
  <p style="font-size:15px;margin-top:0;">Daily: <strong>11:00 AM – 7:00 PM</strong> (mandatory)</p>
  <ul style="font-size:15px;padding-left:20px;">
    <li>Your booth does <strong>not</strong> need to be broken down overnight</li>
    <li>Early breakdown is <strong>not permitted</strong> — vendors must operate the full duration</li>
    <li>At close, cover your booth with a cloth and leave your area neat and secure</li>
  </ul>

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:6px;">Setup & Display</p>
  <p style="font-size:15px;margin-top:0;">Review our <a href="${SITE_URL}/dashboard/vendor-guide" style="color:#111;font-weight:bold;">Vendor Guide</a> for display requirements and setup tips before load-in day.</p>

  <p style="font-size:15px;margin-top:28px;">Questions before load-in? Reply to this email and we'll get back to you.</p>
  <p style="font-size:15px;">Looking forward to seeing you there!</p>

  <div style="margin-top:36px;border-top:1px solid #eee;padding-top:20px;">
    <p style="font-size:13px;color:#888;margin:0;"><strong>The Collective SoHo</strong></p>
    <p style="font-size:12px;color:#aaa;margin:4px 0 0;">
      <a href="mailto:${ADMIN_EMAIL}" style="color:#aaa;">${ADMIN_EMAIL}</a> · @popupcollective.nyc
    </p>
  </div>
</div>`;

    const { error } = await resend.emails.send({
      from: `The Collective SoHo <${ADMIN_EMAIL}>`,
      to: v.email,
      subject: `Your Load-In Details — The Collective SoHo`,
      html,
    });

    results.push({ email: v.email, ok: !error });
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) return NextResponse.json({ error: `Failed: ${failed.map((f) => f.email).join(", ")}` }, { status: 500 });

  return NextResponse.json({ sent: results.length });
}
