import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import LoadInForm from "./LoadInForm";

export const metadata = { title: "Load-In Email — Admin" };

export default async function LoadInPage() {
  const today = new Date().toISOString().split("T")[0];

  // Fetch all upcoming confirmed bookings
  const { data: allUpcoming, error: upcomingErr } = await supabaseAdmin
    .from("bookings")
    .select("id, brand_name, vendor_email, booking_type, start_date, end_date, load_in_sent_at")
    .eq("status", "confirmed")
    .gte("start_date", today)
    .order("start_date", { ascending: true });

  // If load_in_sent_at column doesn't exist yet, fall back without it
  const { data: fallback } = upcomingErr
    ? await supabaseAdmin
        .from("bookings")
        .select("id, brand_name, vendor_email, booking_type, start_date, end_date")
        .eq("status", "confirmed")
        .gte("start_date", today)
        .order("start_date", { ascending: true })
    : { data: null };

  const combinedUpcoming = (allUpcoming ?? fallback ?? []) as Array<{
    id: string; brand_name: string; vendor_email: string; booking_type: string;
    start_date: string; end_date: string; load_in_sent_at?: string | null;
  }>;

  const upcomingRaw = combinedUpcoming.filter((b) => !b.load_in_sent_at);

  // Sent: load_in_sent_at is set (only if column exists)
  const { data: sentRaw } = upcomingErr ? { data: [] } : await supabaseAdmin
    .from("bookings")
    .select("id, brand_name, vendor_email, booking_type, start_date, end_date, load_in_sent_at")
    .eq("status", "confirmed")
    .not("load_in_sent_at", "is", null)
    .order("load_in_sent_at", { ascending: false });

  // Pull first names from applications table
  const allBookings = [...(upcomingRaw ?? []), ...(sentRaw ?? [])];
  const emails = allBookings.map((b) => b.vendor_email);
  const { data: apps } = await supabaseAdmin
    .from("applications")
    .select("email, first_name")
    .in("email", emails);

  const nameMap: Record<string, string> = {};
  for (const a of apps ?? []) nameMap[a.email] = a.first_name ?? "";

  const enrich = (b: typeof allBookings[0]) => ({ ...b, first_name: nameMap[b.vendor_email] ?? "" });

  return (
    <div className="px-8 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium">Load-In Email</h1>
        <p className="text-sm text-muted mt-1">
          Select vendors, assign them to a time slot, and send load-in details in one click.
        </p>
      </div>
      <Suspense>
        <LoadInForm upcoming={(upcomingRaw ?? []).map(enrich)} sent={(sentRaw ?? []).map(enrich)} />
      </Suspense>
    </div>
  );
}
