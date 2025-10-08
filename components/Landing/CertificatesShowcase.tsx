"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BorderBeam } from "@/components/magicui/border-beam";

export function CertificateCard({
    type,
    img,
}: {
    type: "Course" | "Internship";
    img: string;
}) {
    const vibeLines = [
        "Premium. Verified. Unstoppable.",
        "Not just a certificate — a badge of excellence.",
        "Proof of skills. Proof of grit.",
        "Your work. Your legacy. Immortalized.",
        "Earned with hustle. Backed with trust.",
    ];

    const [randomLine, setRandomLine] = useState(vibeLines[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * vibeLines.length);
        setRandomLine(vibeLines[randomIndex]);

        const interval = setInterval(() => {
            const newIndex = Math.floor(Math.random() * vibeLines.length);
            setRandomLine(vibeLines[newIndex]);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative group rounded-2xl overflow-hidden border border-yellow-500/50 shadow-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/30 w-full max-w-lg">
            {/* Certificate Image */}
            <Image
                src={img}
                alt={`${type} Certificate`}
                width={800}
                height={600}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                draggable={false}
            />

            {/* Hover overlay line */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xl md:text-2xl font-extrabold text-yellow-300 drop-shadow-lg tracking-wide text-center px-4">
                    🚀 {randomLine}
                </p>
            </div>

            {/* Floating badge */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                🎓 Premium {type}
            </div>

            {/* Beam effect */}
            <BorderBeam
                duration={6}
                size={500}
                borderWidth={3}
                className="from-transparent via-yellow-500 to-transparent"
            />
        </div>
    );
}

export default function CertificatesShowcase() {
    return (
        <section className="max-w-7xl mx-auto py-20 px-6 md:px-12 text-center">
            {/* Section Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                🏆{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
                    Premium Certificates
                </span>
            </h2>

            {/* Subtitle */}
            <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg max-w-3xl mx-auto mb-14 leading-relaxed">
                Each certificate comes with a <span className="font-semibold text-yellow-500">unique Verification code</span> 🔗,
                verifiable directly on our website ✅, designed to be{" "}
                <span className="font-semibold text-orange-500">showcased on LinkedIn</span> 💼
                and recognized globally 🌍.
            </p>

            {/* Certificates Grid */}
            <div className="grid gap-12 md:gap-16 md:grid-cols-2 place-items-center">
                <CertificateCard
                    type="Course"
                    img="https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Course_Sample_Certificate.png"
                />
                <CertificateCard
                    type="Internship"
                    img="https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Internship_Sample_Certificate.png"
                />
            </div>
        </section>
    );
}
