"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

export function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");

  // Redirect user based on role
  const redirectUserByRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data?.role) {
      toast.error(error?.message || "Role not found");
      return;
    }

    if (data.role === "admin") router.push("/admin/dashboard");
    else router.push("/courses");
  };

  // handleLogin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1️⃣ Check if email exists in your users table
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (!userData?.id) {
        setError("Invalid credentials");
        return;
      }

      setUserId(userData.id);

      // 2️⃣ Send OTP
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, userId: userData.id }),
      }).then((r) => r.json());

      if (res.error) {
        setError(res.error);
        return;
      }

      setOtpDialogOpen(true);
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return; // keep dialog open
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ userId, otp, email, password }),
      }).then((r) => r.json());

      if (res.error) {
        // ❌ OTP verification failed
        toast.error(res.error || "Incorrect OTP. Please try again.");
        return; // keep dialog open
      }

      // ✅ Now try signing in the user with email & password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user?.id) {
        // ❌ Password or login failed
        toast.error(error?.message || "Login failed after OTP. Try again.");
        return; // keep dialog open
      }

      // ✅ Success: redirect user
      await redirectUserByRole(data.user.id);

      // ✅ Only close OTP dialog on full success
      setOtpDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
      // ❌ Keep dialog open
    } finally {
      setIsLoading(false);
    }
  };






  // Google login (direct)
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
    if (error) toast.error(error.message);
    setIsLoading(false);
  };

  return (
    <>
      {/* Login Form */}
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

      {/* OTP Dialog */}
      <AlertDialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <AlertDialogTrigger asChild>
          <span />
        </AlertDialogTrigger>

        <AlertDialogContent className="w-[95%] max-w-sm sm:max-w-md mx-auto rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xl backdrop-blur-lg animate-in fade-in-0 zoom-in-95 flex flex-col items-center justify-center text-center">
          <AlertDialogHeader className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500 flex items-center justify-center rounded-full shadow-sm">
              🔒
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Verify Your OTP
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
              Enter the 6-digit code sent to your email.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-center mt-6 mb-6 w-full">
            <div className="flex flex-col items-center space-y-4 w-full">
              <InputOTP
                maxLength={6}
                onComplete={(val: string) => {
                  console.log("OTP typed by user:", val); // <-- log OTP input
                  setOtp(val);
                }}
                className="flex justify-center gap-3 sm:gap-4"
              >
                <InputOTPGroup className="flex gap-3 sm:gap-4">
                  {[0, 1, 2].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-200 ease-in-out shadow-sm hover:border-yellow-300 dark:hover:border-yellow-500"
                    />
                  ))}
                </InputOTPGroup>

                <InputOTPSeparator className="w-3 sm:w-4" />

                <InputOTPGroup className="flex gap-3 sm:gap-4">
                  {[3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-200 ease-in-out shadow-sm hover:border-yellow-300 dark:hover:border-yellow-500"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <AlertDialogFooter className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                console.log("OTP sent for verification:", otp);
                handleVerifyOtp();
              }}
              className="w-full py-3 text-base sm:text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:opacity-90 text-white rounded-xl shadow-md transition-all"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <AlertDialogCancel
              onClick={() => setOtpDialogOpen(false)}
              className="w-full py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all text-gray-700 dark:text-gray-300"
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}
