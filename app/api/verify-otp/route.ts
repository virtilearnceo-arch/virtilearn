import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json();
    if (!userId || !otp) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const supabase = await createClient();

    const { data } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) return NextResponse.json({ error: "OTP not found" }, { status: 400 });

    const now = new Date();
    if (data.otp !== otp || new Date(data.expires_at) < now) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Delete used OTP
    await supabase.from("otp_codes").delete().eq("user_id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "OTP verification failed" }, { status: 500 });
  }
}
