import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { AVAILABLE_BOOTHS } from "@/lib/booking-utils";

export async function POST(req: NextRequest) {
  const { type, startDate, endDate, soldOut } = await req.json();
  if (!type || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Remove any existing overrides for this slot
  await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("vendor_clerk_id", "admin_override")
    .eq("booking_type", type)
    .eq("start_date", startDate);

  if (soldOut) {
    // Insert enough override bookings to fill all spots
    const overrides = Array.from({ length: AVAILABLE_BOOTHS }, () => ({
      vendor_clerk_id: "admin_override",
      vendor_email: "admin@popupcollectivenyc.com",
      brand_name: "__sold_out__",
      booking_type: type,
      start_date: startDate,
      end_date: endDate,
      price_cents: 0,
      status: "confirmed",
    }));
    await supabaseAdmin.from("bookings").insert(overrides);
  }

  return NextResponse.json({ ok: true });
}
