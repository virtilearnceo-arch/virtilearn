// app/auth/session-conflict/SessionConflictClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SessionConflictClient() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    const userId = searchParams.get("userId");
    const sessionId = searchParams.get("sessionId");

    const [handled, setHandled] = useState(false);

    useEffect(() => {
        if (!userId || !sessionId) {
            router.replace("/auth/login");
            return;
        }

        if (handled) return;

        const handleConflict = async () => {
            // Fetch current session and role from Supabase
            const { data: existingUser } = await supabase
                .from("users")
                .select("current_session_id, role")
                .eq("id", userId)
                .maybeSingle();

            if (!existingUser) {
                router.replace("/auth/login");
                return;
            }

            // ✅ If session matches, redirect immediately
            if (existingUser.current_session_id === sessionId) {
                if (existingUser.role === "admin") router.replace("/admin/dashboard");
                else router.replace("/courses");
                return;
            }

            // Otherwise, show Sonner toast for conflict
            toast(
                "You are already logged in on another device. Click 'Continue' to log out from there and continue here.",
                {
                    duration: 20000, // 20 seconds
                    action: {
                        label: "Continue",
                        onClick: async () => {
                            // Update session ID in Supabase
                            await supabase
                                .from("users")
                                .update({ current_session_id: sessionId })
                                .eq("id", userId);

                            // Save session locally
                            localStorage.setItem("session_id", sessionId);

                            // Redirect based on role
                            if (existingUser.role === "admin") router.replace("/admin/dashboard");
                            else router.replace("/courses");
                        },
                    },
                }
            );

            setHandled(true);
        };

        handleConflict();
    }, [handled, router, supabase, userId, sessionId]);

    return (
        <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
            Checking session...
        </p>
    );
}
