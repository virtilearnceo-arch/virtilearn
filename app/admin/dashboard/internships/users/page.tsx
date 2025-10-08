/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type UserInternship = {
    id: string;
    user_id: string;
    internship_id: string;
    role: "student" | "campus_ambassador";
    status: "enrolled" | "in_progress" | "completed" | "dropped";
    progress: number;
    score: number;
    joined_at: string;
    completed_at: string | null;
    users?: {
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    internships?: {
        title: string;
        level: string | null;
    } | null;
};

export default function UserInternshipsTable() {
    const [records, setRecords] = useState<UserInternship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const { data, error } = await supabase
                    .from("user_internships")
                    .select(`
            id,
            user_id,
            internship_id,
            role,
            status,
            progress,
            score,
            joined_at,
            completed_at,
            users!user_internships_user_id_fkey (
              first_name,
              last_name,
              email
            ),
            internships!user_internships_internship_id_fkey (
              title,
              level
            )
          `)
                    .order("joined_at", { ascending: false });

                if (error) throw error;

                // Normalize nested arrays (Supabase joins often return arrays)
                const normalizedData: UserInternship[] = (data || []).map((r: any) => ({
                    ...r,
                    users: Array.isArray(r.users) ? r.users[0] : r.users || null,
                    internships: Array.isArray(r.internships)
                        ? r.internships[0]
                        : r.internships || null,
                }));

                setRecords(normalizedData);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load enrollments");
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">👩‍🎓 User Internships</h1>
            <Card className="p-4 shadow-lg rounded-xl">
                <div className="overflow-x-auto">
                    <Table className="min-w-[1200px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Internship</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Joined At</TableHead>
                                <TableHead>Completed At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center py-6">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : records.length ? (
                                records.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                                        <TableCell>
                                            {r.users
                                                ? `${r.users.first_name || ""} ${r.users.last_name || ""}`
                                                : "-"}
                                        </TableCell>
                                        <TableCell>{r.users?.email || "-"}</TableCell>
                                        <TableCell>{r.internships?.title || "-"}</TableCell>
                                        <TableCell>{r.internships?.level || "-"}</TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    r.role === "student" ? "secondary" : "outline"
                                                }
                                            >
                                                {r.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    r.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : r.status === "in_progress"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : r.status === "dropped"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                }
                                            >
                                                {r.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{r.progress}%</TableCell>
                                        {/* <TableCell>{r.score}</TableCell> */}
                                        <TableCell>
                                            {new Date(r.joined_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {r.completed_at
                                                ? new Date(r.completed_at).toLocaleDateString()
                                                : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center py-6">
                                        No enrollments found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
