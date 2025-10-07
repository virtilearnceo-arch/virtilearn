"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

type Internship = {
    id: string;
    title: string;
    duration: string;
    created_at: string;
};

export default function InternshipDashboard() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const router = useRouter();

    // 🔹 Fetch internships
    const fetchInternships = async () => {
        const { data, error } = await supabase
            .from("internships")
            .select("id, title, duration, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to load internships");
        } else {
            setInternships(data || []);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    // 🔹 Delete internship
    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("internships").delete().eq("id", id);
        if (error) {
            console.error(error);
            toast.error("Failed to delete internship");
        } else {
            toast.success("Internship deleted");
            setInternships(internships.filter((i) => i.id !== id));
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                📚 Internship Dashboard
            </h1>

            <Card className="p-6 border shadow-lg rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Internship Title</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {internships.length > 0 ? (
                            internships.map((internship) => (
                                <TableRow
                                    key={internship.id}
                                    className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition cursor-pointer"
                                >
                                    <TableCell
                                        className="font-medium"
                                        onClick={() =>
                                            router.push(`/admin/dashboard/internships/${internship.id}/sections`)
                                        }
                                    >
                                        {internship.title}
                                    </TableCell>
                                    <TableCell>{internship.duration || "—"}</TableCell>
                                    <TableCell>
                                        {new Date(internship.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                router.push(`/admin/dashboard/internships/${internship.id}/sections`)
                                            }
                                        >
                                            <Pencil className="w-4 h-4 mr-1" /> Edit Sections
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(internship.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                    No internships found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* <Button
                onClick={() => router.push("/admin/dashboard/internships/new")}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg rounded-xl"
            >
                <PlusCircle className="w-5 h-5" /> Create New Internship
            </Button> */}
        </div>
    );
}
