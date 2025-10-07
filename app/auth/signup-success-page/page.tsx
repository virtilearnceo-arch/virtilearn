"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Mail, Star } from "lucide-react";

export default function SignUpSuccessPage() {
    const router = useRouter();
    const supabase = createClient();
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState<"admin" | "student">("student");

    useEffect(() => {
        triggerConfetti();
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data, error } = await supabase
                .from("users")
                .select("first_name, role")
                .eq("id", user.id)
                .single();

            if (!error && data) {
                setUserName(data.first_name || "Friend");
                setRole(data.role || "student");
            }
        }
    };

    const triggerConfetti = () => {
        const end = Date.now() + 2 * 1000;
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;
            confetti({ particleCount: 2, angle: 60, spread: 55, startVelocity: 60, origin: { x: 0, y: 0.5 }, colors });
            confetti({ particleCount: 2, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.5 }, colors });
            requestAnimationFrame(frame);
        };

        frame();
    };

    const handleGoToDashboard = () => {
        router.push(role === "admin" ? "/admin/dashboard" : "/courses");
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-black p-6 md:p-10">
            <div className="w-full max-w-md">
                <Card className="relative rounded-3xl shadow-2xl border-none overflow-hidden">
                    {/* Animated gradient blur top-right */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 opacity-30 blur-3xl animate-pulse"></div>

                    <CardHeader className="relative text-center pt-12">
                        <div className="flex justify-center mb-4">
                            <Star className="w-12 h-12 text-yellow-500 dark:text-yellow-400 animate-bounce" />
                        </div>
                        <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                            👋 Hey {userName}!
                        </CardTitle>
                        <CardDescription className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-2">
                            Thank you for signing up 🎉
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative text-center mt-6 space-y-6">
                        <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg">
                            ✅ Welcome onboard! Your account has been created successfully.
                            You can now go to your dashboard and get started.
                        </p>

                        <Button
                            onClick={handleGoToDashboard}
                            className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black dark:text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Go to {role === "admin" ? "Admin" : "Student"} Dashboard
                        </Button>
                    </CardContent>

                    {/* Animated gradient blur bottom-left */}
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 opacity-30 blur-3xl animate-pulse"></div>
                </Card>
            </div>
        </div>
    );
}
