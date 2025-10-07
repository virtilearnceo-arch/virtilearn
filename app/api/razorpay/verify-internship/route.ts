import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = await createClient(); // 👈 await here
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user_id,
    internship_id,
    amount,
    coupon_id,
  } = body;

  // ✅ Verify Razorpay signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  // ✅ Insert internship purchase
  const { error: purchaseError } = await supabase.from("internship_purchases").insert({
    user_id,
    internship_id,
    amount,
    coupon_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: "completed",

  });

  if (purchaseError) {
    console.error("Internship purchase insert failed:", purchaseError);
    return NextResponse.json({ success: false, error: purchaseError.message }, { status: 500 });
  }

  // ✅ Update internship count
  const { error: countError } = await supabase.rpc("increment_internship_purchase", {
    internship_uuid: internship_id,
  });

  if (countError) {
    console.error("increment_internship_purchase failed:", countError);
  }
// ✅ Enroll user (includes updating users.enrolled_internships inside RPC)
// ✅ Enroll user (includes updating users.enrolled_internships inside RPC)
const { error: enrollError } = await supabase.rpc("enroll_user_in_internship", {
  u_id: user_id,
  i_id: internship_id,
});

if (enrollError) {
  console.error("RPC enroll_user_in_internship failed:", enrollError);

  // fallback: direct insert into user_internships
  const { error: directInsertError } = await supabase
    .from("user_internships")
    .insert({ user_id, internship_id });

  if (directInsertError) {
    console.error("Direct insert into user_internships failed:", directInsertError);
  }

  // ✅ fallback: update users.enrolled_internships manually
  const { data: userData, error: userFetchError } = await supabase
    .from("users")
    .select("enrolled_internships")
    .eq("id", user_id)
    .single();

  if (userFetchError) {
    console.error("Fetch user enrolled_internships failed:", userFetchError);
  } else {
    const currentInternships = userData?.enrolled_internships || [];
    const updatedInternships = [...new Set([...currentInternships, internship_id])];

    const { error: directUpdateError } = await supabase
      .from("users")
      .update({ enrolled_internships: updatedInternships })
      .eq("id", user_id);

    if (directUpdateError) {
      console.error("Direct update enrolled_internships failed:", directUpdateError);
    }
  }
}

  // ✅ Fetch user + internship details for email
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  const { data: internship } = await supabase
    .from("internships")
    .select("*")
    .eq("id", internship_id)
    .single();

  if (user?.email && internship) {
    try {
    await resend.emails.send({
  from: "Skillveta <no-reply@skillveta.in>",
  to: user.email,
  subject: `🎉 Enrollment Confirmed: ${internship.title}`,
  react: EmailTemplate({
    type: "internship",           // ✅ new prop
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    title: internship.title,       // ✅ renamed from courseName
    description: internship.description,
    duration: internship.duration || "Flexible",
    language: internship.language || "English",
    amount,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    appUrl: `${process.env.NEXT_PUBLIC_APP_URL}/internships/${internship.id}/learn`,
  }),
});

    } catch (err) {
      console.error("Email send failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
