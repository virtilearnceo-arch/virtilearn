"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import {
    BookOpen,

    Zap,
    Rocket,
    GraduationCap,
    UserCheck,
    Clock,
} from "lucide-react";
import { IconFileCertificate } from "@tabler/icons-react";


// Circle Node
const GradientCircle = forwardRef<
    HTMLDivElement,
    { icon: React.ReactNode; label: string; className?: string; }
>(({ icon, label, className }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-violet-500 to-purple-700 p-[2px] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                className
            )}
        >
            {/* Inner circle */}
            {/* Inner circle */}
            <div
                className={cn(
                    "flex h-full w-full flex-col items-center justify-center rounded-full gap-1 text-white",
                    "bg-gradient-to-tr from-pink-300 via-violet-400 to-purple-500",
                    "shadow-[0_0_8px_rgba(236,72,153,0.25),0_0_16px_rgba(139,92,246,0.2)]",
                    "animate-pulse-slow"
                )}
            >
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-semibold tracking-wide">{label}</span>
            </div>

        </div>
    );
});
GradientCircle.displayName = "GradientCircle";

export function WhyChooseUs() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Node refs
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div className="relative flex w-full flex-col items-center py-20">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                ⚡ Why Choose{" "}
                <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                    VirtiLearn
                </span>
                ?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl">
                The <b>future-ready internship platform</b> you’ve been waiting for.
            </p>

            {/* Beam Container */}
            <div
                className="relative flex h-[380px] w-full items-center justify-center overflow-hidden"
                ref={containerRef}
            >
                <div className="flex size-full max-h-[320px] max-w-3xl flex-col items-stretch justify-between gap-16">
                    <div className="flex flex-row items-center justify-between">
                        <GradientCircle ref={div1Ref} icon={<BookOpen />} label="Projects" />
                        <GradientCircle ref={div5Ref} icon={<IconFileCertificate />} label="Certs" />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <GradientCircle ref={div2Ref} icon={<Zap />} label="Industry" />
                        <GradientCircle
                            ref={div4Ref}
                            icon={<Rocket />}
                            label="VirtiLearn"
                            className="h-28 w-28 shadow-2xl"
                        />
                        <GradientCircle ref={div6Ref} icon={<UserCheck />} label="Mentor" />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <GradientCircle ref={div3Ref} icon={<GraduationCap />} label="LOR" />
                        <GradientCircle ref={div7Ref} icon={<Clock />} label="Flexible" />
                    </div>
                </div>

                {/* Beams */}
                <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} />
                <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
                <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
                <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} reverse />
                <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
                <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={75} endYOffset={10} reverse />
            </div>
        </div>
    );
}

// extra CSS for slow pulsing glow
// Add to globals.css
/*
*/
