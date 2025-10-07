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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

type Internship = {
    id: string;
    title: string;
    level: string | null;
    price: number;
};

export default function ManageResourcesPage() {
    const supabase = createClient();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [open, setOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [type, setType] = useState<"ebook" | "project" | "">("");
    const [file, setFile] = useState<File | null>(null);

    // Fetch internships
    useEffect(() => {
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
        fetchInternships();
    }, [supabase]);

    const handleUpload = async () => {
        if (!selectedInternship || !file || !type) {
            toast.error("Please select type and upload a file");
            return;
        }

        try {
            setLoading(true);

            // Determine folder by type
            const folder = type === "ebook" ? "ebooks" : "projects";
            const filePath = `${folder}/${Date.now()}_${file.name}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("internship-files")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("internship-files")
                .getPublicUrl(filePath);

            const fileUrl = urlData.publicUrl;

            // Insert into DB
            const { error: insertError } = await supabase.from("internship_resources").insert({
                internship_id: selectedInternship.id,
                type,
                file_url: fileUrl,
            });

            if (insertError) throw insertError;

            toast.success("Resource added successfully ✅");
            setOpen(false);
            setFile(null);
            setType("");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to upload resource");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📂 Manage Internship Resources</h1>

            <Table className="bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg">
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

            {/* Add Resource Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Add Resource for {selectedInternship?.title}
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
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Upload className="h-4 w-4 mr-2" />
                            )}
                            Upload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
