/* eslint-disable @next/next/no-img-element */
"use client";


import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { Highlighter } from "../magicui/highlighter";

export function HeroSectionOne() {
    return (
        <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
            <Navbar />
            {/* Decorative Borders */}
            <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>

            <BackgroundBeamsWithCollision>
                <div className="flex flex-col">
                    {/* Headline */}
                    <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-extrabold text-slate-800 md:text-4xl lg:text-7xl dark:text-slate-200  ">
                        {"Future-Proof Your Career with Real-World Internships"
                            .split(" ")
                            .map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                        ease: "easeInOut",
                                    }}
                                    className="mr-2 inline-block"
                                >
                                    {word}
                                </motion.span>
                            ))}
                    </h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-medium text-neutral-700 dark:text-neutral-400"
                    >
                        Stop wasting time on outdated “courses.” Build real projects, gain
                        in-demand skills, and earn certifications that actually matter.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1 }}
                        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="/auth/login">
                            <button className="w-60 transform rounded-lg bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:from-violet-500 dark:via-fuchsia-400 dark:to-pink-400">
                                Start Your Journey
                            </button>
                        </Link>

                        <Link href="/internships">
                            <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-black shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                                Explore Internships
                            </button>
                        </Link>
                    </motion.div>

                </div>
            </BackgroundBeamsWithCollision>

            <div className="px-4 py-10 md:py-20">


                {/* Social Proof / Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
                        <img
                            src="/images/hero_image.png"
                            alt="Internship platform preview"
                            className="aspect-[16/9] h-auto w-full object-cover"
                            height={1000}
                            width={1000}
                        />
                    </div>
                    <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                        Trusted by students placed at{" "}
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            <Highlighter action="highlight" color="#FF9800" >MNC&apos;s{' '}</Highlighter>
                        </span>{'  '}

                        <span> & more...</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

const Navbar = () => {
    return (
        <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800
                        -mt-8 md:mt-0"> {/* <-- move up on mobile, reset on md+ */}
            <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                <h1 className="text-base font-bold tracking-tight md:text-2xl">
                    VirtiLearn
                </h1>
            </div>
        </nav>
    );
};
