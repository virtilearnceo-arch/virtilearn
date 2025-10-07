"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";

interface Feature {
    id?: string;
    title: string;
    description?: string;
    icon_url?: string;
    order?: number;
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: Feature[]) => void;
    defaultValues?: Feature[];
}

export function InternshipFeaturesForm({
    onNext,
    onBack,
    onChange,
    defaultValues = [],
}: Props) {
    const [features, setFeatures] = useState<Feature[]>(defaultValues);

    // 🔄 Sync with parent
    useEffect(() => {
        onChange(features);
    }, [features]);

    const addFeature = () => {
        setFeatures([...features, { title: "", description: "", icon_url: "" }]);
    };

    const updateFeature = <K extends keyof Feature>(
        index: number,
        field: K,
        value: Feature[K]
    ) => {
        const updated = [...features];
        updated[index][field] = value;
        setFeatures(updated);
    };


    const removeFeature = (index: number) => {
        const updated = features.filter((_, i) => i !== index);
        setFeatures(updated);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Internship Features</h2>

            {features.map((feature, index) => (
                <Card key={index} className="relative">
                    <CardContent className="p-4 space-y-3">
                        <Input
                            placeholder="Feature Title"
                            value={feature.title}
                            onChange={(e) => updateFeature(index, "title", e.target.value)}
                        />
                        <Textarea
                            placeholder="Description (optional)"
                            value={feature.description || ""}
                            onChange={(e) =>
                                updateFeature(index, "description", e.target.value)
                            }
                        />
                        <Input
                            placeholder="Icon URL (optional)"
                            value={feature.icon_url || ""}
                            onChange={(e) => updateFeature(index, "icon_url", e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="Order (optional)"
                            value={feature.order ?? ""}
                            onChange={(e) =>
                                updateFeature(index, "order", Number(e.target.value))
                            }
                        />
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="absolute top-2 right-2"
                        >
                            <Trash size={16} />
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <div className="flex gap-2">
                <Button onClick={addFeature} variant="outline">
                    <Plus size={16} className="mr-2" /> Add Feature
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
