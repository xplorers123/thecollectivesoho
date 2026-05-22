import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email, brandName } = await req.json();
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !brandName) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  // Re-verify approval server-side
  const { data } = await supabaseAdmin
    .from("approved_vendors")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "This email isn't on our approved list." }, { status: 403 });
  }

  const client = await clerkClient();

  try {
    await client.users.createUser({
      emailAddress: [normalizedEmail],
      unsafeMetadata: { brandName },
      skipPasswordRequirement: true,
    });
  } catch (err: any) {
    const code = err?.errors?.[0]?.code;
    if (code === "form_identifier_exists") {
      // User already exists — update their brand name and continue
      try {
        const existing = await client.users.getUserList({ emailAddress: [normalizedEmail] });
        if (existing.data[0]) {
          await client.users.updateUserMetadata(existing.data[0].id, {
            unsafeMetadata: { brandName },
          });
        }
      } catch {}
    } else {
      return NextResponse.json(
        { error: err?.errors?.[0]?.longMessage ?? "Could not create account." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
