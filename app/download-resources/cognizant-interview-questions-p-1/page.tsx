"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, YoutubeIcon } from "lucide-react";

export default function DownloadGate() {
    const [leftAt, setLeftAt] = useState<number | null>(null);
    const [unlocked, setUnlocked] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        const handleVisibility = () => {
            if (!document.hidden && leftAt) {
                const timeAway = (Date.now() - leftAt) / 1000;
                if (timeAway >= 30) {
                    unlockDownload();
                } else {
                    const remaining = 30 - timeAway;
                    setCountdown(Math.ceil(remaining));
                    const timer = setTimeout(() => {
                        unlockDownload();
                    }, remaining * 1000);
                    return () => clearTimeout(timer);
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [leftAt]);

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const interval = setInterval(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [countdown]);

    const unlockDownload = () => {
        setUnlocked(true);
        setCountdown(null);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    };

    const buttonClasses =
        "w-full text-lg flex items-center justify-center gap-2 font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 dark:from-zinc-900 via-gray-200 dark:via-zinc-800 to-gray-100 dark:to-black text-gray-900 dark:text-white p-4 sm:p-6 transition-colors duration-500">
            <Card className="w-full max-w-md sm:max-w-lg shadow-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/90 backdrop-blur-md transition-colors duration-500">
                <CardContent className="p-6 sm:p-8 text-center space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-2"
                    >
                        🚀 Skillveta Download Gate
                    </motion.h1>

                    {/* YT Thumbnail Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="overflow-hidden rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-zinc-700"
                    >
                        <img
                            src="https://dhyeneqgxucokgtxiyaj.supabase.co/storage/v1/object/public/youtube-recourses/Cognizant%20Interview%20Experience.png"
                            alt="YouTube Thumbnail"
                            className="w-full h-auto object-cover"
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-base sm:text-lg text-gray-700 dark:text-gray-300"
                    >
                        Subscribe to our YouTube channel 🎥 to unlock your PDF 📂
                    </motion.p>

                    {!unlocked ? (
                        <>
                            <Button
                                onClick={() => {
                                    setLeftAt(Date.now());
                                    window.open("https://www.youtube.com/@OffCampusHiringUpdates", "_blank");
                                }}
                                size="lg"
                                className={`${buttonClasses} bg-gradient-to-r from-pink-500 via-red-600 to-yellow-500 text-white shadow-xl hover:from-yellow-500 hover:via-pink-500 hover:to-red-600 dark:from-pink-600 dark:via-red-700 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:via-pink-600 dark:hover:to-red-700 ring-2 ring-pink-400 hover:ring-pink-300 transition-all duration-500 text-sm sm:text-lg`}
                            >
                                <YoutubeIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" /> Go to Channel & Subscribe
                            </Button>

                            {countdown !== null && (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                    ⏳ Unlocking in {countdown}s ...
                                </p>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 120 }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className={`${buttonClasses} bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-500 dark:via-green-600 dark:to-green-700 text-white flex gap-2 items-center justify-center text-sm sm:text-lg`}
                            >
                                <a href="https://dhyeneqgxucokgtxiyaj.supabase.co/storage/v1/object/public/youtube-recourses/Cognizant_Interview_Questions_Off-Campus-Hiring-Updates.pdf" download>
                                    <Download className="w-5 h-5 sm:w-6 sm:h-6" /> Download PDF 🎉
                                </a>
                            </Button>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
