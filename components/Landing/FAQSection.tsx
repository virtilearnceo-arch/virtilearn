"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Highlighter } from "../magicui/highlighter";

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export default function FAQSection() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        async function fetchFaqs() {
            const { data, error } = await supabase
                .from("faq")
                .select("*")
                .order("created_at", { ascending: true });
            if (error) {
                console.error("Error fetching FAQs:", error);
            } else {
                setFaqs(data as FAQ[]);
            }
            setLoading(false);
        }

        fetchFaqs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 text-xl font-semibold text-neutral-500 dark:text-neutral-400">
                Loading FAQs...
            </div>
        );
    }

    return (
        <section className="w-full max-w-6xl mx-auto py-24 px-4 md:px-12 text-center">

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">❓ Frequently Asked Questions  </h2>


            <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto mb-12">
                Everything you need to know about VirtiLearn internships, courses, and certifications.
            </p>

            <Accordion type="single" collapsible className="space-y-4 w-full">
                {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <AccordionTrigger
                            className={cn(
                                "flex justify-between items-center text-left text-lg md:text-xl font-semibold px-6 py-4 rounded-xl transition-all duration-300",
                                // Light mode
                                "bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 text-black hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100",
                                // Dark mode
                                "dark:bg-gradient-to-r dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 dark:text-white dark:hover:from-indigo-800 dark:hover:via-purple-800 dark:hover:to-pink-800"
                            )}
                        >
                            {faq.question}
                            {/* <ChevronDown className="ml-2 h-5 w-5" /> */}
                        </AccordionTrigger>

                        <AccordionContent className="px-6 py-4 text-neutral-700 dark:text-neutral-200 text-left bg-gray-50 dark:bg-neutral-900 rounded-b-xl">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
