"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ProjectSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("internship_project_submissions")
            .select(
                `
                id, status, grade, feedback, submitted_at,
                github_link, ppt_url,
                user_internship:user_internship_id (
                    id,
                    user:users(id, first_name, last_name, email)
                ),
                project:project_id (id, title)
                `
            )
            .order("submitted_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to fetch submissions");
        } else {
            setSubmissions(data || []);
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string, updates: any) => {
        // 1) Update the submission
        const { error } = await supabase
            .from("internship_project_submissions")
            .update({
                ...updates,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            toast.error("Failed to update submission");
            return;
        }

        // 2) If approved, also update user_internships
        if (updates.status === "approved") {
            const submission = submissions.find((s) => s.id === id);
            if (submission?.user_internship?.id) {
                const { error: userErr } = await supabase
                    .from("user_internships")
                    .update({
                        status: "completed",
                        progress: 100,
                        completed_at: new Date().toISOString(),
                    })
                    .eq("id", submission.user_internship.id);

                if (userErr) {
                    console.error(userErr);
                    toast.error("Submission saved, but failed to update user internship");
                }
            }
        }

        toast.success("Submission updated");
        fetchSubmissions();
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📂 Project Submissions</h1>

            <Table className="bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Links</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell>
                                {s.user_internship?.user?.first_name}{" "}
                                {s.user_internship?.user?.last_name}
                                <br />
                                <span className="text-sm text-gray-500">
                                    {s.user_internship?.user?.email}
                                </span>
                            </TableCell>
                            <TableCell>{s.project?.title}</TableCell>
                            <TableCell>
                                <a
                                    href={s.github_link}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    GitHub
                                </a>
                                {s.ppt_url && (
                                    <>
                                        {" | "}
                                        <a
                                            href={s.ppt_url}
                                            target="_blank"
                                            className="text-purple-600 underline"
                                        >
                                            PPT
                                        </a>
                                    </>
                                )}
                            </TableCell>

                            {/* Status dropdown */}
                            <TableCell>
                                <Select
                                    defaultValue={s.status}
                                    onValueChange={(val) =>
                                        setSubmissions((prev) =>
                                            prev.map((row) =>
                                                row.id === s.id
                                                    ? { ...row, status: val }
                                                    : row
                                            )
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="submitted">Submitted</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="resubmit_required">
                                            Resubmit Required
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>

                            {/* Grade input */}
                            <TableCell>
                                <Input
                                    type="number"
                                    className="w-20"
                                    value={s.grade || ""}
                                    onChange={(e) =>
                                        setSubmissions((prev) =>
                                            prev.map((row) =>
                                                row.id === s.id
                                                    ? { ...row, grade: e.target.value }
                                                    : row
                                            )
                                        )
                                    }
                                />
                            </TableCell>

                            {/* Feedback input */}
                            <TableCell>
                                <Input
                                    type="text"
                                    className="w-48"
                                    value={s.feedback || ""}
                                    onChange={(e) =>
                                        setSubmissions((prev) =>
                                            prev.map((row) =>
                                                row.id === s.id
                                                    ? { ...row, feedback: e.target.value }
                                                    : row
                                            )
                                        )
                                    }
                                />
                            </TableCell>

                            {/* Submit button */}
                            <TableCell>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleUpdate(s.id, {
                                            status: s.status,
                                            grade: s.grade ? Number(s.grade) : null,
                                            feedback: s.feedback,
                                        })
                                    }
                                >
                                    Save
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
