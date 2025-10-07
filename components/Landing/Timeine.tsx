/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Highlighter } from "../magicui/highlighter";



export function InternshipFlow() {
    const data = [
        {
            title: (
                <>
                    Step 1 · <AuroraText>Enroll</AuroraText>
                </>

            ),
            content: (
                <div>
                    <h2 className="mb-10 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
                        Join <AuroraText>VirtiLearn Internship Program</AuroraText> 🚀 and unlock access to premium resources, mentors, and community.
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/images/login_page.png"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/signup_page.png"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/hey_page.png"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/hero_page.png"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: (
                <>
                    Step 2 ·<AuroraText>  Learn </AuroraText></>
            ),
            content: (
                <div>
                    <h2 className="mb-10 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
                        Learn <AuroraText>industry-relevant skills</AuroraText> through structured self-paced modules and mentorship sessions 📚

                    </h2>
                    <h2 className="mb-10 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
                        Interactive lessons, real-world insights, and guided learning paths ensure you gain <AuroraText>practical knowledge.</AuroraText>

                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/images/course_learn.png"
                            alt="hero template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/course_preview_learn.png"
                            alt="feature template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/learn_learn.png"
                            alt="bento template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/completed_learn.png"
                            alt="cards template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: (
                <>
                    Step 3 · <AuroraText>Projects & Certification</AuroraText>
                </>
            ),
            content: (
                <div>
                    <h2 className="mb-10 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
                        Work on real-world projects, attempt quizzes, and complete assignments to solidify your skills 💻
                    </h2>
                    <div className="mb-10 space-y-3">
                        <div className="flex items-center gap-3 text-sm md:text-base font-medium">
                            <span className="text-pink-500 text-lg">🚀</span>
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Industry-level project with <span className="font-semibold text-purple-600 dark:text-purple-400">installation guide</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm md:text-base font-medium">
                            <span className="text-violet-500 text-lg">🎓</span>
                            <span className="text-neutral-800 dark:text-neutral-200">
                                <span className="font-semibold text-violet-600 dark:text-violet-400">Premium certificate</span> on completion
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm md:text-base font-medium">
                            <span className="text-indigo-500 text-lg">🏅</span>
                            <span className="text-neutral-800 dark:text-neutral-200">
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Letter of Recommendation</span> (LOR) for top performers
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm md:text-base font-medium">
                            <span className="text-pink-400 text-lg">💼</span>
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Portfolio-ready <span className="font-semibold text-pink-600 dark:text-pink-400">deliverables</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/images/project_page.png"
                            alt="hero template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/certification_download.png"
                            alt="feature template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/certifiction_page.png"
                            alt="bento template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/verify_project.png"
                            alt="cards template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        }, {
            title: (
                <>
                    Step 4 ·<AuroraText>Boost Career</AuroraText>
                </>
            ),
            content: (
                <div>
                    <h2 className="mb-10 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
                        Showcase your skills with confidence, backed by   <Highlighter action="underline" color="#FF9800">
                            real projects </Highlighter>{" "},  <Highlighter action="highlight" color="#87CEFA">
                            certificates
                        </Highlighter>{" "}, and LORs
                        🚀


                    </h2>
                    <h2 className="mb-10 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
                        Stand out to recruiters and open doors to top <AuroraText>internships</AuroraText> and <AuroraText>full-time opportunities.</AuroraText>
                    </h2>


                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/images/career_page1.png"
                            alt="hero template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/career_page2.png"
                            alt="feature template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/career_page3.png"
                            alt="bento template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                        <img
                            src="/images/career_page4.png"
                            alt="cards template"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="relative w-full overflow-clip">
            <Timeline data={data} />
        </div>
    );
}
