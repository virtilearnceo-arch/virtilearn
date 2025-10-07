"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

type Internship = {
    id: string;
    title: string;
    description: string;
    categories: string[];
    level: "beginner" | "intermediate" | "advanced" | null;
    price: number;
};

export default function InternshipList() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const { data, error } = await supabase
                    .from("internships")
                    .select("id, title, description, categories, level, price")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                setInternships(data || []);
            } catch (err) {
                console.error("Failed to fetch internships", err);
                toast.error("Failed to load internships");
            }
        };

        fetchInternships();
    }, []);

    const goToProjects = (internshipId: string) => {
        router.push(`/admin/dashboard/internships/projects/${internshipId}/manageprojects`);
    };

    const goToSubmissions = (internshipId: string) => {
        router.push(`/admin/dashboard/internships/projects/${internshipId}/submissions`); // 🔥 new route for evaluation
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📚 Internships</h1>
            <Table className="bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Manage Projects</TableHead>
                        <TableHead>Evaluate Submissions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.map((internship) => (
                        <TableRow key={internship.id}>
                            <TableCell className="font-medium">{internship.title}</TableCell>
                            <TableCell>{(internship.categories || []).join(", ")}</TableCell>
                            <TableCell className="capitalize">{internship.level || "-"}</TableCell>
                            <TableCell>${internship.price}</TableCell>
                            <TableCell>
                                <Button size="sm" variant="default" onClick={() => goToProjects(internship.id)}>
                                    Manage
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button size="sm" variant="secondary" onClick={() => goToSubmissions(internship.id)}>
                                    Evaluate
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
