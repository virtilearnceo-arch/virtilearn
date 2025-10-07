"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import {
    Award,
    Briefcase,
    Clock,
    Rocket,
    BookOpen,
    Trophy,
} from "lucide-react";

interface Item {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const valueProps: Item[] = [
    {
        title: "Hands-on Projects",
        description: "Industry-level, fully working projects with guidebooks.",
        icon: <Briefcase className="size-5" />,
        color: "from-pink-500/90 to-violet-500/90",
    },
    {
        title: "Premium Certificates",
        description: "Certificates + LOR for top performers, backed by experts.",
        icon: <Award className="size-5" />,
        color: "from-violet-500/90 to-indigo-500/90",
    },
    {
        title: "Flexible & Self-Paced",
        description: "Learn anytime, anywhere with no rigid schedules.",
        icon: <Clock className="size-5" />,
        color: "from-purple-500/90 to-pink-500/90",
    },
    {
        title: "Expert Mentorship",
        description: "1:1 guidance, not just courses — real career support.",
        icon: <Rocket className="size-5" />,
        color: "from-fuchsia-500/90 to-purple-500/90",
    },
    {
        title: "Bonus Resources",
        description: "Installation guides, eBooks & insider career tips.",
        icon: <BookOpen className="size-5" />,
        color: "from-pink-400/90 to-violet-400/90",
    },
    {
        title: "Career Boost",
        description: "Portfolio-ready projects that make recruiters notice.",
        icon: <Trophy className="size-5" />,
        color: "from-indigo-500/90 to-pink-500/90",
    },
];

const ValueCard = ({ title, description, icon, color }: Item) => {
    return (
        <figure
            className={cn(
                "relative mx-auto w-full max-w-[420px] cursor-pointer overflow-hidden rounded-2xl p-5",
                "transition-all duration-300 ease-in-out hover:scale-[102%]",
                "bg-white/90 dark:bg-white/5 backdrop-blur-md",
                "shadow-[0_2px_12px_rgba(0,0,0,.08),0_8px_24px_rgba(0,0,0,.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,.4)]"
            )}
        >
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "flex size-12 items-center justify-center rounded-xl text-white shadow-lg",
                        "bg-gradient-to-r",
                        color
                    )}
                >
                    {icon}
                </div>
                <div className="flex flex-col">
                    <figcaption className="text-base sm:text-lg font-semibold dark:text-white">
                        {title}
                    </figcaption>
                    <p className="text-sm text-gray-600 dark:text-white/60 leading-snug">
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    );
};

export function WhyChooseSkillveta({ className }: { className?: string; }) {
    return (
        <section
            className={cn(
                "relative flex flex-col items-center justify-center w-full py-16 px-4",
                "bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-black",
                className
            )}
        >
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                🎯 Why Choose <span className="font-extrabold">VirtiLearn</span>
            </h2>

            {/* Animated List */}
            <div className="relative w-full max-w-2xl">
                <AnimatedList>
                    {valueProps.map((item, idx) => (
                        <ValueCard {...item} key={idx} />
                    ))}
                </AnimatedList>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-background"></div>
        </section>
    );
}
