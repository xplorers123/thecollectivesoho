import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email) return NextResponse.json({ approved: false });

  const { data } = await supabaseAdmin
    .from("approved_vendors")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return NextResponse.json({ approved: !!data });
}
