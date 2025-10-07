/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    onBack: () => void;
    internshipInfo: any;
    benefits: any[];
    prerequisites: any[];
    features: any[];
    instructors: any[];
    isEdit?: boolean; // ✅ Added
    internshipid: any;
}

export function InternshipSubmitPreview({
    onBack,
    internshipInfo,
    benefits,
    prerequisites,
    features,
    instructors,
    isEdit = false, // ✅ default false
    internshipid
}: Props) {
    const [loading, setLoading] = useState(false);


    // console.log("edit--->", isEdit);
    // console.log("intern id ---->", internshipid);
    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            // Prepare payload
            const payload = {
                ...internshipInfo,
                categories: Array.isArray(internshipInfo.categories)
                    ? internshipInfo.categories
                    : internshipInfo.categories
                        ? internshipInfo.categories.split(",").map((c: string) => c.trim())
                        : [],
                tags: Array.isArray(internshipInfo.tags)
                    ? internshipInfo.tags
                    : internshipInfo.tags
                        ? internshipInfo.tags.split(",").map((t: string) => t.trim())
                        : [],
            };

            let internshipId: string;

            if (isEdit) {
                if (!internshipid) throw new Error("Missing internship ID for edit action");

                // Update existing internship
                const { error } = await supabase
                    .from("internships")
                    .update(payload)
                    .eq("id", internshipid);

                if (error) throw error;

                internshipId = internshipid;
                toast.success("Internship updated successfully!");
            } else {
                // Create new internship
                const { data: internship, error } = await supabase
                    .from("internships")
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;

                internshipId = internship.id;
                toast.success("Internship created successfully!");
            }

            // -----------------------------
            // Related Tables
            // -----------------------------
            const syncTable = async (table: string, rows: any[]) => {
                // In edit mode, clear existing rows before inserting fresh ones
                if (isEdit) {
                    const { error: delError } = await supabase
                        .from(table)
                        .delete()
                        .eq("internship_id", internshipId);
                    if (delError) throw delError;
                }

                if (rows.length > 0) {
                    const { error: insertError } = await supabase.from(table).insert(rows);
                    if (insertError) throw insertError;
                }
            };

            // Benefits
            if (benefits?.length) {
                await syncTable(
                    "internship_benefits",
                    benefits.map((b) => ({
                        internship_id: internshipId,
                        title: b.title,
                        description: b.description,
                        icon_url: b.icon_url,
                        order: b.order,
                    }))
                );
            }

            // Prerequisites
            if (prerequisites?.length) {
                await syncTable(
                    "internship_prerequisites",
                    prerequisites.map((p) => ({
                        internship_id: internshipId,
                        title: p.title,
                        description: p.description,
                    }))
                );
            }

            // Features
            if (features?.length) {
                await syncTable(
                    "internship_features",
                    features.map((f) => ({
                        internship_id: internshipId,
                        title: f.title,
                        description: f.description,
                        icon_url: f.icon_url,
                    }))
                );
            }

            // Instructors
            if (instructors?.length) {
                await syncTable(
                    "internship_instructors",
                    instructors.map((i) => ({
                        internship_id: internshipId,
                        instructor_id: i.instructor_id,
                        role: i.role,
                    }))
                );
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Error saving internship");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">
                {isEdit ? "Update Internship" : "Create Internship"}
            </h2>

            {/* Internship Info */}
            <Card>
                <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-bold">{internshipInfo.title}</h3>
                    <p className="text-sm text-muted-foreground">{internshipInfo.description}</p>
                    <p><b>Duration:</b> {internshipInfo.duration}</p>
                    <p><b>Level:</b> {internshipInfo.level}</p>
                    <p><b>Categories:</b> {internshipInfo.categories?.join(", ")}</p>
                    {internshipInfo.languages?.length > 0 && (
                        <p><b>Languages:</b> {internshipInfo.languages.join(", ")}</p>
                    )}
                    {internshipInfo.subtitles?.length > 0 && (
                        <p><b>Subtitles:</b> {internshipInfo.subtitles.join(", ")}</p>
                    )}
                    {internshipInfo.price && <p><b>Price:</b> ₹{internshipInfo.price}</p>}
                    {internshipInfo.estimated_price && <p><b>Estimated Price:</b> ₹{internshipInfo.estimated_price}</p>}
                    {internshipInfo.certification_available && <p><b>Certification Available:</b> Yes</p>}
                    {internshipInfo.max_seats && <p><b>Max Seats:</b> {internshipInfo.max_seats}</p>}
                    {internshipInfo.tags?.length > 0 && <p><b>Tags:</b> {internshipInfo.tags.join(", ")}</p>}
                    {internshipInfo.skills?.length > 0 && (
                        <div>
                            <b>Skills:</b>
                            <ul className="list-disc ml-6 mt-1">
                                {internshipInfo.skills.map((s: string, idx: number) => (
                                    <li key={idx}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {internshipInfo.thumbnail_url && (
                        <img src={internshipInfo.thumbnail_url} alt="thumbnail" className="w-48 rounded-lg mt-2" />
                    )}
                    {internshipInfo.demo_url && (
                        <video src={internshipInfo.demo_url} controls className="w-full max-w-lg mt-4 rounded-lg shadow" />
                    )}
                </CardContent>
            </Card>

            {/* Benefits */}
            {benefits?.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Benefits</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            {benefits.map((b, idx) => (
                                <li key={idx}><b>{b.title}</b> – {b.description}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Prerequisites */}
            {prerequisites?.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Prerequisites</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            {prerequisites.map((p, idx) => (
                                <li key={idx}><b>{p.title}</b> – {p.description}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Features */}
            {features?.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Features</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            {features.map((f, idx) => (
                                <li key={idx}><b>{f.title}</b> – {f.description}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Instructors */}
            {instructors?.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Instructors</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {instructors.map((inst, idx) => (
                                <div key={idx} className="flex items-center space-x-3 p-2 border rounded-lg">
                                    {inst.avatar_url ? (
                                        <img src={inst.avatar_url} alt={inst.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                                    )}
                                    <div>
                                        <p className="font-semibold">{inst.name}</p>
                                        <p className="text-sm text-muted-foreground">{inst.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (isEdit ? "Updating..." : "Submitting...") : isEdit ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
