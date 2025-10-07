"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

type Quiz = {
    id?: string;
    question: string;
    options: string[];
    correct_answer: string;
    marks: number;
    explanation?: string;
};

export default function FinalExamEditor() {
    const pathname = usePathname();
    const internshipId = pathname.split("/")[5]; // /admin/dashboard/internships/:id/quizzes

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingQuiz, setSavingQuiz] = useState<string | null>(null);

    // Fetch quizzes
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data, error } = await supabase
                    .from("internship_final_quizzes")
                    .select("*")
                    .eq("internship_id", internshipId)
                    .order("created_at", { ascending: true });

                if (error) throw error;
                setQuizzes(
                    data?.map((q) => ({
                        id: q.id,
                        question: q.question,
                        options: q.options || [],
                        correct_answer: q.correct_answer,
                        marks: q.marks || 1,
                        explanation: q.explanation || "",
                    })) || []
                );
            } catch (err) {
                console.error(err);
                toast.error("Failed to load final exam questions");
            } finally {
                setLoading(false);
            }
        };
        if (internshipId) fetchQuizzes();
    }, [internshipId]);

    const handleAddQuestion = () => {
        setQuizzes((prev) => [
            ...prev,
            {
                question: "",
                options: ["", "", "", ""],
                correct_answer: "",
                marks: 1,
                explanation: "",
            },
        ]);
    };

    const handleChange = (idx: number, field: keyof Quiz, value: any) => {
        setQuizzes((prev) =>
            prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
        );
    };

    const handleSaveQuiz = async (idx: number) => {
        try {
            const quiz = quizzes[idx];
            if (!quiz) return;

            setSavingQuiz(quiz.id || `new-${idx}`);

            if (quiz.id) {
                const { error } = await supabase
                    .from("internship_final_quizzes")
                    .update({
                        question: quiz.question,
                        options: quiz.options,
                        correct_answer: quiz.correct_answer,
                        marks: quiz.marks,
                        explanation: quiz.explanation,
                    })
                    .eq("id", quiz.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from("internship_final_quizzes")
                    .insert({
                        internship_id: internshipId,
                        question: quiz.question,
                        options: quiz.options,
                        correct_answer: quiz.correct_answer,
                        marks: quiz.marks,
                        explanation: quiz.explanation,
                    })
                    .select("id")
                    .single();
                if (error) throw error;
                quiz.id = data.id;
            }

            toast.success("✅ Question saved successfully!");
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to save question");
        } finally {
            setSavingQuiz(null);
        }
    };

    const handleDeleteQuiz = async (idx: number) => {
        const quiz = quizzes[idx];
        if (!quiz) return;

        if (quiz.id) {
            try {
                const { error } = await supabase
                    .from("internship_final_quizzes")
                    .delete()
                    .eq("id", quiz.id);
                if (error) throw error;
                toast.success("🗑 Question deleted successfully!");
            } catch (err) {
                console.error(err);
                toast.error("❌ Failed to delete question");
                return;
            }
        }

        setQuizzes((prev) => prev.filter((_, i) => i !== idx));
    };

    if (loading) return <p className="p-8 text-center">Loading...</p>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold text-center">📝 Manage Final Exam</h1>

            {quizzes.map((quiz, idx) => (
                <Card key={quiz.id || idx} className="bg-white/90 dark:bg-gray-800 border shadow-md rounded-2xl">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Question {idx + 1}</CardTitle>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteQuiz(idx)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input
                            placeholder="Question"
                            value={quiz.question}
                            onChange={(e) => handleChange(idx, "question", e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            {quiz.options.map((opt, i) => (
                                <Input
                                    key={i}
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                        const newOptions = [...quiz.options];
                                        newOptions[i] = e.target.value;
                                        handleChange(idx, "options", newOptions);
                                    }}
                                />
                            ))}
                        </div>
                        <Input
                            placeholder="Correct Answer (must match one option)"
                            value={quiz.correct_answer}
                            onChange={(e) =>
                                handleChange(idx, "correct_answer", e.target.value)
                            }
                        />
                        <Input
                            type="number"
                            placeholder="Marks"
                            value={quiz.marks}
                            onChange={(e) => handleChange(idx, "marks", Number(e.target.value))}
                        />
                        <Textarea
                            placeholder="Explanation (optional)"
                            value={quiz.explanation}
                            onChange={(e) => handleChange(idx, "explanation", e.target.value)}
                        />
                        <Button
                            onClick={() => handleSaveQuiz(idx)}
                            className={`w-full py-2 font-semibold rounded-xl ${savingQuiz === quiz.id ? "bg-green-500 text-white" : "bg-indigo-500 text-white"
                                }`}
                        >
                            {savingQuiz === quiz.id ? "💾 Saving..." : "💾 Save Question"}
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <Button
                variant="outline"
                onClick={handleAddQuestion}
                className="w-full py-2"
            >
                + Add Question
            </Button>
        </div>
    );
}
