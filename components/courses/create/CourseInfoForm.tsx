/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { DemoVideoUpload } from "./DemoUpload";

type Props = {
    onNext: () => void;
    onChange: (data: any) => void;
    defaultValues?: any;
    mode?: "create" | "edit";
    courseId?: string;
};

export function CourseInfoForm({
    onNext,
    onChange,
    defaultValues,
    mode = "create",
    courseId,
}: Props) {
    const [name, setName] = useState(defaultValues?.name || "");
    const [description, setDescription] = useState(
        defaultValues?.description || ""
    );
    const [category, setCategory] = useState(defaultValues?.categories || "");
    const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [level, setLevel] = useState(defaultValues?.level || "");
    const [price, setPrice] = useState(defaultValues?.price || "");
    const [estimatedPrice, setEstimatedPrice] = useState(
        defaultValues?.estimated_price || ""
    );
    const [demoUrl, setDemoUrl] = useState(defaultValues?.demo_url || "");
    const [thumbnailUrl, setThumbnailUrl] = useState(
        defaultValues?.thumbnail_url || ""
    );

    // Extra fields
    const [certification, setCertification] = useState(
        defaultValues?.certification || false
    );
    const [duration, setDuration] = useState(defaultValues?.duration || "");
    const [language, setLanguage] = useState(
        defaultValues?.language || "English"
    );
    const [subtitles, setSubtitles] = useState<string[]>(
        defaultValues?.subtitles || []
    );
    const [subtitleInput, setSubtitleInput] = useState("");

    // Handlers
    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput)) {
            setTags((prev) => [...prev, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleNext = () => {
        onChange({
            name,
            description,
            categories: category,
            tags,
            level,
            price,
            estimated_price: estimatedPrice,
            demo_url: demoUrl,
            thumbnail_url: thumbnailUrl,
            duration,
            language,
            subtitles,
            certification,
        });

        onNext();
    };

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>Course Info</CardTitle>
                <CardDescription>Enter basic details about your course</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-6">
                    {/* Course Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Course Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Mastering HTML"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Short summary of the course..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            placeholder="e.g. Frontend, Backend, AI..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div className="grid gap-2">
                        <Label>Tags</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Add tag and press enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addTag} size="sm">
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                >
                                    {tag} ✕
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Level */}
                    <div className="grid gap-2">
                        <Label>Level</Label>
                        <Select value={level} onValueChange={setLevel} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                type="number"
                                id="price"
                                placeholder="1999"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="estimated_price">Estimated Price (₹)</Label>
                            <Input
                                type="number"
                                id="estimated_price"
                                placeholder="2999"
                                value={estimatedPrice}
                                onChange={(e) => setEstimatedPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="grid gap-2">
                        <Label htmlFor="duration">Course Duration</Label>
                        <Input
                            id="duration"
                            placeholder="e.g. 40h 30m"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>

                    {/* Language */}
                    <div className="grid gap-2">
                        <Label htmlFor="language">Language</Label>
                        <Input
                            id="language"
                            placeholder="e.g. English"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        />
                    </div>

                    {/* Subtitles */}
                    <div className="grid gap-2">
                        <Label>Subtitles</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Add subtitle (e.g. Spanish)"
                                value={subtitleInput}
                                onChange={(e) => setSubtitleInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (
                                            subtitleInput.trim() &&
                                            !subtitles.includes(subtitleInput)
                                        ) {
                                            setSubtitles([...subtitles, subtitleInput.trim()]);
                                            setSubtitleInput("");
                                        }
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (
                                        subtitleInput.trim() &&
                                        !subtitles.includes(subtitleInput)
                                    ) {
                                        setSubtitles([...subtitles, subtitleInput.trim()]);
                                        setSubtitleInput("");
                                    }
                                }}
                                size="sm"
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {subtitles.map((sub) => (
                                <Badge
                                    key={sub}
                                    variant="secondary"
                                    onClick={() =>
                                        setSubtitles(subtitles.filter((s) => s !== sub))
                                    }
                                >
                                    {sub} ✕
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Certification */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="certification"
                            checked={certification}
                            onChange={(e) => setCertification(e.target.checked)}
                        />
                        <Label htmlFor="certification">Certification Provided</Label>
                    </div>



                    {/* Demo Video */}
                    <div className="grid gap-2">
                        <Label>Demo Video</Label>
                        <DemoVideoUpload onChange={setDemoUrl} />
                        {demoUrl && (
                            <video src={demoUrl} controls className="w-60 rounded border" />
                        )}
                    </div>

                    {/* Thumbnail */}
                    <div className="grid gap-2">
                        <Label>Thumbnail Image</Label>
                        <ThumbnailUpload onChange={setThumbnailUrl} />
                        {thumbnailUrl && (
                            <img
                                src={thumbnailUrl}
                                alt="Thumbnail Preview"
                                className="w-40 rounded border"
                            />
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button onClick={handleNext}>Continue</Button>
            </CardFooter>
        </Card>
    );
}
