import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/auth/auth-code-error`);

  const supabase = await createClient();

  // Exchange OAuth code for Supabase session
  const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
  if (sessionError || !data.session?.user) {
    console.error("OAuth exchange error:", sessionError);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = data.session.user;

  // Fetch existing user
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Try to get session_id from cookie
  const cookieSessionId = request.headers.get("cookie")?.match(/session_id=([^;]+)/)?.[1];

  // If user has a session cookie matching their current session, reuse it
  const newSessionId = cookieSessionId || uuidv4();

  if (!existingUser) {
    // Insert new user with session
    await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
      last_name: user.user_metadata?.full_name?.split(" ")[1] || "",
      role: "student",
      profile_picture: user.user_metadata?.avatar_url || "",
      current_session_id: newSessionId,
    });

    const response = NextResponse.redirect(`${origin}/auth/signup-success-page`);
    response.cookies.set("session_id", newSessionId, { path: "/" });
    return response;
  }

  // Existing user: only redirect to conflict page if this session is different from stored session
  if (existingUser.current_session_id && existingUser.current_session_id !== newSessionId) {
    return NextResponse.redirect(
      `${origin}/auth/session-conflict?userId=${user.id}&sessionId=${newSessionId}`
    );
  }

  // Same device: update session (or just keep same session)
  await supabase
    .from("users")
    .update({ current_session_id: newSessionId })
    .eq("id", user.id);

  const response = NextResponse.redirect(`${origin}/courses`); // redirect normally
  response.cookies.set("session_id", newSessionId, { path: "/" });
  return response;
}
