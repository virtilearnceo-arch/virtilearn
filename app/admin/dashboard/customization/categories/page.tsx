"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

export default function CategoriesPage() {
    const supabase = createClient();
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to fetch categories");
        } else {
            setCategories(data || []);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return toast.error("Category name cannot be empty");

        const { error } = await supabase.from("categories").insert([{ name: newCategory.trim() }]);

        if (error) {
            console.error(error);
            toast.error("Failed to add category");
        } else {
            toast.success("Category added");
            setNewCategory("");
            fetchCategories();
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        const { error } = await supabase.from("categories").delete().eq("id", id);

        if (error) {
            console.error(error);
            toast.error("Failed to delete category");
        } else {
            toast.success("Category deleted");
            fetchCategories();
        }
    };

    const handleEdit = async (id: string) => {
        if (!editingValue.trim()) return toast.error("Category name cannot be empty");

        const { error } = await supabase.from("categories").update({ name: editingValue.trim() }).eq("id", id);

        if (error) {
            console.error(error);
            toast.error("Failed to update category");
        } else {
            toast.success("Category updated");
            setEditingId(null);
            setEditingValue("");
            fetchCategories();
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Card className="min-w-[480px]">
                <CardHeader>
                    <CardTitle>Manage Categories</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category"
                    />
                    <Button onClick={handleAddCategory}>Add</Button>
                </CardContent>
            </Card>

            {categories.map((category) => (
                <Card key={category.id} className="flex items-center justify-between p-4 min-w-[480px]">
                    {editingId === category.id ? (
                        <div className="flex flex-1 gap-2">
                            <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                placeholder="Edit category name"
                            />
                            <Button size="sm" onClick={() => handleEdit(category.id)}>Save</Button>
                            <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                    ) : (
                        <>
                            <p className="text-lg font-medium">{category.name}</p>
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" onClick={() => { setEditingId(category.id); setEditingValue(category.name); }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => handleDelete(category.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            ))}
        </div>
    );
}
