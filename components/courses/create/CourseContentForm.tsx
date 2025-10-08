/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { VditorEditor } from "@/components/VditorEditor";

import "katex/dist/katex.min.css";

interface LinkItem {
    title: string;
    url: string;
}

interface Lesson {
    title: string;
    description: string;
    suggestion: string;
    links: LinkItem[];
}

interface Section {
    name: string;
    lessons: Lesson[];
    section_order: number; // ✅ new field

}

interface RawCourseData {
    section: string;
    title: string;
    section_order: number; // ✅ new field
    description: string;
    suggestion: string;
    course_data_links: {
        title: string;
        url: string;
    }[];
}

interface Props {
    onNext: () => void;
    onBack: () => void;
    onChange: (data: Section[]) => void;
    defaultValues?: RawCourseData[];
    mode?: "create" | "edit";
    courseId?: string;
}
function transformCourseDataToSections(rawData: RawCourseData[]): Section[] {
    if (!Array.isArray(rawData)) return [];

    const sectionMap: Record<string, Section> = {};
    let orderCounter = 1;

    rawData.forEach((item) => {
        const sectionName = item.section || "Untitled";

        if (!sectionMap[sectionName]) {
            sectionMap[sectionName] = {
                name: sectionName,
                lessons: [],
                section_order: orderCounter++, // ✅ assign order here
            };
        }

        sectionMap[sectionName].lessons.push({
            title: item.title || "",
            description: item.description || "",
            suggestion: item.suggestion || "",
            links: Array.isArray(item.course_data_links)
                ? item.course_data_links.map((link) => ({
                    title: link.title || "",
                    url: link.url || "",
                }))
                : [],
        });
    });

    // Convert map to array and sort by section_order
    return Object.values(sectionMap).sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0));
}



export function CourseContentForm({
    onNext,
    onBack,
    onChange,
    defaultValues,
    mode = "create",
    courseId,
}: Props) {
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        if (defaultValues && defaultValues.length > 0) {
            // console.log("Raw defaultValues received:", defaultValues);
            const transformed = transformCourseDataToSections(defaultValues);
            // console.log("Transformed Sections:", transformed);
            setSections(transformed);
        } else {
            setSections([]);
        }
    }, [defaultValues]);

    useEffect(() => {
        // console.log("Sections state updated:", sections);
    }, [sections]);

    const handleAddSection = () => {
        setSections((prev) => [
            ...prev,
            {
                name: "",
                lessons: [],
                section_order: prev.length + 1, // ✅ assign order
            },
        ]);
    };


    const handleRemoveSection = (index: number) =>
        setSections((prev) => prev.filter((_, i) => i !== index));

    const handleSectionNameChange = (value: string, index: number) => {
        const updated = [...sections];
        updated[index].name = value;
        setSections(updated);
    };

    const handleAddLesson = (sectionIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].lessons.push({
            title: "",
            description: "",
            suggestion: "",
            links: [],
        });
        setSections(updated);
    };

    const handleRemoveLesson = (sectionIndex: number, lessonIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].lessons.splice(lessonIndex, 1);
        setSections(updated);
    };

    const handleLessonChange = (
        sectionIndex: number,
        lessonIndex: number,
        field: keyof Lesson,
        value: string
    ) => {
        const updated = [...sections];
        if (field !== "links") {
            updated[sectionIndex].lessons[lessonIndex][field] = value as any;
            setSections(updated);
        }
    };

    const handleAddLink = (sectionIndex: number, lessonIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].lessons[lessonIndex].links.push({ title: "", url: "" });
        setSections(updated);
    };

    const handleRemoveLink = (sectionIndex: number, lessonIndex: number, linkIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].lessons[lessonIndex].links.splice(linkIndex, 1);
        setSections(updated);
    };

    const handleLinkChange = (
        sectionIndex: number,
        lessonIndex: number,
        linkIndex: number,
        field: keyof LinkItem,
        value: string
    ) => {
        const updated = [...sections];
        updated[sectionIndex].lessons[lessonIndex].links[linkIndex][field] = value;
        setSections(updated);
    };

    const handleNext = () => {
        onChange(sections);
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">📚 Course Content</h2>

            {sections.map((section, sIndex) => (
                <Card key={sIndex} className="bg-muted/20 dark:bg-muted-dark/20">
                    <CardHeader>
                        <CardTitle>Section {sIndex + 1}</CardTitle>
                        <Input
                            placeholder="Section name (e.g., HTML Basics)"
                            value={section.name}
                            onChange={(e) => handleSectionNameChange(e.target.value, sIndex)}
                            className="mt-2"
                        />
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {section.lessons.map((lesson, lIndex) => (
                            <div
                                key={lIndex}
                                className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    Lesson {lIndex + 1}
                                </h3>
                                <Input
                                    placeholder="Lesson title"
                                    value={lesson.title}
                                    onChange={(e) =>
                                        handleLessonChange(sIndex, lIndex, "title", e.target.value)
                                    }
                                    className="dark:bg-gray-700 dark:text-gray-100"
                                />

                                <div>
                                    <label className="font-semibold mb-2 block text-gray-900 dark:text-gray-100">
                                        📝 Markdown Description
                                    </label>
                                    <VditorEditor
                                        value={lesson.description}
                                        onChange={(val) =>
                                            handleLessonChange(sIndex, lIndex, "description", val)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold mb-2 block text-gray-900 dark:text-gray-100">
                                        💡 Suggestions
                                    </label>
                                    <VditorEditor
                                        value={lesson.suggestion}
                                        onChange={(val) =>
                                            handleLessonChange(sIndex, lIndex, "suggestion", val)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                        📎 Reference Links
                                    </h4>
                                    {lesson.links.map((link, linkIndex) => (
                                        <div key={linkIndex} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Title"
                                                value={link.title}
                                                onChange={(e) =>
                                                    handleLinkChange(sIndex, lIndex, linkIndex, "title", e.target.value)
                                                }
                                                className="dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            <Input
                                                placeholder="URL"
                                                value={link.url}
                                                onChange={(e) =>
                                                    handleLinkChange(sIndex, lIndex, linkIndex, "url", e.target.value)
                                                }
                                                className="dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleRemoveLink(sIndex, lIndex, linkIndex)}
                                            >
                                                ❌
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleAddLink(sIndex, lIndex)}
                                    >
                                        ➕ Add Link
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveLesson(sIndex, lIndex)}
                                >
                                    ❌ Remove Lesson
                                </Button>
                            </div>
                        ))}

                        <Button type="button" onClick={() => handleAddLesson(sIndex)}>
                            ➕ Add Lesson
                        </Button>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleRemoveSection(sIndex)}
                        >
                            ❌ Remove Section
                        </Button>
                    </CardFooter>
                </Card>

            ))}

            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={onBack}>
                    ⬅️ Back
                </Button>
                <div className="flex gap-2">
                    <Button onClick={handleAddSection}>➕ Add Section</Button>
                    <Button onClick={handleNext}>Next ➡️</Button>
                </div>
            </div>
        </div>
    );
}
