"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Internship = {
    id: string;
    title: string;
    description?: string;
    level?: string;
    price?: number;
    enrolled_count?: number;
};

export default function InternshipTable() {
    const router = useRouter();
    const [internships, setInternships] = useState<Internship[]>([]);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const { data, error } = await supabase
                    .from("internships")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                setInternships(data || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load internships");
            }
        };
        fetchInternships();
    }, []);

    const goToQuizzes = (internshipId: string) => {
        router.push(`/admin/dashboard/internships/quizzes/${internshipId}/quizzes`);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">📚 Internships Dashboard</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Enrolled</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.map((internship) => (
                        <TableRow key={internship.id}>
                            <TableCell>{internship.title}</TableCell>
                            <TableCell>{internship.description || "-"}</TableCell>
                            <TableCell>{internship.level || "-"}</TableCell>
                            <TableCell>{internship.price || 0}</TableCell>
                            <TableCell>{internship.enrolled_count || 0}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToQuizzes(internship.id)}
                                >
                                    📝 Manage Quizzes
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
