/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid"; // install: npm i uuid

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
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
    onNext: () => void;
    onChange: (data: any) => void;
    defaultValues?: any;
    mode?: "create" | "edit";
};

export default function InternshipInfoForm({
    onNext,
    onChange,
    defaultValues,
    mode = "create",
}: Props) {
    const supabase = createClient();

    // Form state
    const [title, setTitle] = useState<string>(defaultValues?.title ?? "");
    const [description, setDescription] = useState<string>(defaultValues?.description ?? "");
    const [price, setPrice] = useState<number>(defaultValues?.price ?? 0);
    const [estimatedPrice, setEstimatedPrice] = useState<number>(defaultValues?.estimated_price ?? 0);
    const [level, setLevel] = useState<string>(defaultValues?.level ?? "beginner");
    const [duration, setDuration] = useState<string>(defaultValues?.duration ?? "");
    const [skills, setSkills] = useState<string[]>(defaultValues?.skills ?? []);
    const [skillInput, setSkillInput] = useState("");

    // For categories
    const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultValues?.categories ?? []);

    // Add these in your form state
    const [certification, setCertification] = useState<boolean>(defaultValues?.certification ?? true);
    // const [maxSeats, setMaxSeats] = useState<string>(defaultValues?.max_seats ?? "");
    const [maxSeats, setMaxSeats] = useState<number>(defaultValues?.max_seats ?? 0);

    const [language, setLanguage] = useState<string>(defaultValues?.language ?? "English");
    const [subtitles, setSubtitles] = useState<string[]>(defaultValues?.subtitles ?? []);
    const [subtitleInput, setSubtitleInput] = useState("");

    // Tags input state
    const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
    const [tagInput, setTagInput] = useState("");

    // Uploads state
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultValues?.thumbnail_url ?? "");
    const [demoUrl, setDemoUrl] = useState<string>(defaultValues?.demo_url ?? "");

    // Log to check
    // console.log("id from defaultValues -->", defaultValues?.id);

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    // console.log("new values", defaultValues);
    useEffect(() => {
        const fetchInternshipData = async () => {
            if (defaultValues?.id) {
                const { data, error } = await supabase
                    .from("internships")
                    .select("*")
                    .eq("id", defaultValues.id)
                    .single(); // Fetch a single record

                if (error) {
                    console.error(error);
                    return;
                }

                if (data) {
                    // Set form values with fetched data
                    setTitle(data.title);
                    setDescription(data.description);
                    setPrice(data.price);
                    setEstimatedPrice(data.estimated_price ?? 0);
                    setLevel(data.level ?? "beginner");
                    setDuration(data.duration ?? "");
                    setSkills(data.skills ?? []);
                    setSelectedCategories(data.categories ?? []);
                    setCertification(data.certification ?? true);
                    setMaxSeats(data.max_seats ?? "");
                    setLanguage(data.language ?? "English");
                    setSubtitles(data.subtitles ?? []);
                    setTags(data.tags ?? []);
                    setThumbnailUrl(data.thumbnail_url ?? "");
                    setDemoUrl(data.demo_url ?? "");
                }
            }
        };

        fetchInternshipData();
    }, [defaultValues?.id, supabase]);

    // fetch categories from DB
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("categories").select("*");
            if (error) console.error(error);
            else setCategories(data || []);
        };
        fetchCategories();
    }, []);


    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "thumbnail" | "demo"
    ) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            const ext = file.name.split(".").pop();
            const uniqueName = `${uuidv4()}.${ext}`;   // ✅ always unique
            const filePath = `${type}/${uniqueName}`;

            const { error } = await supabase.storage
                .from("internship-files")
                .upload(filePath, file);

            if (error) {
                toast.error("Upload failed!");
                return;
            }

            const { data } = supabase.storage
                .from("internship-files")
                .getPublicUrl(filePath);

            if (type === "thumbnail") setThumbnailUrl(data.publicUrl);
            if (type === "demo") setDemoUrl(data.publicUrl);

            toast.success(`${type} uploaded successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput)) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput)) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };


    const handleAddSubtitle = () => {
        if (subtitleInput.trim() && !subtitles.includes(subtitleInput)) {
            setSubtitles([...subtitles, subtitleInput.trim()]);
            setSubtitleInput("");
        }
    };
    const handleRemoveSubtitle = (sub: string) => {
        setSubtitles(subtitles.filter((s) => s !== sub));
    };


    const handleNext = () => {
        onChange({
            title,
            description,
            price,
            estimated_price: estimatedPrice,
            level,
            duration,
            skills,
            categories: selectedCategories,
            thumbnail_url: thumbnailUrl,
            demo_url: demoUrl,
            certification,
            max_seats: maxSeats,
            tags,   // ✅ add this
            language,
            subtitles,
        });
        onNext();
    };

    return (
        <Card className="w-full max-w-4xl shadow-2xl border border-gray-200">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {mode === "edit" ? "Edit Internship" : "Create New Internship"}
                </CardTitle>
                <CardDescription>
                    Fill in the details of the internship. Upload thumbnail & demo files, select category, and add skills.
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
                {/* Title */}
                <div className="grid gap-2">
                    <Label htmlFor="title">Internship Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. AI Research Intern"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the internship..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="grid gap-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <Badge
                                key={cat.id}
                                variant={selectedCategories.includes(cat.name) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => toggleCategory(cat.name)}
                            >
                                {cat.name}
                            </Badge>
                        ))}
                    </div>
                </div>



                {/* Tags */}
                <div className="grid gap-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a tag (e.g. AI, Remote, Summer2025)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onClick={handleAddTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                            </Badge>
                        ))}
                    </div>
                </div>



                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Price</Label>
                        <Input
                            type="number"
                            placeholder="₹"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Estimated Price</Label>
                        <Input
                            type="number"
                            placeholder="₹"
                            value={estimatedPrice}
                            onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Level & Duration */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Level</Label>
                        <Select value={level} onValueChange={setLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Duration</Label>
                        <Input
                            placeholder="e.g. 3 months"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                </div>

                {/* Skills */}
                <div className="grid gap-2">
                    <Label>Skills</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. React, Python"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                        />
                        <Button type="button" onClick={handleAddSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                {skill}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Certification */}
                <div className="grid gap-2">
                    <Label>Certification Available</Label>
                    <Select value={certification ? "yes" : "no"} onValueChange={(v) => setCertification(v === "yes")}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Max Seats */}
                <div className="grid gap-2">
                    <Label>Max Seats</Label>
                    <Input
                        type="number"
                        value={maxSeats}
                        onChange={(e) => setMaxSeats(Number(e.target.value))}
                    />
                </div>

                {/* Language */}
                <div className="grid gap-2">
                    <Label>Language</Label>
                    <Input
                        placeholder="e.g. English"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                </div>

                {/* Subtitles */}
                <div className="grid gap-2">
                    <Label>Subtitles</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add subtitle language (e.g. Hindi)"
                            value={subtitleInput}
                            onChange={(e) => setSubtitleInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtitle())}
                        />
                        <Button type="button" onClick={handleAddSubtitle}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {subtitles.map((sub) => (
                            <Badge key={sub} variant="secondary" className="flex items-center gap-1">
                                {sub}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSubtitle(sub)} />
                            </Badge>
                        ))}
                    </div>
                </div>


                {/* Thumbnail Upload */}
                <div className="grid gap-2">
                    <Label>Thumbnail</Label>
                    {thumbnailUrl ? (
                        <div className="flex flex-col gap-2">
                            <img
                                src={thumbnailUrl}
                                alt="Thumbnail"
                                className="w-48 rounded-lg shadow"
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setThumbnailUrl("")}
                                >
                                    <X className="w-4 h-4 mr-1" /> Remove
                                </Button>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="thumbnail-upload"
                                    onChange={(e) => handleFileUpload(e, "thumbnail")}
                                />
                                <Label
                                    htmlFor="thumbnail-upload"
                                    className="cursor-pointer px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
                                >
                                    Change
                                </Label>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "thumbnail")}
                            />
                            <Upload className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                </div>

                {/* Demo Upload */}
                <div className="grid gap-2">
                    <Label>Demo File</Label>
                    {demoUrl ? (
                        <div className="flex flex-col gap-2">
                            <video src={demoUrl} controls className="w-72 rounded-lg shadow" />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDemoUrl("")}
                                >
                                    <X className="w-4 h-4 mr-1" /> Remove
                                </Button>
                                <Input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    id="demo-upload"
                                    onChange={(e) => handleFileUpload(e, "demo")}
                                />
                                <Label
                                    htmlFor="demo-upload"
                                    className="cursor-pointer px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
                                >
                                    Change
                                </Label>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, "demo")}
                            />
                            <Upload className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                </div>

            </CardContent>

            <CardFooter className="flex justify-end">
                <Button onClick={handleNext}>
                    {mode === "edit" ? "Update Internship" : "Continue"}
                </Button>
            </CardFooter>
        </Card>
    );
}
