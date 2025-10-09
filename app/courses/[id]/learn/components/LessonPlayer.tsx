"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Resource {
    id: string;
    title: string;
    url: string;
}

interface Lesson {
    id: string;
    title: string;
    suggestion?: string;
    description: string;
}

interface LessonPlayerProps {
    lesson: Lesson;
    nextLesson?: Lesson | null;
    userId: string;
    courseId: string;
    onComplete: (next: Lesson | "quiz") => void;
}

export default function LessonPlayer({
    lesson,
    nextLesson,
    userId,
    courseId,
    onComplete,
}: LessonPlayerProps) {
    const supabase = createClient();
    const [resources, setResources] = useState<Resource[]>([]);
    const [courseCompleted, setCourseCompleted] = useState(false);

    // Fetch extra resources
    useEffect(() => {
        const fetchResources = async () => {
            if (!lesson?.id) return;
            const { data, error } = await supabase
                .from("course_data_links")
                .select("id, title, url")
                .eq("course_data_id", lesson.id);

            if (error) console.error(error);
            setResources(data || []);
        };
        fetchResources();
    }, [lesson?.id]);

    // Check if course already completed
    useEffect(() => {
        const checkCompletion = async () => {
            if (!userId || !courseId) return;
            const { data, error } = await supabase
                .from("course_completions")
                .select("passed")
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .single();

            if (!error && data?.passed) setCourseCompleted(true);
        };
        checkCompletion();
    }, [userId, courseId]);

    // Mark lesson as complete
    const handleComplete = async () => {
        if (!userId || !lesson) return;

        await supabase.from("course_progress").upsert({
            user_id: userId,
            course_id: courseId,
            lesson_id: lesson.id,
            is_completed: true,
            completed_at: new Date().toISOString(),
        });

        if (nextLesson) onComplete(nextLesson);
        else onComplete("quiz");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Lesson Title */}
            <h1 className="text-3xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {lesson.title}
            </h1>

            {/* Lesson Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                >
                    {lesson.description}
                </ReactMarkdown>
            </div>

            {/* Suggestions */}
            {lesson.suggestion && (
                <div className="mt-6 p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-neutral-900 rounded-lg">
                    <h3 className="text-sm font-bold mb-3">💡 Suggestions</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                        >
                            {lesson.suggestion}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Extra Resources */}
            {resources.length > 0 && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-neutral-900">
                    <h3 className="text-sm font-bold mb-3">📂 Extra Resources</h3>
                    <ul className="space-y-2 list-disc pl-6">
                        {resources.map((res) => (
                            <li key={res.id}>
                                <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    {res.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Next Button / Course Completed */}
            <div className="mt-8 flex justify-end">
                {courseCompleted ? (
                    <div className="text-center w-full">
                        <h2 className="text-2xl font-bold text-green-600 mb-3">
                            🎉 You’ve already passed this course!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Great job, legend 🚀 Your certificate is waiting for you.
                        </p>
                        <Button
                            onClick={() =>
                                (window.location.href = `/courses/${courseId}/completed`)
                            }
                            className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 
                hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition"
                        >
                            View Certificate →
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={handleComplete}
                        className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                hover:from-purple-700 hover:to-pink-700 text-white shadow-md transition"
                    >
                        {nextLesson ? "Next Lesson →" : "Start Quiz →"}
                    </Button>
                )}
            </div>
        </div>
    );
}