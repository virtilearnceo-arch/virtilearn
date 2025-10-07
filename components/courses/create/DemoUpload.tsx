"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function DemoVideoUpload({ onChange }: { onChange: (url: string | null) => void; }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);

    const supabase = createClient();

    const handleFileUpload = async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        const newFilePath = `demo-videos/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
            .from("course-files")
            .upload(newFilePath, file, { cacheControl: "3600", upsert: true });

        if (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
            return;
        }

        const { data } = supabase.storage.from("course-files").getPublicUrl(newFilePath);
        if (data?.publicUrl) {
            onChange(data.publicUrl);
            setPreviewUrl(data.publicUrl);
            setFilePath(newFilePath);
        }
    };

    const handleDelete = async () => {
        if (filePath) {
            const { error } = await supabase.storage.from("course-files").remove([filePath]);
            if (error) {
                console.error("Delete failed:", error);
                alert("Delete failed!");
                return;
            }
            setPreviewUrl(null);
            setFilePath(null);
            onChange(null);
        }
    };

    return (
        <div className="space-y-2">
            {!previewUrl && <FileUpload onChange={handleFileUpload} />}
            {previewUrl && (
                <div className="space-y-2">
                    <video controls src={previewUrl} className="rounded-md border w-full max-w-md" />
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        Delete Demo Video
                    </Button>
                </div>
            )}
        </div>
    );
}
