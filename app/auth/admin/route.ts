import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// CREATE USER (you can keep POST if needed)
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "POST is active." });
}

// UPDATE USER ROLE
export async function PUT(request: NextRequest) {
  const { id, role } = await request.json();
  const supabase = await createClient();

  const { error: userError } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id);

  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: { role },
  });

  if (userError || authError) {
    return NextResponse.json(
      { error: userError?.message || authError?.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

// DELETE USER
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const supabase = await createClient();

  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
