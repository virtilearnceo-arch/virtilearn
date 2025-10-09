import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = await createClient(); // ✅ add await
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user_id,
    course_id,
    amount,
      coupon_id, // <-- new

  } = body;

  // ✅ Verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  // ✅ Insert purchase
  const { error: purchaseError } = await supabase.from("purchases").insert({
    user_id,
    course_id,
    amount,
      coupon_id, // ✅ store applied coupon (can be null if no coupon)
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: "completed",
 
  });

  if (purchaseError) {
    console.error("Purchase insert failed:", purchaseError);
    return NextResponse.json({ success: false, error: purchaseError.message }, { status: 500 });
  }

  // ✅ Update course count + enroll user
  await supabase.rpc("increment_course_purchase", { course_uuid: course_id });
  await supabase.rpc("enroll_user_in_course", { u_id: user_id, c_id: course_id });

  // ✅ Fetch user + course details for email
  const { data: user } = await supabase.from("users").select("*").eq("id", user_id).single();
  const { data: course } = await supabase.from("courses").select("*").eq("id", course_id).single();

  if (user?.email && course) {
    try {
     await resend.emails.send({
  from: "VirtiLearn Team <team@virtilearn.in>",
  to: user.email,
  subject: `Enrollment Confirmed: ${course.name}`,
  react: EmailTemplate({
    type: "course",               // ✅ new prop
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    title: course.name,            // ✅ renamed from courseName
    description: course.description,
    duration: course.duration || "Self-paced",
    language: course.language || "English",
    amount,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    appUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}/learn`,
  }),
});

    } catch (err) {
      console.error("Email send failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
