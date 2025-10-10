"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function SignUpForm() {
  const supabase = createClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) return setError("Passwords do not match");

    setIsLoading(true);
    setError(null);

    // 1️⃣ Check in `users` table if email exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      setError("This email is already registered. Please login instead.");
      setIsLoading(false);
      return;
    }

    // 2️⃣ Try to sign up with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup-success-page`,
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(signUpError.message);
      }
      setIsLoading(false);
      return;
    }

    if (!signUpData.user?.id) {
      setError("User ID not found after signup.");
      setIsLoading(false);
      return;
    }

    // 3️⃣ Insert into your custom users table
    await supabase.from("users").insert({
      id: signUpData.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      role: "student",
    });

    setIsLoading(false);
    router.push("/auth/sign-up-success");
  };


  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }, // points to new route.ts
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col gap-6 p-8 rounded-3xl
                 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50
                 shadow-2xl dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950
                 transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
          Sign Up for VirtiLearn
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Create your account and start your learning journey
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="repeatPassword">Repeat Password</Label>
          <Input
            id="repeatPassword"
            type="password"
            placeholder="********"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full py-3 text-lg font-bold">
          {isLoading ? "Creating..." : "Sign Up"}
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-3 text-sm text-gray-500 bg-white dark:bg-neutral-900 px-2">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>


        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1h-9.33v2.89h5.41c-.23 1.28-1.49 3.73-5.41 3.73-3.25 0-5.9-2.68-5.9-5.99s2.65-5.99 5.9-5.99c1.85 0 3.1.8 3.81 1.49l2.61-2.52c-1.64-1.52-3.78-2.42-6.42-2.42-5.3 0-9.6 4.29-9.6 9.55s4.3 9.55 9.6 9.55c5.55 0 9.22-3.9 9.22-9.36 0-.63-.06-1.11-.15-1.5z" />
          </svg>
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline text-yellow-500 hover:text-yellow-600">
          Login
        </Link>
      </p>
    </form>
  );
}
