"use client";

import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const geistSans = Geist({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});

export default function NotFound() {
    return (
        <div
            className={`${geistSans.className} flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white p-8`}
        >
            <div className="max-w-xl text-center bg-white rounded-2xl shadow-lg p-12">
                <h1 className="text-4xl font-bold text-orange-600 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-700 mb-6">
                    Oops! The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link href="/" passHref>
                    <Button variant="default">Go to Homepage</Button>
                </Link>
            </div>
            <div className="mt-12 text-gray-300 text-xs">
                &copy; {new Date().getFullYear()} VirtiLearn. All rights reserved.
            </div>
        </div>
    );
}
