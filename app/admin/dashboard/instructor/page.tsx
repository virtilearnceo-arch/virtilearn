"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

interface Instructor {
    id: string;
    name: string;
    bio: string;
    avatar_url: string;
}

export default function InstructorsPage() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch instructors from DB
    const fetchInstructors = async () => {
        const { data, error } = await supabase.from("instructors").select("*").order("created_at", { ascending: false });
        if (!error && data) setInstructors(data as Instructor[]);
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    // ✅ Upload avatar to Supabase Storage
    const uploadAvatar = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${uuidv4()}/${fileName}`;

        const { error } = await supabase.storage.from("avatars").upload(filePath, file);
        if (error) {
            console.error("Upload error:", error.message);
            return null;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        return data.publicUrl;
    };

    // ✅ Add new instructor
    const addInstructor = async () => {
        if (!name.trim()) return alert("Name is required");

        setLoading(true);
        let avatar_url = "";

        if (avatarFile) {
            const uploadedUrl = await uploadAvatar(avatarFile);
            if (uploadedUrl) avatar_url = uploadedUrl;
        }

        const { error } = await supabase.from("instructors").insert([{ name, bio, avatar_url }]);
        if (error) {
            console.error("Insert error:", error.message);
        } else {
            setName("");
            setBio("");
            setAvatarFile(null);
            fetchInstructors();
        }
        setLoading(false);
    };

    // ✅ Delete instructor
    const deleteInstructor = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await supabase.from("instructors").delete().eq("id", id);
        fetchInstructors();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Add New Instructor */}
            <Card>
                <CardHeader>
                    <CardTitle>➕ Add New Instructor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Instructor Name (e.g., Prem Shinde)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Textarea
                        placeholder="Short Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                    <Button onClick={addInstructor} disabled={loading}>
                        {loading ? "Adding..." : "Add"}
                    </Button>
                </CardContent>
            </Card>

            {/* Instructor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instructors.map((inst) => (
                    <Card key={inst.id} className="flex items-center gap-4 p-4">
                        {inst.avatar_url && (
                            <Image
                                src={inst.avatar_url}
                                alt={inst.name}
                                width={60}
                                height={60}
                                className="rounded-full object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold">{inst.name}</h3>
                            <p className="text-sm text-gray-500">{inst.bio}</p>
                        </div>
                        <Button variant="destructive" onClick={() => deleteInstructor(inst.id)}>
                            Delete
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
