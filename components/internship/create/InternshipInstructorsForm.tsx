/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface InternshipInstructor {
    instructor_id: string;
    role?: string;
    name?: string;
    avatar_url?: string;
}
interface Instructor {
    id: string;
    name: string;
    avatar_url?: string;
}


interface InternshipInstructor {
    instructor_id: string;
    role?: string;
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: InternshipInstructor[]) => void;
    defaultValues?: InternshipInstructor[];
}

export function InternshipInstructorsForm({
    onNext,
    onBack,
    onChange,
    defaultValues = [],
}: Props) {
    const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);
    const [selectedInstructors, setSelectedInstructors] = useState<InternshipInstructor[]>(defaultValues);

    useEffect(() => {
        onChange(selectedInstructors);
    }, [selectedInstructors]);

    useEffect(() => {
        const fetchInstructors = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from("instructors").select("*");
            if (!error && data) setAvailableInstructors(data);
        };
        fetchInstructors();
    }, []);

    const addInstructor = () => {
        setSelectedInstructors([...selectedInstructors, { instructor_id: "", role: "" }]);
    };

    const updateInstructor = (index: number, field: keyof InternshipInstructor, value: any) => {
        const updated = [...selectedInstructors];
        updated[index][field] = value;
        setSelectedInstructors(updated);
    };

    const removeInstructor = (index: number) => {
        setSelectedInstructors(selectedInstructors.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Assign Instructors</h2>

            {selectedInstructors.map((item, index) => (
                <Card key={index}>
                    <CardContent className="p-4 space-y-3">
                        {/* Instructor Select */}
                        <Select
                            value={item.instructor_id}
                            onValueChange={(val) => {
                                const selected = availableInstructors.find((inst) => inst.id === val);
                                updateInstructor(index, "instructor_id", val);
                                if (selected) {
                                    updateInstructor(index, "name", selected.name);
                                    updateInstructor(index, "avatar_url", selected.avatar_url || "");
                                }
                            }}
                        >

                            <SelectTrigger>
                                <SelectValue placeholder="Select Instructor" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableInstructors.map((inst) => (
                                    <SelectItem key={inst.id} value={inst.id}>
                                        {inst.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Role */}
                        <Input
                            placeholder="Role (e.g. Mentor, Guide)"
                            value={item.role || ""}
                            onChange={(e) => updateInstructor(index, "role", e.target.value)}
                        />

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeInstructor(index)}
                            className="mt-2"
                        >
                            <Trash size={16} />
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <Button variant="outline" onClick={addInstructor}>
                + Add Instructor
            </Button>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onNext}>Next</Button>
            </div>
        </div>
    );
}
