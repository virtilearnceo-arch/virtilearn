"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center min-h-[70vh] px-4",
        className
      )}
      {...props}
    >
      {success ? (
        <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Password reset instructions have been sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              If you registered with this email, you will receive a password
              reset link shortly. Please check your inbox and spam folder.
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Note: It may take up to <strong>5 minutes</strong> for the email to arrive.
              If you don’t receive it, please try again after 5 minutes.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-block py-2 px-6 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-md transition-all"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        // ...rest of your existing code

        <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white rounded-xl shadow-md hover:opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="underline text-yellow-500 hover:text-yellow-600"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
