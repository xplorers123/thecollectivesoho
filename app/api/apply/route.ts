import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  // TODO: wire up email (Resend) + database (Supabase) — for now just log.
  console.log("New vendor application:", data);
  return NextResponse.json({ ok: true });
}
