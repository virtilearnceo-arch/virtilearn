"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Quiz = {
    id?: string;
    question: string;
    options: string[];
    answer: number;
    order?: number;
};

export default function QuizEditor() {
    const supabase = createClient();
    const { id: courseId } = useParams(); // course id from URL

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    // fetch quizzes
    useEffect(() => {
        const fetchQuizzes = async () => {
            const { data, error } = await supabase
                .from("course_quizzes")
                .select("*")
                .eq("course_id", courseId)
                .order("order", { ascending: true });

            if (!error && data) {
                setQuizzes(data);
            }
            setLoading(false);
        };
        if (courseId) fetchQuizzes();
    }, [courseId]);

    // handle input change
    const updateQuiz = (index: number, field: keyof Quiz, value: any) => {
        const updated = [...quizzes];
        (updated[index] as any)[field] = value;
        setQuizzes(updated);
    };

    // add new quiz
    const addQuiz = () => {
        setQuizzes([
            ...quizzes,
            { question: "", options: ["", "", "", ""], answer: 0 },
        ]);
    };

    // delete quiz
    const deleteQuiz = async (index: number) => {
        const quiz = quizzes[index];

        if (quiz.id) {
            // delete from DB if it exists
            await supabase.from("course_quizzes").delete().eq("id", quiz.id);
        }

        // remove from local state
        const updated = quizzes.filter((_, i) => i !== index);
        setQuizzes(updated);
    };

    // save to DB
    const saveQuizzes = async () => {
        for (let i = 0; i < quizzes.length; i++) {
            const q = quizzes[i];

            // skip empty
            if (!q.question || q.options.some((o) => !o)) continue;

            // Check for duplicates by question + course_id
            const { data: existing, error: checkError } = await supabase
                .from("course_quizzes")
                .select("*")
                .eq("course_id", courseId)
                .eq("question", q.question)
                .single();

            if (!checkError && existing && !q.id) {
                console.log(`Skipped duplicate question: "${q.question}"`);
                continue; // skip duplicates
            }

            if (q.id) {
                await supabase
                    .from("course_quizzes")
                    .update({
                        question: q.question,
                        options: q.options,
                        answer: q.answer,
                        order: i + 1,
                    })
                    .eq("id", q.id);
            } else {
                await supabase.from("course_quizzes").insert({
                    course_id: courseId,
                    question: q.question,
                    options: q.options,
                    answer: q.answer,
                    order: i + 1,
                });
            }
        }

        alert("Saved successfully ✅");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Manage Quiz</h1>

            {quizzes.map((q, idx) => (
                <div key={q.id || idx} className="border p-4 rounded-lg space-y-2 relative">
                    <Input
                        placeholder="Question"
                        value={q.question}
                        onChange={(e) => updateQuiz(idx, "question", e.target.value)}
                    />

                    {q.options.map((opt, i) => (
                        <Input
                            key={i}
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) => {
                                const newOptions = [...q.options];
                                newOptions[i] = e.target.value;
                                updateQuiz(idx, "options", newOptions);
                            }}
                        />
                    ))}

                    <Input
                        type="number"
                        placeholder="Correct Answer (0-3)"
                        value={q.answer}
                        onChange={(e) =>
                            updateQuiz(idx, "answer", parseInt(e.target.value, 10))
                        }
                    />
                    <p className="text-sm text-muted-foreground">
                        Use zero-based indexing (0-3) for answers
                    </p>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => deleteQuiz(idx)}
                    >
                        🗑 Delete
                    </Button>
                </div>
            ))}

            <div className="flex gap-4">
                <Button onClick={addQuiz}>➕ Add Question</Button>
                <Button onClick={saveQuizzes}>💾 Save</Button>
            </div>
        </div>
    );
}
