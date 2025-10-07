/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseResourcesFormProps {
    defaultValues?: {
        ebook?: File | null;
        projectZip?: File | null;
        ebookUrl?: string | null;
        projectZipUrl?: string | null;
    };
    onNext?: (data: any) => void;
    onBack?: () => void;
    onChange?: (data: any) => void;
}

export function CourseResourcesForm({
    defaultValues,
    onNext,
    onBack,
    onChange,
}: CourseResourcesFormProps) {
    const [ebook, setEbook] = useState<File | null>(defaultValues?.ebook || null);
    const [projectZip, setProjectZip] = useState<File | null>(defaultValues?.projectZip || null);

    const [ebookUrl, setEbookUrl] = useState<string | null>(defaultValues?.ebookUrl || null);
    const [projectZipUrl, setProjectZipUrl] = useState<string | null>(defaultValues?.projectZipUrl || null);

    // Notify parent whenever anything changes
    useEffect(() => {
        onChange?.({
            ebook,
            projectZip,
            ebookUrl,
            projectZipUrl,
        });
    }, [ebook, projectZip, ebookUrl, projectZipUrl, onChange]);

    const handleFileChange = (type: "ebook" | "projectZip", file: File | null) => {
        if (type === "ebook") {
            setEbook(file);
            if (file) setEbookUrl(null); // Clear previous URL if new file selected
        } else {
            setProjectZip(file);
            if (file) setProjectZipUrl(null); // Clear previous URL if new file selected
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Upload Extra Resources</h2>

            {/* Ebook */}
            <div className="space-y-2">
                <Label htmlFor="ebook">Ebook (PDF/EPUB)</Label>
                <Input
                    id="ebook"
                    type="file"
                    accept=".pdf,.epub"
                    onChange={(e) => handleFileChange("ebook", e.target.files?.[0] || null)}
                />
                {ebook ? (
                    <p className="text-sm text-muted-foreground">Selected: {ebook.name}</p>
                ) : ebookUrl ? (
                    <p className="text-sm text-muted-foreground">
                        Current file: <a href={ebookUrl} target="_blank" className="underline text-blue-600">View Ebook</a>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">❌ No ebook uploaded</p>
                )}
            </div>

            {/* Project ZIP */}
            <div className="space-y-2">
                <Label htmlFor="projectZip">Project ZIP</Label>
                <Input
                    id="projectZip"
                    type="file"
                    accept=".zip"
                    onChange={(e) => handleFileChange("projectZip", e.target.files?.[0] || null)}
                />
                {projectZip ? (
                    <p className="text-sm text-muted-foreground">Selected: {projectZip.name}</p>
                ) : projectZipUrl ? (
                    <p className="text-sm text-muted-foreground">
                        Current file: <a href={projectZipUrl} target="_blank" className="underline text-blue-600">View Project ZIP</a>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">❌ No project zip uploaded</p>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onNext}>Save & Continue</Button>
            </div>
        </div>
    );
}
