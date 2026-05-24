// Downloads Jotform photos and uploads them to Supabase Storage,
// then updates the application records with the new URLs.
// Usage: SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-photos.mjs "/path/to/export.csv"

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const CSV_PATH = process.argv[2];
if (!CSV_PATH) {
  console.error("Usage: node scripts/migrate-photos.mjs <path-to-csv>");
  process.exit(1);
}

const SUPABASE_URL = "https://xrttxrisvsolsscmubbn.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_SERVICE_KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY env var.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Reuse same CSV parser as import script
function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(field.trim()); field = ""; }
      else if (ch === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ""; }
      else if (ch !== '\r') { field += ch; }
    }
  }
  if (field || row.length) { row.push(field.trim()); rows.push(row); }
  return rows;
}

function col(headers, row, name) {
  const i = headers.findIndex(h => h.replace(/﻿/g, "").trim() === name.trim());
  return i >= 0 ? (row[i] ?? "").trim() : "";
}

function extractUrls(raw) {
  return raw
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(s => s.startsWith("http"));
}

async function downloadAndUpload(url, folder) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("gif") ? "gif" : "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("Applications")
      .upload(path, Buffer.from(buffer), { contentType, upsert: false });
    if (error) { console.error("  Upload error:", error.message); return null; }
    const { data } = supabase.storage.from("Applications").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("  Download error:", err.message);
    return null;
  }
}

const raw = readFileSync(CSV_PATH, "utf-8");
const rows = parseCSV(raw);
const headers = rows[0];
const data = rows.slice(1).filter(r => r.some(f => f));

let updated = 0, skipped = 0;

for (const row of data) {
  const email = col(headers, row, "E-mail").toLowerCase().trim();
  const fullName = col(headers, row, "Full Name");
  if (!email) continue;

  const productRaw = col(headers, row, "Attach photos of your products/display here (optional):");
  const displayRaw = col(headers, row, "Attach photos of your displays here (optional):");

  const productUrls = extractUrls(productRaw);
  const displayUrls = extractUrls(displayRaw);

  if (productUrls.length === 0 && displayUrls.length === 0) {
    console.log(`– ${fullName}: no photos, skipping`);
    skipped++;
    continue;
  }

  console.log(`↓ ${fullName} (${email}) — ${productUrls.length} product, ${displayUrls.length} display photos`);

  const newProductUrls = (await Promise.all(productUrls.map(u => downloadAndUpload(u, "product-photos")))).filter(Boolean);
  const newDisplayUrls = (await Promise.all(displayUrls.map(u => downloadAndUpload(u, "display-photos")))).filter(Boolean);

  const { error } = await supabase
    .from("applications")
    .update({
      product_photo_urls: newProductUrls,
      display_photo_urls: newDisplayUrls,
    })
    .eq("email", email);

  if (error) {
    console.error(`  ✗ DB update failed:`, error.message);
  } else {
    console.log(`  ✓ Saved ${newProductUrls.length + newDisplayUrls.length} photos`);
    updated++;
  }
}

console.log(`\nDone. ${updated} records updated, ${skipped} had no photos.`);
