/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

interface Item {
    id?: string;
    title: string;
    order?: number;
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: {
        benefits: Item[];
        prerequisites: Item[];
        features: Item[];
    }) => void;
    defaultValues?: {
        benefits?: { id?: string; title: string; order?: number; }[];
        prerequisites?: { id?: string; title: string; }[];
        features?: { id?: string; title: string; }[];
    };
    mode?: "create" | "edit";
    courseId?: string;
}

export function CourseBenefitsForm({
    onNext,
    onBack,
    onChange,
    defaultValues,
    mode = "create",
}: Props) {
    const [benefits, setBenefits] = useState<Item[]>([]);
    const [prerequisites, setPrerequisites] = useState<Item[]>([]);
    const [features, setFeatures] = useState<Item[]>([]);

    useEffect(() => {
        if (defaultValues?.benefits) {
            setBenefits(defaultValues.benefits.map((b, i) => ({
                id: b.id,
                title: b.title,
                order: b.order ?? i,
            })));
        }
        if (defaultValues?.prerequisites) {
            setPrerequisites(defaultValues.prerequisites.map((p, i) => ({
                id: p.id,
                title: p.title,
                order: i,
            })));
        }
        if (defaultValues?.features) {
            setFeatures(defaultValues.features.map((f) => ({
                id: f.id,
                title: f.title,
            })));
        }
    }, [defaultValues]);

    const handleChange = (
        index: number,
        value: string,
        type: "benefits" | "prerequisites" | "features"
    ) => {
        const updater =
            type === "benefits"
                ? setBenefits
                : type === "prerequisites"
                    ? setPrerequisites
                    : setFeatures;

        updater((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], title: value };
            return updated;
        });
    };

    const handleAdd = (type: "benefits" | "prerequisites" | "features") => {
        const newItem: Item = { title: "", id: undefined };
        if (type === "benefits") setBenefits([...benefits, newItem]);
        if (type === "prerequisites") setPrerequisites([...prerequisites, newItem]);
        if (type === "features") setFeatures([...features, newItem]);
    };

    const handleRemove = (
        index: number,
        type: "benefits" | "prerequisites" | "features"
    ) => {
        if (type === "benefits")
            setBenefits(benefits.filter((_, i) => i !== index));
        if (type === "prerequisites")
            setPrerequisites(prerequisites.filter((_, i) => i !== index));
        if (type === "features")
            setFeatures(features.filter((_, i) => i !== index));
    };

    const handleReorder = (index: number, direction: "up" | "down") => {
        setBenefits((prev) => {
            const updated = [...prev];
            const targetIndex = direction === "up" ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= prev.length) return prev;

            [updated[index], updated[targetIndex]] = [
                updated[targetIndex],
                updated[index],
            ];

            // Re-assign order after swap
            return updated.map((b, i) => ({ ...b, order: i }));
        });
    };

    const handleNext = () => {
        onChange({
            benefits,
            prerequisites,
            features,
        });
        onNext();
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Course Benefits, Prerequisites & Features</CardTitle>
                <CardDescription>
                    Tell learners what they’ll get, what they need to know before
                    enrolling, and what course features are included.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* 🎯 Benefits */}
                <div>
                    <h3 className="text-md font-semibold mb-2">🎯 Benefits (Reorderable)</h3>
                    {benefits.map((benefit, index) => (
                        <div key={benefit.id ?? index} className="flex items-center gap-2 mb-2">
                            <Input
                                value={benefit.title}
                                onChange={(e) =>
                                    handleChange(index, e.target.value, "benefits")
                                }
                            />
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => handleRemove(index, "benefits")}
                            >
                                Remove
                            </Button>
                            <Button
                                variant="ghost"
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleReorder(index, "up")}
                            >
                                ⬆️
                            </Button>
                            <Button
                                variant="ghost"
                                type="button"
                                disabled={index === benefits.length - 1}
                                onClick={() => handleReorder(index, "down")}
                            >
                                ⬇️
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAdd("benefits")}>
                        ➕ Add Benefit
                    </Button>
                </div>

                {/* 📚 Prerequisites */}
                <div>
                    <h3 className="text-md font-semibold mb-2">📚 Prerequisites</h3>
                    {prerequisites.map((item, index) => (
                        <div key={item.id ?? index} className="flex items-center gap-2 mb-2">
                            <Input
                                value={item.title}
                                onChange={(e) =>
                                    handleChange(index, e.target.value, "prerequisites")
                                }
                            />
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => handleRemove(index, "prerequisites")}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAdd("prerequisites")}>
                        ➕ Add Prerequisite
                    </Button>
                </div>

                {/* ⭐ Features */}
                {/* <div>
                    <h3 className="text-md font-semibold mb-2">⭐ Course Features</h3>
                    {features.map((item, index) => (
                        <div key={item.id ?? index} className="flex items-center gap-2 mb-2">
                            <Input
                                value={item.title}
                                onChange={(e) =>
                                    handleChange(index, e.target.value, "features")
                                }
                            />
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => handleRemove(index, "features")}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAdd("features")}>
                        ➕ Add Feature
                    </Button>
                </div> */}
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
