import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const DESTINATIONS: Record<string, string> = {
  weekend: "/dashboard/book/weekend",
  weekly:  "/dashboard/book/weekly",
  apply:   "/apply",
};

const SITE = process.env.NEXT_PUBLIC_URL ?? "https://popupcollectivenyc.com";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campaign = searchParams.get("c") ?? "unknown";
  const link     = searchParams.get("l") ?? "unknown";

  // Log click — fire and forget, never block the redirect
  supabaseAdmin.from("email_clicks").insert({ campaign, link }).then(() => {});

  const dest = DESTINATIONS[link] ?? "/";
  return NextResponse.redirect(`${SITE}${dest}`, { status: 302 });
}
