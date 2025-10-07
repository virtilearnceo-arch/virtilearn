"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

export default function FaqManagerPage() {
    const supabase = createClient();

    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ question: "", answer: "" });
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("faq").select("*").order("created_at", { ascending: false });

        if (error) toast.error(error.message);
        else setFaqs(data || []);

        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!form.question.trim() || !form.answer.trim()) {
            toast.error("Both question and answer are required.");
            return;
        }

        if (editId) {
            const { error } = await supabase.from("faq").update(form).eq("id", editId);
            if (error) toast.error(error.message);
            else toast.success("FAQ updated");
        } else {
            if (faqs.length >= 5) {
                toast.error("Maximum 5 FAQs allowed.");
                return;
            }

            const { error } = await supabase.from("faq").insert(form);
            if (error) toast.error(error.message);
            else toast.success("FAQ added");
        }

        setForm({ question: "", answer: "" });
        setEditId(null);
        fetchFaqs();
    };

    const handleEdit = (faq: any) => {
        setForm({ question: faq.question, answer: faq.answer });
        setEditId(faq.id);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

        const { error } = await supabase.from("faq").delete().eq("id", id);
        if (error) toast.error(error.message);
        else {
            toast.success("FAQ deleted");
            fetchFaqs();
        }
    };

    return (
        <div className="space-y-4 max-w-4xl flex flex-col">
            <h2 className="text-2xl font-semibold">Manage FAQs</h2>

            <Card  >
                <CardHeader className="border-b">
                    <h3 className="font-medium text-lg">{editId ? "Edit FAQ" : "Add New FAQ"}</h3>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                    <Input
                        placeholder="Question"
                        value={form.question}
                        onChange={(e) => setForm({ ...form, question: e.target.value })}
                    />
                    <Textarea
                        placeholder="Answer"
                        value={form.answer}
                        onChange={(e) => setForm({ ...form, answer: e.target.value })}
                        rows={4}
                    />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {editId && (
                        <Button variant="secondary" onClick={() => { setForm({ question: "", answer: "" }); setEditId(null); }}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={handleSubmit}>{editId ? "Update FAQ" : "Add FAQ"}</Button>
                </CardFooter>
            </Card>

            {loading ? (
                <p>Loading FAQs...</p>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <Card key={faq.id} className="w-full">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold text-lg">{faq.question}</h4>
                                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(faq)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(faq.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
