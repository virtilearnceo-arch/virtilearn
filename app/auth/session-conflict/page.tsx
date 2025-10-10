"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SessionConflictPage() {
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

        if (handled) return; // prevent double execution

        const handleConflict = async () => {
            // Step 0: fetch current session ID from Supabase for this user
            const { data: existingUser } = await supabase
                .from("users")
                .select("current_session_id, role")
                .eq("id", userId)
                .maybeSingle();

            if (!existingUser) {
                router.replace("/auth/login");
                return;
            }

            // ✅ If sessionId matches current_session_id, redirect directly
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
                            // Update Supabase session ID
                            await supabase
                                .from("users")
                                .update({ current_session_id: sessionId })
                                .eq("id", userId);

                            // Update local storage
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

    return <p className="text-center mt-10">Checking session...</p>;
}
