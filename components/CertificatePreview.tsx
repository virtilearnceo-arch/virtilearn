"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CertificatePreview() {
    const vibeLines = [
        "Your grind, your glory. This certificate seals it.",
        "Proof of mastery. Not just paper, but power.",
        "Earn skills, flex credentials.",
        "Knowledge is temporary, certificates are forever.",
        "Learn hard. Earn harder. This is your badge of honor.",
    ];

    const [randomLine, setRandomLine] = useState(vibeLines[0]);

    useEffect(() => {
        // Pick a random line initially
        const randomIndex = Math.floor(Math.random() * vibeLines.length);
        setRandomLine(vibeLines[randomIndex]);

        // Change every 10 seconds
        const interval = setInterval(() => {
            const newIndex = Math.floor(Math.random() * vibeLines.length);
            setRandomLine(vibeLines[newIndex]);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative group mt-8 rounded-2xl overflow-hidden border border-yellow-400/50 shadow-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/30 select-none">
            <Image
                src="https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Course_Sample_Certificate.png"
                alt="Sample Certificate"
                width={800}
                height={600}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none" // 🚫 disable right-click save
                draggable={false} // 🚫 disable drag
            />

            {/* Overlay vibe line */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xl md:text-2xl font-extrabold text-yellow-300 drop-shadow-lg tracking-wide text-center px-4">
                    🚀 {randomLine}
                </p>
            </div>

            {/* Floating badge */}
            <div className="absolute top-3 left-3 bg-yellow-400/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                🎓 Sample Certificate
            </div>
        </div>
    );
}
