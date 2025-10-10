import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { OtpEmailTemplate } from "@/components/OtpEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();
    if (!email || !userId) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const supabase = await createClient();

    await supabase.from("otp_codes").upsert([{ user_id: userId, otp, expires_at: new Date(Date.now() + 5 * 60 * 1000) }]);

    await resend.emails.send({
      from: "VirtiLearn Team <contact@virtilearn.in>",
      to: [email],
      subject: "Your VirtiLearn OTP",
      react: OtpEmailTemplate({ otp, email }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
