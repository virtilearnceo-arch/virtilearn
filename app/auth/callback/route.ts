import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/auth/signup-success-page";

  if (!next.startsWith("/")) next = "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();

  // Exchange the OAuth code for a session
  const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !data.session?.user) {
    console.error("OAuth exchange error:", sessionError);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = data.session.user;

  // Generate session ID for this device
  const newSessionId = uuidv4();

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingUser) {
    // Insert new user with session ID
    await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
      last_name: user.user_metadata?.full_name?.split(" ")[1] || "",
      role: "student",
      profile_picture: user.user_metadata?.avatar_url || "",
      current_session_id: newSessionId,
    });

    localStorage.setItem("session_id", newSessionId);

    return NextResponse.redirect(`${origin}/auth/signup-success-page`);
  } else {
    // Update session ID for existing user
    await supabase
      .from("users")
      .update({ current_session_id: newSessionId })
      .eq("id", user.id);

    localStorage.setItem("session_id", newSessionId);

    return NextResponse.redirect(`${origin}/`);
  }
}
