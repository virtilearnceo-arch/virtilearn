"use client";

import * as React from "react";
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Course = {
    id: string;
    name: string;
    categories: string;
    tags: string[];
    level: string;
    price: number;
    purchased: number;
    ratings: number;
    created_at: string;
    thumbnail_url: string;
};

export default function CoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch courses");
            console.error(error);
        } else {
            setCourses(data || []);
            toast.success("Courses loaded successfully");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        toast("Are you sure?", {
            description: "This will permanently delete the course.",
            action: {
                label: "Delete",
                onClick: async () => {
                    const { error } = await supabase.from("courses").delete().eq("id", id);
                    if (error) {
                        toast.error("Failed to delete course.");
                        console.error(error);
                    } else {
                        setCourses((prev) => prev.filter((item) => item.id !== id));
                        toast.success("Course deleted successfully.");
                    }
                },
            },
        });
    };

    const filteredCourses = React.useMemo(
        () => courses.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
        [courses, search]
    );

    const columns = React.useMemo<ColumnDef<Course>[]>(() => [
        {
            accessorKey: "thumbnail_url",
            header: "Thumbnail",
            cell: ({ row }) => (
                <img
                    src={row.original.thumbnail_url || "/default-thumbnail.png"}
                    alt={row.original.name}
                    className="w-14 h-14 object-cover rounded-md border bg-muted"
                />
            ),
        },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "categories", header: "Category" },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) =>
                row.original.tags.length ? (
                    <div className="flex flex-wrap gap-1">
                        {row.original.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    "-"
                ),
        },
        { accessorKey: "level", header: "Level" },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => `₹${row.original.price}`,
        },
        { accessorKey: "purchased", header: "Purchased" },
        { accessorKey: "ratings", header: "Ratings" },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/admin/dashboard/courses/${row.original.id}/edit`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/dashboard/courses/${row.original.id}/quizzes`}>
                            <DropdownMenuItem>Manage Quizzes</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },

    ], []);

    const table = useReactTable({
        data: filteredCourses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Courses</h2>
                <Link href="/admin/dashboard/courses/new">
                    <Button>Add New</Button>
                </Link>
            </div>

            <Input
                placeholder="Search course name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />

            <div className="rounded-md border overflow-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="whitespace-nowrap px-4 py-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="whitespace-nowrap px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center py-4">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
