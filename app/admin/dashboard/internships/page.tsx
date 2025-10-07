"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

type Internship = {
    id: string;
    title: string;
    description: string | null;
    categories: string[] | null;
    tags: string[] | null;
    price: number;
    estimated_price: number | null;
    level: string | null;
    thumbnail_url: string | null;
    demo_url: string | null;
    duration: string | null;
    skills: string[] | null;
    certification: boolean;
    max_seats: number | null;
    language: string | null;
    subtitles: string[] | null;
    rating: number;
    enrolled_count: number;
    created_at: string;
    updated_at: string;
    average_rating: number;
    total_reviews: number;
};

export default function InternshipTable() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null); // selected internship for deletion

    const supabase = createClient();

    // ✅ Fetch internships
    useEffect(() => {
        const fetchInternships = async () => {
            const { data, error } = await supabase
                .from("internships")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                toast.error("Error fetching internships");
                console.error(error);
            } else {
                setInternships(data || []);
            }
        };
        fetchInternships();
    }, [supabase]);

    const handleDelete = async () => {
        if (!deleteId) return;

        const { error } = await supabase.from("internships").delete().eq("id", deleteId);

        if (error) {
            toast.error("Error deleting internship");
        } else {
            toast.success("Internship deleted");
            setInternships(internships.filter((i) => i.id !== deleteId));
        }

        setDeleteId(null); // close modal
    };


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Internships</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.length > 0 ? (
                        internships.map((internship) => (
                            <TableRow key={internship.id}>
                                <TableCell className="font-medium">
                                    {internship.title}
                                </TableCell>
                                <TableCell>{internship.level || "—"}</TableCell>
                                <TableCell>₹{internship.price}</TableCell>
                                <TableCell>{internship.duration || "N/A"}</TableCell>
                                <TableCell>
                                    {internship.categories?.join(", ") || "—"}
                                </TableCell>
                                <TableCell>
                                    {internship.tags?.join(", ") || "—"}
                                </TableCell>
                                <TableCell>
                                    {new Date(internship.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="flex gap-2 justify-end">
                                    {/* Edit Button */}
                                    <Link
                                        href={`/admin/dashboard/internships/${internship.id}/edit`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>

                                    {/* Manage Sections Button */}
                                    <Link
                                        href={`/admin/dashboard/internships/${internship.id}/sections`}
                                    >
                                        <Button variant="default" size="sm">
                                            Sections
                                        </Button>
                                    </Link>

                                    {/* Delete Button */}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteId(internship.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                                No internships found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Delete Confirmation Modal */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="my-4 text-sm">
                        Are you sure you want to delete this internship? This action cannot be undone.
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
