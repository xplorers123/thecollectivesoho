// Emails invoice links to vendors in the standard invoice format.
// Usage: RESEND_API_KEY=... node scripts/send-invoices.mjs [--dry-run] [--reminder] slug1 slug2 ...
// Invoice data is read from lib/invoices.ts so amounts always match the pay page.

import { readFileSync } from "node:fs";
import { Resend } from "resend";

const SITE_URL = "https://popupcollectivenyc.com";
const ADMIN_EMAIL = "info@popupcollectivenyc.com";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const reminder = args.includes("--reminder");
const preview = args.includes("--preview");
const dueToday = args.includes("--due-today"); // reminder wording: "due today" instead of "was due <date>" // write the email to a local HTML file instead of sending
const slugs = args.filter((a) => !a.startsWith("--"));
if (!slugs.length) {
  console.error("Pass at least one invoice slug.");
  process.exit(1);
}

// Pull an invoice entry (one-line or multi-line) out of lib/invoices.ts.
const source = readFileSync(new URL("../lib/invoices.ts", import.meta.url), "utf8");
function readInvoice(slug) {
  const start = source.indexOf(`"${slug}": {`);
  if (start < 0) return null;
  let depth = 0, end = start;
  for (let i = source.indexOf("{", start); i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) { end = i; break; }
  }
  // Drop the line items so only the invoice's own top-level fields are read.
  const block = source.slice(start, end).replace(/lineItems:\s*\[[\s\S]*?\],/, "");
  const field = (k) => block.match(new RegExp(`\\b${k}: "([^"]*)"`))?.[1];
  const amount = block.match(/\bamountCents: (\d+)/)?.[1];
  return {
    email: field("email"),
    name: field("name"),
    description: field("description"),
    dueDate: field("dueDate"),
    amountCents: amount ? Number(amount) : null,
  };
}

const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });

function html(inv, slug) {
  const intro = reminder && dueToday
    ? `This is a friendly reminder that your invoice for <strong>${inv.description}</strong> is due <strong>today</strong>. Please complete your payment by end of day.`
    : reminder
    ? `This is a friendly reminder that your invoice for <strong>${inv.description}</strong> is still open. It was due <strong>${inv.dueDate}</strong> — please complete your payment as soon as you can.`
    : `Your invoice for <strong>${inv.description}</strong> is ready. Please complete your payment by <strong>${inv.dueDate}</strong>.`;
  const td = "padding:12px 14px;border-bottom:1px solid #eee;font-size:14px;";
  const th = "padding:10px 14px;text-align:left;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888;border-bottom:1px solid #ddd;font-weight:normal;";
  return `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
    <p style="font-size:16px;line-height:1.7;">Hi ${inv.name},</p>
    <p style="font-size:16px;line-height:1.7;">${intro}</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0;">
      <tr><th style="${th}">Description</th><th style="${th}">Amount Due</th><th style="${th}">Due Date</th></tr>
      <tr><td style="${td}">${inv.description}</td><td style="${td}"><strong>${money(inv.amountCents)}</strong></td><td style="${td}">${dueToday ? "Today" : inv.dueDate}</td></tr>
    </table>
    <div style="margin:28px 0;">
      <a href="${SITE_URL}/invoice/${slug}" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">View Invoice &amp; Pay</a>
    </div>
    <p style="font-size:13px;color:#666;line-height:1.7;">Payment options: Zelle (no fee) · Credit card (+3%) · Bank transfer (+$5)</p>
    <p style="font-size:13px;color:#666;line-height:1.7;">Questions? Reply to this email.</p>
  </div>`;
}

const resend = dryRun || preview ? null : new Resend(process.env.RESEND_API_KEY);

for (const slug of slugs) {
  const inv = readInvoice(slug);
  if (!inv || !inv.email || !inv.amountCents) {
    console.error(`✗ ${slug}: invoice not found or incomplete`);
    continue;
  }
  const subject = reminder ? `Reminder: ${dueToday ? "Payment due today" : "Invoice"} — ${inv.description}` : `Invoice — ${inv.description}`;
  if (preview) {
    const { writeFileSync } = await import("node:fs");
    const out = `/tmp/invoice-preview-${slug}.html`;
    writeFileSync(out, `<p style="font:13px sans-serif;color:#888">To: ${inv.email} · Cc: ${ADMIN_EMAIL}<br>Subject: ${subject}</p><hr>` + html(inv, slug));
    console.log(out);
    continue;
  }
  if (dryRun) {
    console.log(`[dry run] ${inv.email} | ${inv.name} | ${money(inv.amountCents)} | due ${inv.dueDate} | ${SITE_URL}/invoice/${slug}`);
    continue;
  }
  const { error } = await resend.emails.send({
    from: `The Collective SoHo <${ADMIN_EMAIL}>`,
    to: inv.email,
    cc: ADMIN_EMAIL, // Lou is always cc'd on invoice emails
    replyTo: ADMIN_EMAIL,
    subject,
    html: html(inv, slug),
  });
  console.log(error ? `✗ ${slug} (${inv.email}): ${error.message}` : `✓ Sent ${slug} to ${inv.email}`);
}
