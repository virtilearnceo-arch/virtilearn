/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { toast } from "sonner";
import "katex/dist/katex.min.css";

interface CourseSubmitPreviewProps {
    onBack: () => void;
    courseInfo: any;
    benefits: any;
    content: any;
    instructors?: any[];
    features?: any[];
    resources?: {
        ebook?: File | null;
        projectZip?: File | null;
        ebookUrl?: string | null;       // ✅ previous URL
        projectZipUrl?: string | null;
    };


    mode?: "create" | "edit";
    courseId?: string;
}

export function CourseSubmitPreview({
    onBack,
    courseInfo,
    benefits,
    content,
    instructors = [],
    features = [],
    resources,   // ✅ ADD THIS
    mode = "create",
    courseId,
}: CourseSubmitPreviewProps) {
    const [loading, setLoading] = useState(false);

    const normalizeTitles = (items: any[] = []) =>
        items
            .map((item) => {
                if (!item) return "";
                if (typeof item === "string") return item;
                if (typeof item === "object") {
                    return (
                        item.title ||
                        item.feature ||
                        item.text ||
                        ""
                    );
                }
                return "";
            })
            .filter(Boolean);

    const benefitsList = normalizeTitles(benefits?.benefits);
    const prerequisitesList = normalizeTitles(benefits?.prerequisites);
    const featuresList = normalizeTitles(benefits?.features || []);  // 👈 from benefits page
    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            let newCourseId: string; // ✅ Must be string

            // ---------------- EDIT MODE ----------------
            if (mode === "edit") {
                if (!courseId) {
                    toast.error("Course ID missing for edit mode");
                    return;
                }
                newCourseId = courseId;

                await supabase
                    .from("courses")
                    .update({
                        name: courseInfo?.name,
                        description: courseInfo?.description,
                        categories: courseInfo?.categories,
                        tags: courseInfo?.tags,
                        level: courseInfo?.level,
                        price: Number(courseInfo?.price),
                        estimated_price: Number(courseInfo?.estimated_price),
                        demo_url: courseInfo?.demo_url,
                        thumbnail_url: courseInfo?.thumbnail_url,
                        certification: courseInfo?.certification,
                        duration: courseInfo?.duration || null, // ✅ avoid interval "" error
                        language: courseInfo?.language,
                        subtitles: courseInfo?.subtitles,
                    })
                    .eq("id", newCourseId);

                // Clean old relations
                await supabase.from("course_benefits").delete().eq("course_id", newCourseId);
                await supabase.from("course_prerequisites").delete().eq("course_id", newCourseId);
                await supabase.from("course_features").delete().eq("course_id", newCourseId);
                await supabase.from("course_data").delete().eq("course_id", newCourseId);
                await supabase.from("course_instructors").delete().eq("course_id", newCourseId);
                await supabase.from("course_resources").delete().eq("course_id", newCourseId);

                await insertRelatedData(newCourseId, resources);
                toast.success("✅ Course updated successfully.");

            } else {
                // ---------------- CREATE MODE ----------------
                const { data, error } = await supabase
                    .from("courses")
                    .insert([
                        {
                            name: courseInfo?.name,
                            description: courseInfo?.description,
                            categories: courseInfo?.categories,
                            tags: courseInfo?.tags,
                            level: courseInfo?.level,
                            price: Number(courseInfo?.price),
                            estimated_price: Number(courseInfo?.estimated_price),
                            demo_url: courseInfo?.demo_url,
                            thumbnail_url: courseInfo?.thumbnail_url,
                            certification: courseInfo?.certification,
                            duration: courseInfo?.duration || null, // ✅ avoid interval "" error
                            language: courseInfo?.language,
                            subtitles: courseInfo?.subtitles,
                        },
                    ])
                    .select()
                    .single();

                if (error || !data?.id) {
                    toast.error("❌ Course submission failed.");
                    console.error("Course insert error:", error);
                    return;
                }

                newCourseId = data.id; // ✅ guaranteed string now

                await insertRelatedData(newCourseId, resources);
                toast.success("✅ Course submitted successfully.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong during course submission.");
        } finally {
            setLoading(false);
        }
    };



    // ---------------- Insert Related Data ----------------
    const insertRelatedData = async (
        courseId: string,
        resources?: { ebook?: File | null; projectZip?: File | null; ebookUrl?: string | null; projectZipUrl?: string | null; }
    ) => {
        const supabase = createClient();

        // Benefits, Prerequisites, Features
        const normalizedBenefits = normalizeTitles(benefits?.benefits);
        const normalizedPrereqs = normalizeTitles(benefits?.prerequisites);
        const normalizedFeatures = normalizeTitles(benefits?.features || []);

        if (normalizedBenefits.length)
            await supabase.from("course_benefits").insert(
                normalizedBenefits.map((title) => ({ title, course_id: courseId }))
            );

        if (normalizedPrereqs.length)
            await supabase.from("course_prerequisites").insert(
                normalizedPrereqs.map((title) => ({ title, course_id: courseId }))
            );

        if (normalizedFeatures.length)
            await supabase.from("course_features").insert(
                normalizedFeatures.map((title) => ({ title, course_id: courseId }))
            );

        // Instructors
        if (instructors.length)
            await supabase.from("course_instructors").insert(
                instructors.map((inst) => ({ course_id: courseId, instructor_id: inst.id }))
            );

        // Course Content
        // ---------------- Course Content ----------------
        for (const [sectionIndex, section] of content.entries()) {
            const sectionOrder = section.section_order ?? (sectionIndex + 1);

            for (const [lessonIndex, lesson] of section.lessons.entries()) {
                const { data: lessonData } = await supabase
                    .from("course_data")
                    .insert([
                        {
                            course_id: courseId,
                            section: section.name,
                            section_order: sectionOrder, // ✅ save section_order
                            title: lesson.title,
                            description: lesson.description,
                            suggestion: lesson.suggestion,
                            order: lessonIndex + 1, // ✅ lesson order
                        },
                    ])
                    .select()
                    .single();

                if (!lessonData) continue;

                if (lesson.links?.length)
                    await supabase.from("course_data_links").insert(
                        lesson.links.map((link: any) => ({
                            course_data_id: lessonData.id,
                            title: link.title,
                            url: link.url,
                        }))
                    );
            }
        }


        // ---------------- Resources (Upload Files) ----------------
        let ebookUrl = resources?.ebookUrl || null;
        let projectZipUrl = resources?.projectZipUrl || null;

        if (resources?.ebook) {
            const { data: ebookUpload, error: ebookError } = await supabase.storage
                .from("ebooks")
                .upload(`courses/${courseId}/ebook-${Date.now()}.pdf`, resources.ebook, { cacheControl: "3600", upsert: true });

            if (!ebookError && ebookUpload?.path) {
                ebookUrl = supabase.storage.from("ebooks").getPublicUrl(ebookUpload.path).data.publicUrl;
            } else console.error("Ebook upload failed:", ebookError);
        }

        if (resources?.projectZip) {
            const { data: projectUpload, error: projectError } = await supabase.storage
                .from("projects")
                .upload(`courses/${courseId}/project-${Date.now()}.zip`, resources.projectZip, { cacheControl: "3600", upsert: true });

            if (!projectError && projectUpload?.path) {
                projectZipUrl = supabase.storage.from("projects").getPublicUrl(projectUpload.path).data.publicUrl;
            } else console.error("Project upload failed:", projectError);
        }

        // Only insert if URL exists
        const resourcesToInsert = [];
        if (ebookUrl) resourcesToInsert.push({ course_id: courseId, type: "ebook", file_url: ebookUrl });
        if (projectZipUrl) resourcesToInsert.push({ course_id: courseId, type: "project", file_url: projectZipUrl });

        if (resourcesToInsert.length > 0) {
            await supabase.from("course_resources").insert(resourcesToInsert);
        }
    };




    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">🎓 Final Course Preview</h2>

            {/* Course Info */}
            <Card>
                <CardHeader>
                    <CardTitle>{courseInfo?.name || "Untitled Course"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p><strong>Category:</strong> {courseInfo?.categories}</p>
                    <p><strong>Level:</strong> {courseInfo?.level}</p>
                    <p><strong>Price:</strong> ₹{courseInfo?.price}</p>
                    <p><strong>Estimated Price:</strong> ₹{courseInfo?.estimated_price}</p>
                    <p><strong>Certification:</strong> {courseInfo?.certification ? "✅ Yes" : "❌ No"}</p>
                    <p><strong>Demo URL:</strong> {courseInfo?.demo_url}</p>
                    <p>
                        <strong>Certification:</strong>{" "}
                        {courseInfo?.certification ? "✅ Provided" : "❌ Not Provided"}
                    </p>

                    <p>
                        <strong>Thumbnail:</strong>{" "}
                        {courseInfo?.thumbnail_url && (
                            <img
                                src={courseInfo?.thumbnail_url}
                                alt="Course Thumbnail"
                                className="w-48 rounded"
                            />
                        )}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {courseInfo?.tags?.map((tag: string, i: number) => (
                            <Badge key={i}>{tag}</Badge>
                        ))}
                    </div>

                    <div className="prose dark:prose-invert mt-4">
                        <h4>Description</h4>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                        >
                            {courseInfo?.description || "No description"}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
                <CardHeader>
                    <CardTitle>🚀 What You&apos;ll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6">
                        {benefitsList.length > 0
                            ? benefitsList.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))
                            : "No benefits added"}
                    </ul>
                </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
                <CardHeader>
                    <CardTitle>📚 Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6">
                        {prerequisitesList.length > 0
                            ? prerequisitesList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                            : "No prerequisites added"}
                    </ul>
                </CardContent>
            </Card>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle>✨ Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6">
                        {featuresList.length > 0
                            ? featuresList.map((feature, i) => <li key={i}>{feature}</li>)
                            : "No features added"}
                    </ul>
                </CardContent>
            </Card>

            {/* Resources */}
            <Card>
                <CardHeader>
                    <CardTitle>📦 Extra Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {resources?.ebook ? (
                            <li className="flex items-center gap-2">
                                <span className="font-medium">📕 Ebook:</span>
                                <span>{resources.ebook.name}</span>
                            </li>
                        ) : (
                            <li>❌ No ebook uploaded</li>
                        )}

                        {resources?.projectZip ? (
                            <li className="flex items-center gap-2">
                                <span className="font-medium">🗜️ Project ZIP:</span>
                                <span>{resources.projectZip.name}</span>
                            </li>
                        ) : (
                            <li>❌ No project zip uploaded</li>
                        )}
                    </ul>
                </CardContent>
            </Card>


            {/* Instructors */}
            <Card>
                <CardHeader>
                    <CardTitle>👨‍🏫 Instructors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {instructors.length > 0 ? (
                        instructors.map((instructor, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-2 border rounded-md"
                            >
                                {instructor.avatar_url && (
                                    <img
                                        src={instructor.avatar_url}
                                        alt={instructor.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{instructor.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {instructor.bio || ""}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No instructors assigned</p>
                    )}
                </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
                <CardHeader>
                    <CardTitle>📚 Course Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content?.map((section: any, sIndex: number) => (
                        <div key={sIndex} className="border rounded p-4 bg-muted/20">
                            <h3 className="font-bold text-lg mb-2">📘 {section.name}</h3>
                            {section.lessons.map((lesson: any, lIndex: number) => (
                                <div
                                    key={lIndex}
                                    className="pl-4 space-y-2 border-l-2 border-gray-300 mb-4"
                                >
                                    <h4 className="font-semibold">📖 Lesson: {lesson.title}</h4>
                                    <div className="text-sm prose dark:prose-invert">
                                        <h5>Description</h5>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                                        >
                                            {lesson.description}
                                        </ReactMarkdown>
                                    </div>
                                    {lesson.suggestion && (
                                        <div className="text-sm prose dark:prose-invert mt-2">
                                            <h5>💡 Suggestions</h5>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm, remarkMath]}
                                                rehypePlugins={[rehypeKatex, rehypeRaw]}
                                            >
                                                {lesson.suggestion}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                    {lesson.links?.length > 0 && (
                                        <div className="pt-2">
                                            <h5 className="font-medium">🔗 Reference Links:</h5>
                                            <ul className="list-disc pl-6">
                                                {lesson.links.map((link: any, i: number) => (
                                                    <li key={i}>
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline"
                                                        >
                                                            {link.title || link.url}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    ⬅️ Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading
                        ? "Submitting..."
                        : mode === "edit"
                            ? "✅ Update Course"
                            : "✅ Submit Course"}
                </Button>
            </div>
        </div>
    );
}
