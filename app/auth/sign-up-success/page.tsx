"use client";

import { Highlighter } from "@/components/magicui/highlighter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950 p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden rounded-3xl shadow-2xl border-none">
          {/* Decorative top accent */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
          <CardHeader className="relative text-center pt-12">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-yellow-500 dark:text-yellow-400 animate-bounce" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Thank you for signing up!
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-2">
              Confirm your account via email
            </CardDescription>
          </CardHeader>
          <CardContent className="relative text-center mt-6">
            <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg">
              ✅ You&apos;ve successfully signed up.
              <br />
              📬 Please check your inbox and click the confirmation link to activate your account.
            </p>
            <p className="text-red-600 dark:text-red-400 mt-4 italic">
              Tip: If you don&apos;t see it, check your          <Highlighter action="highlight" color="#87CEFA">
                spam
              </Highlighter>{" "} or promotions folder.
            </p>
          </CardContent>
          {/* Decorative bottom accent */}
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        </Card>
      </div>
    </div>
  );
}
