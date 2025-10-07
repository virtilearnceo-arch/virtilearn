/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function UsersManagementPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);

        // ✅ join purchases + courses
        const { data, error } = await supabase
            .from("users")
            .select(`
                id,
                email,
                first_name,
                last_name,
                role,
                profile_picture,
                created_at,
                purchases (
                    id,
                    course_id,
                    status,
                    courses ( id, name, price )
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to fetch users");
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    const updateUserRole = async (id: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from("users")
                .update({ role: newRole })
                .eq("id", id);

            if (error) throw error;

            toast.success(`Role updated to ${newRole}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(
                err instanceof Error ? err.message : "Error updating role"
            );
        }
    };

    // const getAvatarUrl = (path: string) => {
    //     if (!path) return null;
    //     return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
    // };

    const getAvatarUrl = (path: string) => {
        if (!path) return null;
        // If it's already a full URL, return as-is
        if (path.startsWith("http")) return path;
        // Otherwise assume it's stored in Supabase storage
        return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
    };


    const filteredUsers = users.filter(
        (u) =>
            u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">User Management</h2>
                <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[300px]"
                />
            </div>

            <div className="rounded-md border overflow-auto">
                <div className="min-w-[1200px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profile</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Courses</TableHead>
                                <TableHead>Change Role</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9}>Loading...</TableCell>
                                </TableRow>
                            ) : filteredUsers.length ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            {user.profile_picture ? (
                                                <Image
                                                    src={
                                                        getAvatarUrl(
                                                            user.profile_picture
                                                        ) ||
                                                        "/default-avatar.png"
                                                    }
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                    {user.first_name?.[0]?.toUpperCase() ||
                                                        "?"}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.first_name}</TableCell>
                                        <TableCell>{user.last_name}</TableCell>
                                        <TableCell>{user.role}</TableCell>

                                        {/* ✅ Show enrolled courses */}
                                        <TableCell>
                                            {user.purchases?.length ? (
                                                <ul className="list-disc list-inside">
                                                    {user.purchases.map((p: any) => (
                                                        <li key={p.id}>
                                                            {p.courses?.name}{" "}
                                                            <span className="text-xs text-muted-foreground">
                                                                ({p.status})
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    No courses
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Select
                                                value={user.role}
                                                onValueChange={(value) =>
                                                    updateUserRole(user.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue placeholder="Change Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["student", "admin", "instructor"].map(
                                                        (role) => (
                                                            <SelectItem
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {role}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
