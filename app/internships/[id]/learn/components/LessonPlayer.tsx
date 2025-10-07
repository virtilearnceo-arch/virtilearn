/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";


export default function InternshipLessonPlayer({
    tab,
    sections,
    progress,
    setProgress,
    userInternshipId,
    onSelectTab,
    onCompleteSection,
    getSectionOfTab,   // <-- add here

    getNextTab,
    onStartFinalExam,
}: {
    tab: any;
    sections: any[];
    progress: Record<string, boolean>;
    setProgress: (p: Record<string, boolean>) => void;
    userInternshipId: string | null;
    onSelectTab: (tab: any) => void;
    getSectionOfTab: (tabId: string) => any | null; // <-- add this

    onCompleteSection: (sectionIndex: number) => void;
    getNextTab: (
        tabId: string
    ) => { next: any | null; isLastInSection: boolean; sectionIndex: number; };
    onStartFinalExam: any;
}) {
    const supabase = createClient();
    const [internshipCompleted, setInternshipCompleted] = useState(false);
    const [finalTestGiven, setFinalTestGiven] = useState(false);

    useEffect(() => {
        const checkCompletion = async () => {
            if (!userInternshipId) return;

            // check status
            const { data: ui } = await supabase
                .from("user_internships")
                .select("status")
                .eq("id", userInternshipId)
                .single();

            if (ui?.status === "completed") setInternshipCompleted(true);

            // check final test attempt
            const { data: attempt } = await supabase
                .from("internship_quiz_attempts")
                .select("id")
                .eq("user_internship_id", userInternshipId)
                .eq("is_final", true)
                .maybeSingle();

            if (attempt) setFinalTestGiven(true);
        };

        checkCompletion();
    }, [userInternshipId]);

    const handleSave = async () => {
        if (progress?.[tab.id]) return;

        await supabase.from("internship_progress").insert({
            user_internship_id: userInternshipId,
            section_id: tab.section_id ?? null,
            subsection_id: tab.subsection_id ?? null,
            tab_id: tab.id,
            is_completed: true,
            completed_at: new Date().toISOString(),
        });

        setProgress({ ...progress, [tab.id]: true });
    };

    const handleBack = () => {
        let foundPrev: any = null;

        for (let si = 0; si < sections.length; si++) {
            const subs = sections[si].internship_subsections ?? [];
            for (let ssi = 0; ssi < subs.length; ssi++) {
                const tabs = subs[ssi].internship_tabs ?? [];
                for (let ti = 0; ti < tabs.length; ti++) {
                    if (tabs[ti].id === tab.id) {
                        // Case 1: Previous tab in same subsection
                        if (ti - 1 >= 0) {
                            foundPrev = tabs[ti - 1];
                        }
                        // Case 2: No prev tab, go to previous subsection’s last tab
                        else if (ssi - 1 >= 0) {
                            const prevTabs = subs[ssi - 1].internship_tabs ?? [];
                            foundPrev = prevTabs[prevTabs.length - 1] ?? null;
                        }
                        // Case 3: No prev subsection, go to previous section’s last tab
                        else if (si - 1 >= 0) {
                            const prevSubs = sections[si - 1].internship_subsections ?? [];
                            if (prevSubs.length > 0) {
                                const lastSub = prevSubs[prevSubs.length - 1];
                                const lastTabs = lastSub.internship_tabs ?? [];
                                foundPrev = lastTabs[lastTabs.length - 1] ?? null;
                            }
                        }
                        break;
                    }
                }
            }
        }

        if (foundPrev) {
            onSelectTab(foundPrev);
        }
    };


    const handleNext = async () => {
        if (!progress?.[tab.id]) {
            await handleSave();
        }

        const { next, isLastInSection, sectionIndex } = getNextTab(tab.id);

        if (next) {
            onSelectTab(next);
            return;
        }

        if (isLastInSection) {
            onCompleteSection(sectionIndex);
        }
    };

    // ---- Button Logic ----
    const { next, isLastInSection, sectionIndex } = getNextTab(tab.id);
    const isLastSection = sectionIndex === sections.length - 1;
    const isLastTab = !next && isLastInSection && isLastSection;

    let showFinalExam =
        isLastTab && !finalTestGiven && !internshipCompleted;

    return (
        <div className="p-6 max-w-5xl mx-auto w-full">
            {/* Title */}
            <h1 className="text-3xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                {tab?.title}
            </h1>

            {/* Content */}
            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-[0.95rem]">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                >
                    {tab?.content || "🚀 Select a lesson to begin."}
                </ReactMarkdown>
            </div>

            {/* Footer Navigation */}
            <div className="mt-10 flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-lg shadow-sm"
                >
                    ← Back
                </Button>

                <div className="flex gap-3">
                    {/* Start Final Exam */}
                    {showFinalExam && !internshipCompleted && (
                        <Button
                            onClick={onStartFinalExam}
                            className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 
        hover:from-pink-600 hover:to-rose-700 text-white shadow-md transition"
                        >
                            🚀 Start Final Exam
                        </Button>
                    )}


                    {/* Next Button */}
                    <Button
                        onClick={handleNext}
                        disabled={isLastTab} // ✅ disable in very last tab
                        className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                            hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition disabled:opacity-50"
                    >
                        {progress?.[tab.id] ? "Next →" : "Save & Continue →"}
                    </Button>
                </div>
            </div>

            {/* Certificate Card */}
            {internshipCompleted && (
                <div className="mt-12 p-6 border rounded-2xl shadow-lg bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-800/40">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                        🎉 Internship Completed!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Well done, legend 🚀 Your final certificate awaits you.
                    </p>
                    <Button
                        onClick={() =>
                            (window.location.href = `/internships/${userInternshipId}/completed`)
                        }
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 
                            hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition"
                    >
                        Download Certificate →
                    </Button>
                </div>
            )}
        </div>
    );
}
