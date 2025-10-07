"use client";

import {
    AnimatedSpan,
    Terminal,
    TypingAnimation,
} from "@/components/magicui/terminal";
import Link from "next/link";

export default function TerminalCareerDemo() {
    return (
        <section className="w-full flex flex-col md:flex-row items-center justify-center py-24 px-6 md:px-12 gap-12 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">

            {/* Left: Terminal */}
            <div className="flex-1 w-full max-w-xl overflow-x-hidden">
                <Terminal className="h-[600px] overflow-hidden break-words">
                    <TypingAnimation>&gt; VirtiLearn apply --internship</TypingAnimation>

                    <AnimatedSpan className="text-green-500">
                        <span>✔ Application received.</span>
                    </AnimatedSpan>

                    <AnimatedSpan className="text-green-500">
                        <span>✔ Profile verified & background checks done.</span>
                    </AnimatedSpan>

                    <AnimatedSpan className="text-yellow-400">
                        <span>✨ Unlocking premium learning path...</span>
                    </AnimatedSpan>

                    <AnimatedSpan className="text-cyan-400">
                        <span>🎓 Certificate generation ready (QR-enabled & LinkedIn shareable)</span>
                    </AnimatedSpan>

                    <AnimatedSpan className="text-purple-400">
                        <span>💼 Assigning mentor & connecting with real startups...</span>
                    </AnimatedSpan>

                    <TypingAnimation className="text-muted-foreground mt-4">
                        Success! Your journey to a high-impact career begins now.
                    </TypingAnimation>

                    <TypingAnimation className="text-muted-foreground">
                        Next step: Click the button to start your internship.
                    </TypingAnimation>
                </Terminal>
            </div>

            {/* Right: Motivational / CTA */}
            <div className="flex-1 flex flex-col justify-center text-left gap-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
                    🚀 Launch Your Career
                </h2>
                <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-md">
                    Apply, learn, and grow with VirtiLearn’s hands-on internships. Build projects, earn premium certificates, and connect with mentors from top startups.
                </p>

                <Link href={"/internships"} >
                    <button className="mt-4 w-max px-8 py-4 bg-yellow-400/90 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-lg transition-all text-lg">

                        Start My Internship Now
                    </button>
                </Link>

            </div>
        </section>
    );
}
