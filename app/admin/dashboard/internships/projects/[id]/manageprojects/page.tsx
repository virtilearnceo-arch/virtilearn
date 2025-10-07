"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type InternshipProject = {
    id?: string;
    title: string;
    description: string;
    resources: string[];
    evaluation_criteria: string[];
    difficulty: "beginner" | "intermediate" | "advanced" | "";
    max_grade: number;
    deadline: string; // ISO string or empty string
};

export default function InternshipProjectsForm() {
    const pathname = usePathname();
    const internshipId = pathname.split("/")[5]; // UUID from URL
    const [projects, setProjects] = useState<InternshipProject[]>([]);

    // Add new blank project
    const addProject = () => {
        setProjects([
            ...projects,
            {
                title: "",
                description: "",
                resources: [],
                evaluation_criteria: [],
                difficulty: "",
                max_grade: 100,
                deadline: "",
            },
        ]);
    };

    const formatForInput = (date: string | null) => {
        if (!date) return "";
        const d = new Date(date);
        // Get local time in YYYY-MM-DDTHH:MM
        const tzOffset = d.getTimezoneOffset() * 60000; // offset in ms
        const localISO = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        return localISO;
    };

    const formatForDB = (inputValue: string) => {
        if (!inputValue) return null;
        const d = new Date(inputValue);
        return d.toISOString(); // UTC ISO string for DB
    };


    // Delete project
    const deleteProject = async (idx: number) => {
        const project = projects[idx];
        if (project.id) {
            const { error } = await supabase
                .from("internship_projects")
                .delete()
                .eq("id", project.id);
            if (error) {
                toast.error("❌ Failed to delete project");
                console.error(error);
                return;
            }
        }
        const updated = [...projects];
        updated.splice(idx, 1);
        setProjects(updated);
        toast.success("✅ Project deleted");
    };
    const handleSave = async () => {
        try {
            for (const project of projects) {
                let projectId = project.id;

                if (projectId) {
                    const { error } = await supabase
                        .from("internship_projects")
                        .update({
                            title: project.title,
                            description: project.description,
                            resources: project.resources,
                            evaluation_criteria: project.evaluation_criteria,
                            difficulty: project.difficulty,
                            max_grade: project.max_grade,
                            deadline: formatForDB(project.deadline), // convert to UTC ISO
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", projectId);
                    if (error) throw error;
                } else {
                    const { data, error } = await supabase
                        .from("internship_projects")
                        .insert({
                            internship_id: internshipId,
                            title: project.title,
                            description: project.description,
                            resources: project.resources,
                            evaluation_criteria: project.evaluation_criteria,
                            difficulty: project.difficulty,
                            max_grade: project.max_grade,
                            deadline: formatForDB(project.deadline),
                        })
                        .select("id")
                        .single();
                    if (error) throw error;
                    project.id = data.id;
                }
            }

            toast.success("✅ Projects saved successfully!");
        } catch (err: any) {
            console.error("Save error:", err);
            toast.error("❌ Failed to save projects");
        }
    };



    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from("internship_projects")
                    .select("*")
                    .eq("internship_id", internshipId)
                    .order("created_at", { ascending: true });
                if (error) throw error;

                // convert deadline for datetime-local input
                const formatted = (data || []).map((p) => ({
                    ...p,
                    deadline: formatForInput(p.deadline),
                    resources: p.resources || [],
                    evaluation_criteria: p.evaluation_criteria || [],
                }));

                setProjects(formatted);
            } catch (err) {
                console.error("Failed to fetch projects", err);
                toast.error("Failed to load projects");
            }
        };

        fetchProjects();
    }, [internshipId]);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center">🚀 Manage Internship Projects</h1>

            <Button onClick={addProject} className="mb-4">
                + Add Project
            </Button>

            {projects.map((project, idx) => (
                <Card key={idx} className="bg-white/90 dark:bg-gray-800 border shadow-lg rounded-2xl">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Project {idx + 1}</CardTitle>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProject(idx)}
                        >
                            Delete
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Title"
                            value={project.title || ""}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].title = e.target.value;
                                setProjects(updated);
                            }}
                        />
                        <Textarea
                            placeholder="Description"
                            value={project.description || ""}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].description = e.target.value;
                                setProjects(updated);
                            }}
                        />
                        <Input
                            placeholder="Resources (comma separated)"
                            value={(project.resources || []).join(", ")}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].resources = e.target.value.split(",").map((r) => r.trim());
                                setProjects(updated);
                            }}
                        />
                        <Input
                            placeholder="Evaluation Criteria (comma separated)"
                            value={(project.evaluation_criteria || []).join(", ")}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].evaluation_criteria = e.target.value
                                    .split(",")
                                    .map((r) => r.trim());
                                setProjects(updated);
                            }}
                        />
                        <select
                            value={project.difficulty || ""}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].difficulty = e.target.value as any;
                                setProjects(updated);
                            }}
                            className="p-2 border rounded-lg w-full"
                        >
                            <option value="">Select Difficulty</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <Input
                            type="number"
                            placeholder="Max Grade"
                            value={project.max_grade || 100}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].max_grade = Number(e.target.value);
                                setProjects(updated);
                            }}
                        />
                        <Input
                            type="datetime-local"
                            placeholder="Deadline"
                            value={project.deadline || ""}
                            onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].deadline = e.target.value;
                                setProjects(updated);
                            }}
                        />
                    </CardContent>
                </Card>
            ))}

            <Button
                onClick={handleSave}
                className="w-full py-3 font-semibold bg-indigo-500 text-white rounded-xl"
            >
                💾 Save Projects
            </Button>
        </div>
    );
}
