"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SessionConflictPage() {
    const supabase = createClient();
    const router = useRouter();
    const [handled, setHandled] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const userId = searchParams.get("userId");
        const sessionId = searchParams.get("sessionId");

        if (!userId || !sessionId) {
            router.replace("/auth/login");
            return;
        }

        if (handled) return;

        const handleConflict = async () => {
            // Fetch current session and role
            const { data: existingUser } = await supabase
                .from("users")
                .select("current_session_id, role")
                .eq("id", userId)
                .maybeSingle();

            if (!existingUser) {
                router.replace("/auth/login");
                return;
            }

            // ✅ Direct redirect if session matches
            if (existingUser.current_session_id === sessionId) {
                if (existingUser.role === "admin") router.replace("/admin/dashboard");
                else router.replace("/courses");
                return;
            }

            // Show Sonner toast for conflict
            toast(
                "You are already logged in on another device. Click 'Continue' to log out from there and continue here.",
                {
                    duration: 20000, // 20 seconds
                    action: {
                        label: "Continue",
                        onClick: async () => {
                            // Update Supabase session ID
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
    }, [handled, router, supabase]);

    return (
        <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
            Checking session...
        </p>
    );
}
