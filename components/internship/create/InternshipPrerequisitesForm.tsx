/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";

interface Prerequisite {
    id?: string;
    title: string;
    description?: string;
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: Prerequisite[]) => void;
    defaultValues?: Prerequisite[];
}

export function InternshipPrerequisitesForm({
    onNext,
    onBack,
    onChange,
    defaultValues = [],
}: Props) {
    const [prerequisites, setPrerequisites] = useState<Prerequisite[]>(defaultValues);

    // 🔄 sync with parent
    useEffect(() => {
        onChange(prerequisites);
    }, [prerequisites]);

    const addPrerequisite = () => {
        setPrerequisites([...prerequisites, { title: "", description: "" }]);
    };

    const updatePrerequisite = (index: number, field: keyof Prerequisite, value: any) => {
        const updated = [...prerequisites];
        updated[index][field] = value;
        setPrerequisites(updated);
    };

    const removePrerequisite = (index: number) => {
        const updated = prerequisites.filter((_, i) => i !== index);
        setPrerequisites(updated);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Internship Prerequisites</h2>

            {prerequisites.map((prerequisite, index) => (
                <Card key={index} className="relative">
                    <CardContent className="p-4 space-y-3">
                        <Input
                            placeholder="Prerequisite title"
                            value={prerequisite.title}
                            onChange={(e) => updatePrerequisite(index, "title", e.target.value)}
                        />
                        <Textarea
                            placeholder="Description (optional)"
                            value={prerequisite.description || ""}
                            onChange={(e) =>
                                updatePrerequisite(index, "description", e.target.value)
                            }
                        />
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removePrerequisite(index)}
                            className="absolute top-2 right-2"
                        >
                            <Trash size={16} />
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <div className="flex gap-2">
                <Button onClick={addPrerequisite} variant="outline">
                    <Plus size={16} className="mr-2" /> Add Prerequisite
                </Button>
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onNext}>Next</Button>
            </div>
        </div>
    );
}
