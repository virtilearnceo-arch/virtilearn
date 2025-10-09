/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Edit, Trash2 } from "lucide-react";

type Internship = {
    id: string;
    title: string;
    level: string | null;
    price: number;
};

type Resource = {
    id: string;
    internship_id: string;
    internships: { title: string; };
    type: string;
    file_url: string;
    created_at: string;
};

export default function ManageResourcesPage() {
    const supabase = createClient();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [open, setOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [type, setType] = useState<"ebook" | "project" | "">("");
    const [file, setFile] = useState<File | null>(null);

    // Fetch internships & resources
    useEffect(() => {
        fetchInternships();
        fetchResources();
    }, []);

    const fetchInternships = async () => {
        try {
            const { data, error } = await supabase
                .from("internships")
                .select("id, title, level, price")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setInternships(data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load internships");
        }
    };

    const fetchResources = async () => {
        try {
            const { data, error } = await supabase
                .from("internship_resources")
                .select(`
                    id, internship_id, type, file_url, created_at,
                    internships:internship_id ( title )
                `)
                .order("created_at", { ascending: false });

            const normalizedResources: Resource[] = (data || []).map((r: any) => ({
                ...r,
                internship: r.internships?.[0] ?? null, // Take first element or null
            }));

            setResources(normalizedResources);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load resources");
        }
    };

    const resetForm = () => {
        setSelectedInternship(null);
        setSelectedResource(null);
        setFile(null);
        setType("");
        setOpen(false);
    };

    // Handle upload or update
    const handleUpload = async () => {
        if ((!selectedInternship && !selectedResource) || !type) {
            toast.error("Please select type and internship");
            return;
        }

        try {
            setLoading(true);

            let fileUrl = selectedResource?.file_url || "";
            if (file) {
                const folder = type === "ebook" ? "ebooks" : "projects";
                const filePath = `${folder}/${Date.now()}_${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from("internship-files")
                    .upload(filePath, file, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from("internship-files")
                    .getPublicUrl(filePath);

                fileUrl = urlData.publicUrl;
            }

            if (selectedResource) {
                // Update existing
                const { error } = await supabase
                    .from("internship_resources")
                    .update({ type, file_url: fileUrl })
                    .eq("id", selectedResource.id);

                if (error) throw error;
                toast.success("Resource updated ✅");
            } else {
                // Add new
                const { error } = await supabase.from("internship_resources").insert({
                    internship_id: selectedInternship!.id,
                    type,
                    file_url: fileUrl,
                });

                if (error) throw error;
                toast.success("Resource added successfully ✅");
            }

            resetForm();
            fetchResources();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to upload or update resource");
        } finally {
            setLoading(false);
        }
    };

    // Delete resource
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        try {
            const { error } = await supabase.from("internship_resources").delete().eq("id", id);
            if (error) throw error;
            toast.success("Resource deleted 🗑️");
            fetchResources();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete resource");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📂 Manage Internship Resources</h1>

            {/* Internship Table */}
            <Table className="bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg mb-12">
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.map((internship) => (
                        <TableRow key={internship.id}>
                            <TableCell>{internship.title}</TableCell>
                            <TableCell>{internship.level || "-"}</TableCell>
                            <TableCell>{internship.price}</TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setSelectedInternship(internship);
                                        setSelectedResource(null);
                                        setOpen(true);
                                    }}
                                >
                                    Add Resource
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Resources Table */}
            <h2 className="text-2xl font-semibold mb-4">📁 Existing Resources</h2>
            <Table className="bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Internship</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                                No resources found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        resources.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.internships?.title || "—"}</TableCell>
                                <TableCell className="capitalize">{r.type}</TableCell>
                                <TableCell>
                                    <a
                                        href={r.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View File
                                    </a>
                                </TableCell>
                                <TableCell>
                                    {new Date(r.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedResource(r);
                                            setType(r.type as any);
                                            setSelectedInternship(
                                                internships.find((i) => i.id === r.internship_id) || null
                                            );
                                            setOpen(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Add / Edit Resource Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedResource
                                ? `Edit Resource for ${selectedInternship?.title}`
                                : `Add Resource for ${selectedInternship?.title}`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <Label>Resource Type</Label>
                            <Select value={type} onValueChange={(val) => setType(val as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ebook">Ebook</SelectItem>
                                    <SelectItem value="project">Project</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Upload File</Label>
                            <Input
                                type="file"
                                accept=".pdf,.docx,.zip,.rar"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            {selectedResource?.file_url && (
                                <a
                                    href={selectedResource.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                                >
                                    Current File
                                </a>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Upload className="h-4 w-4 mr-2" />
                            )}
                            {selectedResource ? "Update" : "Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
