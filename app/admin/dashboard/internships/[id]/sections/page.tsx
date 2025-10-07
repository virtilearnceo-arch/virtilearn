/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { VditorEditor } from "@/components/VditorEditor";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { PlusCircle, Link2, Layers, FileText } from "lucide-react";

type InternshipTab = {
    id?: string; // ✅ add

    title: string;
    content: string;
    order: number;
    is_preview: boolean;
};

type InternshipSubsection = {
    id?: string; // ✅ add

    title: string;
    description: string;
    order: number;
    duration: string;
    is_preview: boolean;
    tabs: InternshipTab[];
};

type InternshipSectionLink = {
    id?: string; // ✅ add

    title: string;
    url: string;
};

type InternshipSection = {
    id?: string; // ✅ add

    title: string;
    description: string;
    order: number;
    duration: string;
    is_preview: boolean;
    links: InternshipSectionLink[];
    subsections: InternshipSubsection[];
};

export default function InternshipSectionsForm() {
    const [sections, setSections] = useState<InternshipSection[]>([]);
    const pathname = usePathname();
    const internshipId = pathname.split("/")[4];

    const [deleteTarget, setDeleteTarget] = useState<{
        type: "section" | "subsection" | "link" | "tab" | null;
        sIdx?: number;
        subIdx?: number;
        lIdx?: number;
        tIdx?: number;
    } | null>(null);

    // Handlers
    const addSection = () =>
        setSections([
            ...sections,
            {
                title: "",
                description: "",
                order: sections.length + 1,
                duration: "",
                is_preview: false,
                links: [],
                subsections: [],
            },
        ]);

    const addLink = (sIdx: number) => {
        const updated = [...sections];
        updated[sIdx].links.push({ title: "", url: "" });
        setSections(updated);
    };

    const addSubsection = (sIdx: number) => {
        const updated = [...sections];
        updated[sIdx].subsections.push({
            title: "",
            description: "",
            order: updated[sIdx].subsections.length + 1,
            duration: "",
            is_preview: false,
            tabs: [],
        });
        setSections(updated);
    };

    const addTab = (sIdx: number, subIdx: number) => {
        const updated = [...sections];
        updated[sIdx].subsections[subIdx].tabs.push({
            title: "",
            content: "",
            order: updated[sIdx].subsections[subIdx].tabs.length + 1,
            is_preview: false,
        });
        setSections(updated);
    };
    const handleSubmit = async () => {
        try {
            for (const section of sections) {
                let sectionId = section.id;

                // Upsert section
                if (sectionId) {
                    const { error } = await supabase
                        .from("internship_sections")
                        .update({
                            title: section.title,
                            description: section.description,
                            order: section.order,
                            duration: section.duration,
                            is_preview: section.is_preview,
                        })
                        .eq("id", sectionId);
                    if (error) throw error;
                } else {
                    const { data, error } = await supabase
                        .from("internship_sections")
                        .insert({
                            internship_id: internshipId,
                            title: section.title,
                            description: section.description,
                            order: section.order,
                            duration: section.duration,
                            is_preview: section.is_preview,
                        })
                        .select("id")
                        .single();
                    if (error) throw error;
                    sectionId = data.id;
                    section.id = sectionId; // Save id for next updates
                }

                // Links
                for (const link of section.links) {
                    if (link.id) {
                        const { error } = await supabase
                            .from("internship_section_links")
                            .update({ title: link.title, url: link.url })
                            .eq("id", link.id);
                        if (error) throw error;
                    } else {
                        const { data, error } = await supabase
                            .from("internship_section_links")
                            .insert({ section_id: sectionId, title: link.title, url: link.url })
                            .select("id")
                            .single();
                        if (error) throw error;
                        link.id = data.id;
                    }
                }

                // Subsections
                for (const sub of section.subsections) {
                    let subId = sub.id;
                    if (subId) {
                        const { error } = await supabase
                            .from("internship_subsections")
                            .update({
                                title: sub.title,
                                description: sub.description,
                                order: sub.order,
                                duration: sub.duration,
                                is_preview: sub.is_preview,
                            })
                            .eq("id", subId);
                        if (error) throw error;
                    } else {
                        const { data, error } = await supabase
                            .from("internship_subsections")
                            .insert({
                                section_id: sectionId,
                                title: sub.title,
                                description: sub.description,
                                order: sub.order,
                                duration: sub.duration,
                                is_preview: sub.is_preview,
                            })
                            .select("id")
                            .single();
                        if (error) throw error;
                        subId = data.id;
                        sub.id = subId;
                    }

                    // Tabs
                    // Tabs
                    for (const tab of sub.tabs) {
                        if (tab.id) {
                            const { error } = await supabase
                                .from("internship_tabs")
                                .update({
                                    title: tab.title,
                                    content: tab.content,   // ✅ save plain text
                                    order: tab.order,
                                    is_preview: tab.is_preview,
                                })
                                .eq("id", tab.id);
                            if (error) throw error;
                        } else {
                            const { data, error } = await supabase
                                .from("internship_tabs")
                                .insert({
                                    subsection_id: subId,
                                    title: tab.title,
                                    content: tab.content,   // ✅ save plain text
                                    order: tab.order,
                                    is_preview: tab.is_preview,
                                })
                                .select("id")
                                .single();
                            if (error) throw error;
                            tab.id = data.id;
                        }
                    }

                }
            }

            toast.success("✅ Internship sections saved successfully!");
        } catch (err: any) {
            console.error("Save error:", err);
            toast.error("❌ Failed to save internship sections");
        }
    };

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // 1️⃣ Fetch sections
                const { data: sectionData, error: sectionError } = await supabase
                    .from("internship_sections")
                    .select(
                        `
              id, title, description, order, duration, is_preview,
              internship_section_links (id, title, url),
              internship_subsections (
                id, title, description, order, duration, is_preview,
                internship_tabs (id, title, content, order, is_preview)
              )
            `
                    )
                    .eq("internship_id", internshipId)
                    .order("order", { ascending: true });

                if (sectionError) throw sectionError;

                // 2️⃣ Transform into frontend shape
                const transformed: InternshipSection[] = (sectionData || []).map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    description: s.description,
                    order: s.order,
                    duration: s.duration,
                    is_preview: s.is_preview,
                    links: (s.internship_section_links || []).map((l: any) => ({
                        id: l.id, // ✅ store link id
                        title: l.title,
                        url: l.url,
                    })),
                    subsections: (s.internship_subsections || []).map((sub: any) => ({
                        id: sub.id,
                        title: sub.title,
                        description: sub.description,
                        order: sub.order,
                        duration: sub.duration,
                        is_preview: sub.is_preview,
                        tabs: (sub.internship_tabs || []).map((t: any) => ({
                            id: t.id,
                            title: t.title,
                            content: t.content || "",   // ✅ plain text directly
                            order: t.order,
                            is_preview: t.is_preview,
                        })),

                    })),
                }));

                setSections(transformed);
            } catch (err) {
                console.error("❌ Failed to load sections:", err);
                toast.error("Failed to load internship sections");
            }
        };

        fetchSections();
    }, [internshipId]);



    // Helper to delete from Supabase
    const handleDeleteFromDB = async (table: string, id?: string) => {
        if (!id) return;
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
    };

    // Delete handlers
    const deleteSection = async (sIdx: number) => {
        const confirmDelete = (type: "section" | "subsection" | "link" | "tab", sIdx: number, subIdx?: number, lIdx?: number, tIdx?: number) => {
            setDeleteTarget({ type, sIdx, subIdx, lIdx, tIdx });
        };

        try {
            const section = sections[sIdx];
            if (section.id) await handleDeleteFromDB("internship_sections", section.id);

            const updated = [...sections];
            updated.splice(sIdx, 1);
            setSections(updated);
            toast.success("Section deleted");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to delete section");
        }
    };

    const deleteSubsection = async (sIdx: number, subIdx: number) => {
        try {
            const sub = sections[sIdx].subsections[subIdx];
            if (sub.id) await handleDeleteFromDB("internship_subsections", sub.id);

            const updated = [...sections];
            updated[sIdx].subsections.splice(subIdx, 1);
            setSections(updated);
            toast.success("Subsection deleted");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to delete subsection");
        }
    };

    const deleteTab = async (sIdx: number, subIdx: number, tIdx: number) => {
        try {
            const tab = sections[sIdx].subsections[subIdx].tabs[tIdx];
            if (tab.id) await handleDeleteFromDB("internship_tabs", tab.id);

            const updated = [...sections];
            updated[sIdx].subsections[subIdx].tabs.splice(tIdx, 1);
            setSections(updated);
            toast.success("Tab deleted");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to delete tab");
        }
    };

    const deleteLink = async (sIdx: number, lIdx: number) => {
        try {
            const link = sections[sIdx].links[lIdx];
            if (link.id) await handleDeleteFromDB("internship_section_links", link.id);

            const updated = [...sections];
            updated[sIdx].links.splice(lIdx, 1);
            setSections(updated);
            toast.success("Link deleted");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to delete link");
        }
    };


    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                🚀 Manage Internship Sections
            </h1>

            <Button onClick={addSection} className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Add Section
            </Button>

            {sections.map((section, sIdx) => (
                <Card
                    key={sIdx}
                    className="mt-6 border border-gray-200/30 shadow-lg hover:shadow-xl transition rounded-2xl bg-gradient-to-br from-white/90 to-gray-50 dark:from-gray-900 dark:to-gray-800"
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Layers className="w-5 h-5 text-indigo-500" /> Section {sIdx + 1}
                        </CardTitle>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSection(sIdx)}
                            className="ml-auto"
                        >
                            Delete Section
                        </Button>

                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Section Fields */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                placeholder="Section Title"
                                value={section.title}
                                onChange={(e) => {
                                    const updated = [...sections];
                                    updated[sIdx].title = e.target.value;
                                    setSections(updated);
                                }}
                            />
                            <Input
                                placeholder="Duration (e.g. 30 min)"
                                value={section.duration}
                                onChange={(e) => {
                                    const updated = [...sections];
                                    updated[sIdx].duration = e.target.value;
                                    setSections(updated);
                                }}
                            />
                        </div>

                        {/* <VditorEditor
                            value={section.description}
                            onChange={(val) => {
                                const updated = [...sections];
                                updated[sIdx].description = val;
                                setSections(updated);
                            }}
                        /> */}

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={section.is_preview}
                                onCheckedChange={(val) => {
                                    const updated = [...sections];
                                    updated[sIdx].is_preview = !!val;
                                    setSections(updated);
                                }}
                            />
                            <span className="text-sm">Preview Enabled</span>
                        </div>

                        {/* Links */}
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Link2 className="w-4 h-4 text-green-500" /> Links
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addLink(sIdx)}
                                className="mb-2"
                            >
                                + Add Link
                            </Button>
                            {section.links.map((link, lIdx) => (
                                <div key={lIdx} className="flex gap-2">
                                    <div className="flex justify-between space-x-2 mb-4" >
                                        <Input
                                            placeholder="Link Title"
                                            value={link.title}
                                            onChange={(e) => {
                                                const updated = [...sections];
                                                updated[sIdx].links[lIdx].title = e.target.value;
                                                setSections(updated);
                                            }}
                                        />


                                        <Input
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => {
                                                const updated = [...sections];
                                                updated[sIdx].links[lIdx].url = e.target.value;
                                                setSections(updated);
                                            }}
                                        />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteLink(sIdx, lIdx)}
                                        >
                                            Delete Link
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subsections */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-500" /> Subsections
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addSubsection(sIdx)}
                            >
                                + Add Subsection
                            </Button>

                            {section.subsections.map((sub, subIdx) => (
                                <Card key={subIdx} className="p-5 mt-3 border rounded-xl shadow-sm bg-white/80 dark:bg-gray-800">
                                    <div className="flex justify-between mb-4">

                                        <h4 className="font-semibold text-indigo-600 mb-2">
                                            Subsection {subIdx + 1}
                                        </h4>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteSubsection(sIdx, subIdx)}
                                        >
                                            Delete Subsection
                                        </Button>

                                    </div>


                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Input
                                            placeholder="Subsection Title"
                                            value={sub.title}
                                            onChange={(e) => {
                                                const updated = [...sections];
                                                updated[sIdx].subsections[subIdx].title = e.target.value;
                                                setSections(updated);
                                            }}
                                        />
                                        <Input
                                            placeholder="Duration"
                                            value={sub.duration}
                                            onChange={(e) => {
                                                const updated = [...sections];
                                                updated[sIdx].subsections[subIdx].duration = e.target.value;
                                                setSections(updated);
                                            }}
                                        />
                                    </div>

                                    {/* <VditorEditor
                                        value={sub.description}
                                        onChange={(val) => {
                                            const updated = [...sections];
                                            updated[sIdx].subsections[subIdx].description = val;
                                            setSections(updated);
                                        }}
                                    /> */}

                                    <div className="flex items-center gap-2 mt-2">
                                        <Checkbox
                                            checked={sub.is_preview}
                                            onCheckedChange={(val) => {
                                                const updated = [...sections];
                                                updated[sIdx].subsections[subIdx].is_preview = !!val;
                                                setSections(updated);
                                            }}
                                        />
                                        <span className="text-sm">Preview Enabled</span>
                                    </div>

                                    {/* Tabs */}
                                    <div className="mt-4 space-y-2">
                                        <h5 className="font-semibold">Tabs</h5>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addTab(sIdx, subIdx)}
                                        >
                                            + Add Tab
                                        </Button>

                                        {sub.tabs.map((tab, tIdx) => (
                                            <Card key={tIdx} className="p-4 mt-2 rounded-lg border bg-gray-50 dark:bg-gray-900">
                                                <div className="flex  justify-between space-x-3 mx-2 mb-4">
                                                    <Input
                                                        placeholder="Tab Title"
                                                        value={tab.title}
                                                        onChange={(e) => {
                                                            const updated = [...sections];
                                                            updated[sIdx].subsections[subIdx].tabs[tIdx].title =
                                                                e.target.value;
                                                            setSections(updated);
                                                        }}
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteTab(sIdx, subIdx, tIdx)}
                                                    >
                                                        Delete Tab
                                                    </Button>
                                                </div>
                                                <VditorEditor
                                                    value={tab.content}
                                                    onChange={(val) => {
                                                        const updated = [...sections];
                                                        updated[sIdx].subsections[subIdx].tabs[tIdx].content = val;
                                                        setSections(updated);
                                                    }}
                                                />
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Checkbox
                                                        checked={tab.is_preview}
                                                        onCheckedChange={(val) => {
                                                            const updated = [...sections];
                                                            updated[sIdx].subsections[subIdx].tabs[tIdx].is_preview =
                                                                !!val;
                                                            setSections(updated);
                                                        }}
                                                    />
                                                    <span className="text-sm">Preview Enabled</span>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>



                                </Card>
                            ))}
                        </div>
                        <Button onClick={addSection} className="flex items-center gap-2 mt-2">
                            <PlusCircle className="w-4 h-4" /> Add Section
                        </Button>

                    </CardContent>

                </Card>
            ))}

            <Button
                onClick={handleSubmit}
                className="mt-8 w-full py-3 font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition"
            >
                💾 Save All Sections
            </Button>
        </div>
    );
}
