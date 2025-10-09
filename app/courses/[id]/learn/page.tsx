/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./components/Sidebar";
import LessonPlayer from "./components/LessonPlayer";
import Quiz from "./components/Quiz";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


export default function LearnPage() {
    const { id } = useParams();
    const supabase = createClient();
    const [course, setCourse] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [certificateEarned, setCertificateEarned] = useState(false);


    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            // 1. get user
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) {
                setCourse(null); // not logged in
                setLoading(false);
                return;
            }

            setUserId(userData.user.id);

            // 2. fetch user profile (with enrolled courses)
            const { data: profile } = await supabase
                .from("users")
                .select("enrolled_courses")
                .eq("id", userData.user.id)
                .single();

            // 🚨 Protect: check if courseId is in enrolled_courses
            if (!profile?.enrolled_courses?.includes(id)) {
                setCourse("not_enrolled"); // mark blocked
                setLoading(false);
                return;
            }

            // ✅ enrolled → fetch course
            const { data: courseData } = await supabase
                .from("courses")
                .select(`
    id, name,
    course_data (
      id,
      title,
      description,
      section,
      "order",
      section_order
    )
  `)
                .eq("id", id)
                .single();



            const { data: quizData } = await supabase
                .from("course_quizzes")
                .select("id, question, options, answer, order")
                .eq("course_id", id)
                .order("order", { ascending: true });

            const { data: progressData } = await supabase
                .from("course_progress")
                .select("*")
                .eq("user_id", userData.user.id)
                .eq("course_id", id);

            const { data: completionData } = await supabase
                .from("course_completions")
                .select("passed")
                .eq("user_id", userData.user.id)
                .eq("course_id", id)
                .single();

            setCourse(courseData);
            setQuiz(quizData || []);
            setProgress(progressData || []);
            setCertificateEarned(completionData?.passed === true);

            // pick first lesson
            if (courseData?.course_data?.length) {
                const sortedLessons = [...courseData.course_data]
                    .sort((a, b) => {
                        // sort by section_order first
                        if ((a.section_order ?? 0) !== (b.section_order ?? 0)) {
                            return (a.section_order ?? 0) - (b.section_order ?? 0);
                        }
                        // then by lesson order
                        return (a.order ?? 0) - (b.order ?? 0);
                    });

                setSelected(sortedLessons[0]);

            }

            setLoading(false);
        };

        fetchAll();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
                    <p className="text-lg font-semibold tracking-wide animate-pulse">
                        Loading your course...
                    </p>
                </div>
            </div>
        );
    }

    if (course === "not_enrolled") {
        return (
            <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-300">
                ❌ You are not enrolled in this course.
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-300">
                ❌ Course not found
            </div>
        );
    }


    // sort lessons
    const lessons = [...course.course_data].sort((a, b) => {
        if ((a.section_order ?? 0) !== (b.section_order ?? 0)) {
            return (a.section_order ?? 0) - (b.section_order ?? 0);
        }
        return (a.order ?? 0) - (b.order ?? 0);
    });
    const currentIndex = lessons.findIndex((l) => l.id === selected?.id);
    const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : null;

    const refreshProgress = async (userId: string) => {
        const { data } = await supabase
            .from("course_progress")
            .select("*")
            .eq("user_id", userId)
            .eq("course_id", id);
        setProgress(data || []);
    };

    return (
        <div className="flex min-h-screen mt-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
            {/* Sidebar */}
            <Sidebar
                course={course}
                progress={progress}
                onSelectLesson={setSelected}
                activeLessonId={selected?.id}
                certificateEarned={certificateEarned}   // ✅ NEW

            />

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
                {/* Course title banner */}
                <div className="sticky top-0 z-10 mb-6 backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-gray-200 dark:border-neutral-800 py-4 px-6 rounded-2xl shadow-sm">
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        {course.name}
                    </h1>
                </div>

                {/* Lesson / Quiz Player */}
                <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg p-6 transition-all duration-300 hover:shadow-purple-500/20">
                    {selected === "quiz" ? (
                        <Quiz
                            questions={quiz}
                            courseId={course.id}
                            onComplete={async () => {
                                toast.success("🎉 Course Completed! Congrats 🚀");

                                // 🔥 Insert/Update course_completions
                                await supabase
                                    .from("course_completions")
                                    .upsert({
                                        user_id: userId,
                                        course_id: course.id,
                                        passed: true,
                                        completed_at: new Date().toISOString(),
                                    });

                                setCertificateEarned(true); // unlock all tabs immediately
                            }}

                        />

                    ) : (

                        <LessonPlayer
                            lesson={selected}
                            nextLesson={nextLesson}
                            userId={userId!}   // 👈 non-null assertion
                            courseId={course.id}
                            onComplete={(next) => {
                                refreshProgress(userId!);
                                setSelected(next);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
