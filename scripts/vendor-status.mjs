// Shows registration status for all approved vendors.
// Usage: SUPABASE_SERVICE_ROLE_KEY=... CLERK_SECRET_KEY=sk_live_... node scripts/vendor-status.mjs

import { createClient } from "@supabase/supabase-js";
import { createClerkClient } from "@clerk/backend";

const supabase = createClient(
  "https://xrttxrisvsolsscmubbn.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Get all approved applications
const { data: approved } = await supabase
  .from("applications")
  .select("first_name, last_name, email, brand_name, approved_at")
  .eq("status", "approved")
  .order("approved_at", { ascending: false });

if (!approved?.length) {
  console.log("No approved vendors found.");
  process.exit(0);
}

const registered = [];
const notRegistered = [];

for (const vendor of approved) {
  const { data: users } = await clerk.users.getUserList({ emailAddress: [vendor.email] });
  const user = users?.[0];
  const hasLoggedIn = user && user.lastSignInAt !== null;

  const entry = {
    name: `${vendor.first_name} ${vendor.last_name}`,
    brand: vendor.brand_name,
    email: vendor.email,
    approvedAt: vendor.approved_at ? new Date(vendor.approved_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
    lastLogin: user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null,
  };

  if (hasLoggedIn) registered.push(entry);
  else notRegistered.push(entry);
}

console.log(`\n✅ REGISTERED (${registered.length})`);
console.log("─".repeat(70));
for (const v of registered) {
  console.log(`  ${v.name} — ${v.brand}`);
  console.log(`  ${v.email} · Last login: ${v.lastLogin}`);
  console.log();
}

console.log(`\n⏳ NOT YET REGISTERED (${notRegistered.length})`);
console.log("─".repeat(70));
for (const v of notRegistered) {
  console.log(`  ${v.name} — ${v.brand}`);
  console.log(`  ${v.email} · Approved: ${v.approvedAt}`);
  console.log();
}

console.log(`\nSummary: ${registered.length} registered, ${notRegistered.length} pending`);
