"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ThumbnailUpload({ onChange }: { onChange: (url: string | null) => void; }) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);

    const supabase = createClient();

    const handleFileUpload = async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        setUploading(true);

        const newFilePath = `thumbnails/${Date.now()}-${file.name}`;
        // console.log("Uploading file:", file);
        // console.log("File path:", newFilePath);

        const { error } = await supabase.storage
            .from("course-files")
            .upload(newFilePath, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from("course-files").getPublicUrl(newFilePath);

        if (data?.publicUrl) {
            console.log("Public URL:", data.publicUrl);
            onChange(data.publicUrl);
            setPreviewUrl(data.publicUrl);
            setFilePath(newFilePath);
        } else {
            console.error("Failed to get public URL.");
        }

        setUploading(false);
    };

    const handleDelete = async () => {
        if (!filePath) return;

        const { error } = await supabase.storage.from("course-files").remove([filePath]);

        if (error) {
            console.error("Delete failed:", error);
            alert("Delete failed!");
            return;
        }

        setPreviewUrl(null);
        setFilePath(null);
        onChange(null);
        alert("Thumbnail deleted!");
    };

    return (
        <div className="space-y-2">
            {!previewUrl && <FileUpload onChange={handleFileUpload} />}
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}

            {previewUrl && (
                <div className="space-y-2">
                    <img
                        src={previewUrl}
                        alt="Thumbnail Preview"
                        className="rounded-md border w-40 h-auto"
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                    >
                        Delete Thumbnail
                    </Button>
                </div>
            )}
        </div>
    );
}
