"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Instructor {
    id: string;
    name: string;
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: Instructor[]) => void;
    defaultValues?: Instructor[];
}

export function CourseInstructorsForm({ onNext, onBack, onChange, defaultValues = [] }: Props) {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [selected, setSelected] = useState<Instructor[]>(defaultValues);

    // ✅ Fetch instructors from Supabase
    useEffect(() => {
        async function fetchInstructors() {
            const { data, error } = await supabase.from("instructors").select("id, name").order("created_at", { ascending: false });
            if (!error && data) {
                setInstructors(data);
            } else {
                console.error("Error fetching instructors:", error?.message);
            }
        }
        fetchInstructors();
    }, []);

    const handleNext = () => {
        onChange(selected);
        onNext();
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>👨‍🏫 Select Instructors</CardTitle>
                <CardDescription>
                    Choose one or more instructors for this course. You can add new instructors in the admin panel.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {instructors.length > 0 ? (
                    <MultiSelect
                        options={instructors.map((inst) => ({ label: inst.name, value: inst.id }))}
                        value={selected.map((inst) => inst.id)}
                        onChange={(values) => {
                            const selectedInst = instructors.filter((inst) => values.includes(inst.id));
                            setSelected(selectedInst);
                        }}
                        placeholder="Select instructors..."
                    />
                ) : (
                    <p className="text-sm text-gray-500">No instructors available. Please add some first.</p>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    ⬅️ Back
                </Button>
                <Button onClick={handleNext}>Next ➡️</Button>
            </CardFooter>
        </Card>
    );
}
