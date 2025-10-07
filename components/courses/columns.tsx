"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export type Course = {
    id: string;
    name: string;
    description: string;
    price: number;
    estimated_price: number | null;
    level: string | null;
    ratings: number | null;
    purchased: number | null;
    created_at: string;
};

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="line-clamp-1 max-w-[200px]">{row.getValue("description")}</span>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `₹${row.getValue("price")}`,
    },
    {
        accessorKey: "estimated_price",
        header: "Estimated Price",
        cell: ({ row }) => row.getValue("estimated_price") ? `₹${row.getValue("estimated_price")}` : "-",
    },
    {
        accessorKey: "level",
        header: "Level",
    },
    {
        accessorKey: "ratings",
        header: "Ratings",
    },
    {
        accessorKey: "purchased",
        header: "Purchased",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const course = row.original;

            const handleDelete = async () => {
                const supabase = createClient();
                const { error } = await supabase.from("courses").delete().eq("id", course.id);
                if (error) {
                    alert("Delete failed!");
                    console.error(error);
                } else {
                    window.location.reload();
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/dashboard/courses/${course.id}/edit`}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
