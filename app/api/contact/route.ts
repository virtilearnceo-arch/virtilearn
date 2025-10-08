import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/ContactEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // --- Insert into Supabase ---
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // --- Send Email ---
    const { error: emailError } = await resend.emails.send({
      from: "VirtiLearn Team <contact@virtilearn.in>",
      to: ["virtilearn@gmail.com"],
      subject: `New Contact Form Submission from VirtiLearn ${name}`,
      react: ContactEmailTemplate({ type: "contact", name, email, message }),
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: emailError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
