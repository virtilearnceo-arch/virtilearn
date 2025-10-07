"use client";

import { useEffect } from "react";
import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const geistSans = Geist({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});

export default function GlobalError({ error }: { error: Error; }) {
    useEffect(() => {
        console.error("Global error caught:", error);
    }, [error]);

    return (
        <div
            className={`${geistSans.className} flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white p-8`}
        >
            <div className="max-w-xl text-center bg-white rounded-2xl shadow-lg p-12">
                <h1 className="text-4xl font-bold text-orange-600 mb-4">Oops! Something went wrong</h1>
                <p className="text-gray-700 mb-6">
                    We’re experiencing technical issues. Please try again later or go back to the homepage.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/" passHref>
                        <Button variant="default">Go to Homepage</Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
                <div className="mt-6 text-gray-400 text-sm">
                    Error details: {error.message}
                </div>
            </div>
            <div className="mt-12 text-gray-300 text-xs">
                &copy; {new Date().getFullYear()} VirtiLearn. All rights reserved.
            </div>
        </div>
    );
}
