"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";

interface Benefit {
    id?: string;
    title: string;
    description?: string;
    icon_url?: string;
    order?: number;
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: Benefit[]) => void;
    defaultValues?: Benefit[];
}

export function InternshipBenefitsForm({
    onNext,
    onBack,
    onChange,
    defaultValues = [],
}: Props) {
    const [benefits, setBenefits] = useState<Benefit[]>(defaultValues);

    // sync with parent
    useEffect(() => {
        onChange(benefits);
    }, [benefits]);

    const addBenefit = () => {
        setBenefits([
            ...benefits,
            { title: "", description: "", icon_url: "", order: benefits.length + 1 },
        ]);
    };
    const updateBenefit = <K extends keyof Benefit>(
        index: number,
        field: K,
        value: Benefit[K]
    ) => {
        const updated = [...benefits];
        updated[index][field] = value;
        setBenefits(updated);
    };


    const removeBenefit = (index: number) => {
        const updated = benefits.filter((_, i) => i !== index);
        // reorder after delete
        updated.forEach((b, i) => (b.order = i + 1));
        setBenefits(updated);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Internship Benefits</h2>

            {benefits.map((benefit, index) => (
                <Card key={index} className="relative">
                    <CardContent className="p-4 space-y-3">
                        <Input
                            placeholder="Benefit title"
                            value={benefit.title}
                            onChange={(e) => updateBenefit(index, "title", e.target.value)}
                        />
                        <Textarea
                            placeholder="Description (optional)"
                            value={benefit.description || ""}
                            onChange={(e) =>
                                updateBenefit(index, "description", e.target.value)
                            }
                        />
                        <Input
                            placeholder="Icon URL (optional)"
                            value={benefit.icon_url || ""}
                            onChange={(e) => updateBenefit(index, "icon_url", e.target.value)}
                        />
                        <div className="text-sm text-gray-500">Order: {benefit.order}</div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeBenefit(index)}
                            className="absolute top-2 right-2"
                        >
                            <Trash size={16} />
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <div className="flex gap-2">
                <Button onClick={addBenefit} variant="outline">
                    <Plus size={16} className="mr-2" /> Add Benefit
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
