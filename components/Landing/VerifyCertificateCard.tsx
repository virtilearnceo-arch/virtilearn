/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Lens } from "@/components/magicui/lens";
import Link from "next/link";

export default function VerifyCertificateCard() {
    return (
        <section className="w-full flex flex-col md:flex-row items-center justify-between py-24 px-6 md:px-12 gap-12 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">

            {/* Left: Image with Lens effect */}
            <div className="flex-1 flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://dhyeneqgxucokgtxiyaj.supabase.co/storage/v1/object/public/certificates/verification_certificate.png"
                    alt="Certificate Preview"
                    width={500}
                    height={500}
                    className="rounded-2xl shadow-2xl object-cover"
                    draggable={false} // 🚫 disable drag
                    onContextMenu={(e) => e.preventDefault()} // 🚫 disable right-click

                />
            </div>

            {/* Right: Text + CTA */}
            <div className="flex-1 flex flex-col justify-center gap-6 max-w-xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
                    🎓 Verify Your Certificate
                </h2>
                <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300">
                    Every certificate issued by VirtiLearn is QR-enabled and fully verifiable. Ensure authenticity and share your achievements with confidence.
                </p>
                <Link href="/verify-certificate" >
                    <Button className="mt-4 w-max px-8 py-4 bg-yellow-400/90 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-lg transition-all text-lg">
                        Verify Certificate
                    </Button>
                </Link>
            </div>
        </section>
    );
}
