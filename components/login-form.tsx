"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ redirect user based on role
  const redirectUserByRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setError("Error fetching role: " + error.message);
      setIsLoading(false);
      return;
    }

    if (!data?.role) {
      setError("Role not found. Please contact support.");
      setIsLoading(false);
      return;
    }

    if (data.role === "admin") router.push("/admin/dashboard");
    else router.push("/courses");
  };

  // ✅ login handler with single-session enforcement using Sonner
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Step 1: Try Supabase auth login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    const user = signInData.user;
    if (!user?.id) {
      setError("Login failed. User not found.");
      setIsLoading(false);
      return;
    }

    // Step 2: Fetch or insert user record
    const { data: existingUser, error: userFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (userFetchError) {
      setError("Error fetching user: " + userFetchError.message);
      setIsLoading(false);
      return;
    }

    if (!existingUser) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        role: "student",
        first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
        last_name: user.user_metadata?.full_name?.split(" ")[1] || "",
        profile_picture: user.user_metadata?.avatar_url || "",
      });
    }

    // Step 3: Generate session ID for this device
    const newSessionId = uuidv4();
    const localSessionId = localStorage.getItem("session_id");

    // Step 4: Handle session conflicts
    if (existingUser?.current_session_id && existingUser.current_session_id !== localSessionId) {
      // Session is on a different device
      toast(
        "You are already logged in on another device. Click 'Continue' to log out from there and continue here.",
        {
          duration: 20000, // 20 seconds
          action: {
            label: "Continue",
            onClick: async () => {
              await supabase
                .from("users")
                .update({ current_session_id: newSessionId })
                .eq("id", user.id);

              localStorage.setItem("session_id", newSessionId);

              await redirectUserByRole(user.id);
              setIsLoading(false);
            },
          },
        }
      );

      setIsLoading(false);
      return;
    } else {
      // ✅ No conflict or same device login
      await supabase
        .from("users")
        .update({ current_session_id: newSessionId })
        .eq("id", user.id);

      localStorage.setItem("session_id", newSessionId);
    }
    // Step 5: Redirect based on role
    await redirectUserByRole(user.id);
    setIsLoading(false);
  };


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-6 p-8 rounded-3xl bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 shadow-2xl dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
    >
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
          Login to VirtiLearn
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Enter your credentials to continue your learning journey.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm underline text-yellow-500 hover:text-yellow-600"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full py-3 text-lg font-bold">
          {isLoading ? "Loading..." : "Login"}
        </Button>

        <div className="relative text-center text-sm text-gray-500 my-2 before:content-[''] before:block before:h-px before:bg-gray-300 before:absolute before:left-0 before:right-0 before:top-1/2 after:content-[''] after:block after:h-px after:bg-gray-300 after:absolute after:left-0 after:right-0 after:top-1/2">
          <span className="relative px-2 bg-white dark:bg-neutral-900 text-gray-500">
            Or continue with
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1h-9.33v2.89h5.41c-.23 1.28-1.49 3.73-5.41 3.73-3.25 0-5.9-2.68-5.9-5.99s2.65-5.99 5.9-5.99c1.85 0 3.1.8 3.81 1.49l2.61-2.52c-1.64-1.52-3.78-2.42-6.42-2.42-5.3 0-9.6 4.29-9.6 9.55s4.3 9.55 9.6 9.55c5.55 0 9.22-3.9 9.22-9.36 0-.63-.06-1.11-.15-1.5z" />
          </svg>
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="underline text-yellow-500 hover:text-yellow-600"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
