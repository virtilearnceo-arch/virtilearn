// app/(dashboard)/internships/[id]/learn/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./components/Sidebar";
import LessonPlayer from "./components/LessonPlayer";
import FinalExam from "./components/Quiz";
import { Loader2 } from "lucide-react";

export default function InternshipLearnPage() {
    const { id } = useParams<{ id: string; }>();
    const supabase = createClient();

    const [sections, setSections] = useState<any[]>([]);
    const [progress, setProgress] = useState<Record<string, boolean>>({});
    const [currentTab, setCurrentTab] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const [userId, setUserId] = useState<string | null>(null);
    const [userInternshipId, setUserInternshipId] = useState<string | null>(null);

    const [finalExamQuestions, setFinalExamQuestions] = useState<any[]>([]);
    const [finalAttempt, setFinalAttempt] = useState<{
        obtained_score: number;
        total_score: number;
        is_passed: boolean;
        attempted_at: string;
    } | null>(null);
    const [showFinalExam, setShowFinalExam] = useState(false);

    // ---------- helpers (unchanged) ----------
    const findSectionOfTab = useCallback(
        (tabId: string) => {
            for (const section of sections) {
                for (const ss of section.internship_subsections ?? []) {
                    if ((ss.internship_tabs ?? []).some((t: any) => t.id === tabId)) {
                        return section;
                    }
                }
            }
            return null;
        },
        [sections]
    );

    const getNextTab = useCallback(
        (tabId: string) => {
            for (let si = 0; si < sections.length; si++) {
                const section = sections[si];
                const subs = section.internship_subsections ?? [];
                for (let ssi = 0; ssi < subs.length; ssi++) {
                    const tabs = subs[ssi]?.internship_tabs ?? [];
                    for (let ti = 0; ti < tabs.length; ti++) {
                        if (tabs[ti].id === tabId) {
                            if (ti + 1 < tabs.length) {
                                return { next: tabs[ti + 1], isLastInSection: false, sectionIndex: si } as const;
                            }
                            if (ssi + 1 < subs.length) {
                                const next = subs[ssi + 1]?.internship_tabs?.[0] ?? null;
                                if (next) return { next, isLastInSection: false, sectionIndex: si } as const;
                            }
                            return { next: null, isLastInSection: true, sectionIndex: si } as const;
                        }
                    }
                }
            }
            return { next: null, isLastInSection: false, sectionIndex: -1 } as const;
        },
        [sections]
    );

    const getFirstTabOfSection = useCallback(
        (sectionIndex: number) =>
            sections?.[sectionIndex]?.internship_subsections?.[0]?.internship_tabs?.[0] ?? null,
        [sections]
    );

    const getFirstTabOfNextSection = useCallback(
        (sectionIndex: number) => {
            if (sectionIndex + 1 >= sections.length) return null;
            return getFirstTabOfSection(sectionIndex + 1);
        },
        [sections, getFirstTabOfSection]
    );

    const allTabs: any[] = useMemo(() => {
        const acc: any[] = [];
        sections.forEach((s) =>
            s.internship_subsections?.forEach((ss: any) =>
                ss.internship_tabs?.forEach((t: any) => acc.push(t))
            )
        );
        return acc;
    }, [sections]);

    const allContentCompleted = useMemo(() => {
        if (!allTabs.length) return false;
        return allTabs.every((t) => progress?.[t.id]);
    }, [allTabs, progress]);

    // ---------- fetch (unchanged) ----------
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         const {
    //             data: { user },
    //         } = await supabase.auth.getUser();
    //         if (!user) return setLoading(false);

    //         setUserId(user.id);
    //         const { data: userInternships } = await supabase
    //             .from("user_internships")
    //             .select("id")
    //             .eq("internship_id", id)
    //             .eq("user_id", user.id)
    //             .single();
    //         if (!userInternships) return setLoading(false);
    //         setUserInternshipId(userInternships.id);

    //         const { data: sectionsData } = await supabase
    //             .from("internship_sections")
    //             .select(`
    //       id, title, "order",
    //       internship_subsections (
    //         id, title, "order",
    //         internship_tabs (id, title, "order", content)
    //       )
    //     `)
    //             .eq("internship_id", id)
    //             .order("order", { ascending: true });

    //         sectionsData?.forEach((s: any) => {
    //             s.internship_subsections?.sort((a: any, b: any) => a.order - b.order);
    //             s.internship_subsections?.forEach((ss: any) =>
    //                 ss.internship_tabs?.sort((a: any, b: any) => a.order - b.order)
    //             );
    //         });
    //         setSections(sectionsData || []);

    //         const { data: progressData } = await supabase
    //             .from("internship_progress")
    //             .select("tab_id, is_completed")
    //             .eq("user_internship_id", userInternships.id);

    //         const progressMap: Record<string, boolean> = {};
    //         progressData?.forEach((p) => (progressMap[p.tab_id] = p.is_completed));
    //         setProgress(progressMap);

    //         const { data: finalQs } = await supabase
    //             .from("internship_final_quizzes")
    //             .select("id, question, options, correct_answer, marks, explanation")
    //             .eq("internship_id", id);
    //         setFinalExamQuestions(finalQs || []);

    //         const { data: attempt } = await supabase
    //             .from("internship_final_quiz_attempts")
    //             .select("obtained_score, total_score, is_passed, attempted_at")
    //             .eq("user_id", user.id)
    //             .eq("internship_id", id)
    //             .maybeSingle();
    //         setFinalAttempt(attempt ?? null);

    //         if (sectionsData?.length) {
    //             const firstTab =
    //                 sectionsData[0]?.internship_subsections?.[0]?.internship_tabs?.[0];
    //             setCurrentTab(firstTab ?? null);
    //         }
    //         setLoading(false);
    //     };
    //     fetchData();
    // }, [id, supabase]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1️⃣ Get user
            const {
                data: { user },
            } = await supabase.auth.getUser();
            console.log("User fetched:", user);
            if (!user) return setLoading(false);

            setUserId(user.id);

            // 2️⃣ Get user internship
            const { data: userInternships } = await supabase
                .from("user_internships")
                .select("id")
                .eq("internship_id", id)
                .eq("user_id", user.id)
                .single();
            console.log("User internship:", userInternships);
            if (!userInternships) return setLoading(false);
            setUserInternshipId(userInternships.id);

            // 3️⃣ Get sections + subsections + tabs
            const { data: sectionsData, error } = await supabase
                .from("internship_sections")
                .select(`
                id, title, "order",
                internship_subsections (
                    id, title, "order",
                    internship_tabs (id, title, "order", content)
                )
            `)
                .eq("internship_id", id)
                .order("order", { ascending: true });
            console.log("Sections fetched:", sectionsData, "Error:", error);

            if (sectionsData) {
                // Sort subsections and tabs
                sectionsData.forEach((s: any) => {
                    s.internship_subsections?.sort((a: any, b: any) => a.order - b.order);
                    s.internship_subsections?.forEach((ss: any) => {
                        ss.internship_tabs?.sort((a: any, b: any) => a.order - b.order);
                    });
                });
                setSections(sectionsData);
            }

            // 4️⃣ Get progress
            const { data: progressData } = await supabase
                .from("internship_progress")
                .select("tab_id, is_completed")
                .eq("user_internship_id", userInternships.id);
            console.log("Progress fetched:", progressData);

            const progressMap: Record<string, boolean> = {};
            progressData?.forEach((p) => (progressMap[p.tab_id] = p.is_completed));
            setProgress(progressMap);

            // 5️⃣ Get final exam questions
            const { data: finalQs } = await supabase
                .from("internship_final_quizzes")
                .select("id, question, options, correct_answer, marks, explanation")
                .eq("internship_id", id);
            console.log("Final exam questions:", finalQs);
            setFinalExamQuestions(finalQs || []);

            // 6️⃣ Get final attempt
            const { data: attempt } = await supabase
                .from("internship_final_quiz_attempts")
                .select("obtained_score, total_score, is_passed, attempted_at")
                .eq("user_id", user.id)
                .eq("internship_id", id)
                .maybeSingle();
            console.log("Final exam attempt:", attempt);
            setFinalAttempt(attempt ?? null);

            // 7️⃣ Set first available tab
            const getFirstTab = (sections: any[]) => {
                for (const s of sections) {
                    for (const ss of s.internship_subsections ?? []) {
                        const tab = ss.internship_tabs?.[0];
                        if (tab) return tab;
                    }
                }
                return null;
            };
            const firstTab = getFirstTab(sectionsData || []);
            console.log("First tab:", firstTab);
            setCurrentTab(firstTab);

            setLoading(false);
        };

        fetchData();
    }, [id, supabase]);


    const handleCompleteSection = useCallback(
        (sectionIndex: number) => {
            const nextTab = getFirstTabOfNextSection(sectionIndex);
            if (nextTab) return setCurrentTab(nextTab);
            if (finalExamQuestions?.length && !finalAttempt?.is_passed) {
                setCurrentTab(null);
                setShowFinalExam(true);
                return;
            }
            setShowFinalExam(false);
            setCurrentTab(null);
        },
        [getFirstTabOfNextSection, finalExamQuestions?.length, finalAttempt?.is_passed]
    );

    const handleFinalExamComplete = useCallback((payload: {
        obtained: number;
        total: number;
        passed: boolean;
    }) => {
        setFinalAttempt({
            obtained_score: payload.obtained,
            total_score: payload.total,
            is_passed: payload.passed,
            attempted_at: new Date().toISOString(),
        });
        setShowFinalExam(false);
    }, []);

    const sidebarProps = useMemo(
        () => ({
            sections,
            progress,
            onSelectTab: (tab: any) => {
                setShowFinalExam(false);
                setCurrentTab(tab);
            },
            finalExam: {
                available: finalExamQuestions.length > 0,
                unlocked: allContentCompleted,  // <-- must be true when all tabs done
                passed: !!finalAttempt?.is_passed,
                onOpen: () => {
                    if (!allContentCompleted || !finalExamQuestions.length) return;
                    setCurrentTab(null);
                    setShowFinalExam(true);
                },
            },
        }),
        [sections, progress, finalExamQuestions.length, allContentCompleted, finalAttempt?.is_passed]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
                    <p className="text-lg font-semibold tracking-wide animate-pulse">
                        Loading your internship...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
            {/* Sidebar (desktop inline + mobile drawer) */}
            <Sidebar {...sidebarProps} />

            {/* Main Content */}
            <main
                className="
          flex-1 flex flex-col
          transition-all duration-300 ease-in-out
          p-4 md:p-8 overflow-y-auto relative
        "
            >
                {/* Title Banner */}
                <div className="sticky top-0 z-20 mb-6 backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-gray-200 dark:border-neutral-800 py-4 px-6 rounded-2xl shadow-md">
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                        🚀 Internship Learning
                    </h1>
                </div>

                {/* Lesson / Exam Player */}
                <div
                    className="
            flex-1 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-800
            bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl p-6
            transition-all duration-300 ease-in-out hover:shadow-purple-500/30
          "
                >
                    {showFinalExam ? (
                        <FinalExam
                            questions={finalExamQuestions}
                            userId={userId}
                            internshipId={typeof id === "string" ? id : String(id)}
                            hasAttempt={!!finalAttempt}
                            onComplete={handleFinalExamComplete}
                        />
                    ) : currentTab ? (
                        <LessonPlayer
                            tab={currentTab}
                            sections={sections}
                            progress={progress}
                            setProgress={setProgress}
                            userInternshipId={userInternshipId}
                            onSelectTab={setCurrentTab}
                            onCompleteSection={(sectionIndex) => handleCompleteSection(sectionIndex)}
                            getNextTab={getNextTab}
                            getSectionOfTab={findSectionOfTab}
                            onStartFinalExam={() => {
                                setShowFinalExam(true);         // show quiz
                                setCurrentTab(null);            // hide lesson tabs
                            }}

                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-lg md:text-xl font-semibold text-purple-600 dark:text-purple-400 animate-pulse">
                            {finalAttempt?.is_passed
                                ? "🎉 Final exam cleared! Time to move to the project."
                                : "Pick a lesson to start learning 🚀"}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
