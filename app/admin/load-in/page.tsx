import { supabaseAdmin } from "@/lib/supabase-admin";
import LoadInForm from "./LoadInForm";

export const metadata = { title: "Load-In Email — Admin" };

export default async function LoadInPage() {
  const today = new Date().toISOString().split("T")[0];

  // Get upcoming confirmed bookings + join first_name from applications
  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("id, brand_name, vendor_email, booking_type, start_date, end_date")
    .eq("status", "confirmed")
    .gte("end_date", today)
    .order("start_date", { ascending: true });

  // Pull first names from applications table
  const emails = (bookings ?? []).map((b) => b.vendor_email);
  const { data: apps } = await supabaseAdmin
    .from("applications")
    .select("email, first_name")
    .in("email", emails);

  const nameMap: Record<string, string> = {};
  for (const a of apps ?? []) nameMap[a.email] = a.first_name ?? "";

  const enriched = (bookings ?? []).map((b) => ({
    ...b,
    first_name: nameMap[b.vendor_email] ?? "",
  }));

  return (
    <div className="px-8 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium">Load-In Email</h1>
        <p className="text-sm text-muted mt-1">
          Select vendors, assign them to a time slot, and send load-in details in one click.
        </p>
      </div>
      <LoadInForm bookings={enriched} />
    </div>
  );
}
