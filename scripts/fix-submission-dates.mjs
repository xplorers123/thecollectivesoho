// Updates created_at in Supabase to match the actual Jotform submission date.
// Usage: SUPABASE_SERVICE_ROLE_KEY=... node scripts/fix-submission-dates.mjs "/path/to/export.csv"

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const CSV_PATH = process.argv[2];
if (!CSV_PATH) { console.error("Usage: node scripts/fix-submission-dates.mjs <csv>"); process.exit(1); }

const supabase = createClient(
  "https://xrttxrisvsolsscmubbn.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const rows = []; let row = [], field = "", inQuotes = false;
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
  const i = headers.findIndex(h => h.replace(/﻿/g, "").trim() === name);
  return i >= 0 ? (row[i] ?? "").trim() : "";
}

const rows = parseCSV(readFileSync(CSV_PATH, "utf-8"));
const headers = rows[0];
const data = rows.slice(1).filter(r => r.some(f => f));

let updated = 0, skipped = 0;

for (const row of data) {
  const email = col(headers, row, "E-mail").toLowerCase().trim();
  const submissionDate = col(headers, row, "Submission Date");
  if (!email || !submissionDate) { skipped++; continue; }

  const parsed = new Date(submissionDate);
  if (isNaN(parsed.getTime())) {
    console.log(`– ${email}: couldn't parse date "${submissionDate}"`);
    skipped++; continue;
  }

  const { error } = await supabase
    .from("applications")
    .update({ created_at: parsed.toISOString() })
    .eq("email", email);

  if (error) {
    console.error(`✗ ${email}:`, error.message);
    skipped++;
  } else {
    console.log(`✓ ${email} → ${parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`);
    updated++;
  }
}

console.log(`\nDone. ${updated} updated, ${skipped} skipped.`);
