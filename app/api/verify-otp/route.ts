import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { userId, otp } = body;

    if (!userId || !otp) {
      console.log("Missing userId or OTP");
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch OTP record from database
    const { data: otpRecord, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("otp", otp)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Database error while verifying OTP" },
        { status: 500 }
      );
    }

    if (!otpRecord) {
      console.log("No matching OTP found");
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    const now = new Date();
    if (new Date(otpRecord.expires_at) < now) {
      console.log("OTP expired:", otpRecord.expires_at, "current time:", now);
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Optional: Delete OTP after successful verification
    await supabase
      .from("otp_codes")
      .delete()
      .eq("user_id", userId)
      .eq("otp", otp);

    console.log("OTP verified successfully for userId:", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
