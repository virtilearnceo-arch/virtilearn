"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";

type Coupon = {
    id: string;
    code: string;
    discount_percent: number;
    course_id: string | null;
    max_uses: number | null;
    used_count: number;
    expires_at: string | null;
    created_at: string;
};

export default function CouponPage() {
    const supabase = createClient();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [courseId, setCourseId] = useState("");
    const [maxUses, setMaxUses] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
        if (error) toast.error("Failed to load coupons");
        else setCoupons(data || []);
        setLoading(false);
    };

    const createCoupon = async () => {
        if (!code || !discount) {
            return toast.error("Coupon code and discount are required");
        }

        const { error } = await supabase.from("coupons").insert({
            code,
            discount_percent: Number(discount),
            course_id: courseId || null,
            max_uses: maxUses ? Number(maxUses) : null,
            expires_at: expiresAt || null,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Coupon created successfully 🎉");
            setCode("");
            setDiscount("");
            setCourseId("");
            setMaxUses("");
            setExpiresAt("");
            fetchCoupons();
        }
    };

    const deleteCoupon = async (id: string) => {
        const { error } = await supabase.from("coupons").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete coupon");
        } else {
            toast.success("Coupon deleted");
            fetchCoupons();
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold">🎟️ Manage Coupons</h1>

            {/* Create Coupon Form */}
            <Card>
                <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold">Create New Coupon</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Coupon Code (e.g. WELCOME50)" value={code} onChange={(e) => setCode(e.target.value)} />
                        <Input
                            placeholder="Discount %"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                        <Input
                            placeholder="Course ID (optional)"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                        />
                        <Input
                            placeholder="Max Uses (optional)"
                            type="number"
                            value={maxUses}
                            onChange={(e) => setMaxUses(e.target.value)}
                        />
                        <Input
                            placeholder="Expiry Date (YYYY-MM-DD)"
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </div>

                    <Button onClick={createCoupon} className="w-full md:w-auto">
                        Create Coupon
                    </Button>
                </CardContent>
            </Card>

            {/* Coupons List */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">All Coupons</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : coupons.length === 0 ? (
                        <p className="text-neutral-500">No coupons found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>Expires At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-mono">{c.code}</TableCell>
                                        <TableCell>{c.discount_percent}%</TableCell>
                                        <TableCell>{c.course_id || "Any"}</TableCell>
                                        <TableCell>
                                            {c.used_count} / {c.max_uses || "∞"}
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "No Expiry"}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="destructive" size="sm" onClick={() => deleteCoupon(c.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
