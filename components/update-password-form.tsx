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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // 👈 import toast

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success("✅ Password updated successfully!"); // 👈 success toast
      router.push("/account"); // 👈 redirect to /account
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error instanceof Error ? error.message : "An error occurred"); // 👈 error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card
        className="w-full border border-indigo-200/20 
             bg-gradient-to-br from-indigo-50 via-white to-pink-50 
             dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950/40
             shadow-sm rounded-2xl"
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-300">
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       focus:border-indigo-400 focus:ring focus:ring-indigo-200/50"
                />
              </div>

              {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

              <Button
                type="submit"
                className="w-full rounded-xl 
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white shadow 
                     hover:from-purple-700 hover:to-pink-700 
                     transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save new password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
