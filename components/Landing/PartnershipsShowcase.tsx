"use client";

import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

const partnerLogos = [
    "https://dhyeneqgxucokgtxiyaj.supabase.co/storage/v1/object/public/avatars/iso_logo-final.png",
    "https://dhyeneqgxucokgtxiyaj.supabase.co/storage/v1/object/public/avatars/msme-logo.png",
    "https://dhyeneqgxucokgtxiyaj.supabase.co/storage/v1/object/public/avatars/nvdia-images-final.png",
    // add more logos here
];

export default function PartnershipsShowcase() {
    return (
        <section className="w-full py-20 px-4 md:px-12 text-center relative">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                🤝{" "}
                <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-transparent bg-clip-text">
                    Approved & Trusted Partners
                </span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-lg max-w-3xl mx-auto mb-12">
                Endorsed collaborations with top startups and companies, ensuring premium opportunities for our students.
            </p>

            <div className="relative flex flex-col gap-6 overflow-hidden">
                <Marquee pauseOnHover className="[--duration:12s]">
                    {partnerLogos.map((logo, idx) => (
                        <div key={idx} className="mx-4 sm:mx-6 flex items-center justify-center">
                            <Image
                                src={logo}
                                alt={`Partner logo ${idx + 1}`}
                                width={80} // smaller for mobile
                                height={80}
                                className="h-12 sm:h-16 w-auto object-contain filter  transition-all duration-300"
                            />
                        </div>
                    ))}
                </Marquee>

                {/* Gradient masks */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 sm:w-1/6 bg-gradient-to-r from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 sm:w-1/6 bg-gradient-to-l from-background"></div>
            </div>
        </section>
    );
}
