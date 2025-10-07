/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type CoursePurchase = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    created_at: string;
    courses: { name: string; } | null;
    coupons: { code: string; discount_percent: number; } | null;
};

type InternshipPurchase = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    created_at: string;
    internships: { title: string; } | null;
    coupons: { code: string; discount_percent: number; } | null;
};

export default function UserPayments() {
    const supabase = createClient();
    const [coursePayments, setCoursePayments] = useState<CoursePurchase[]>([]);
    const [internshipPayments, setInternshipPayments] = useState<InternshipPurchase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            // --- Fetch course purchases with course name ---
            const { data: courses, error: courseError } = await supabase
                .from("purchases")
                .select(`
                    id, amount, currency, status, razorpay_order_id, razorpay_payment_id, created_at,
                    courses:course_id ( name ),
                    coupons ( code, discount_percent )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (!courseError && courses) {
                const normalizedCourses = courses.map((c: any) => ({
                    ...c,
                    courses: c.courses ?? null,
                    coupons: c.coupons?.[0] ?? null,
                }));
                setCoursePayments(normalizedCourses);
            }

            // --- Fetch internship purchases with internship title ---
            const { data: internships, error: internshipError } = await supabase
                .from("internship_purchases")
                .select(`
                    id, amount, currency, status, razorpay_order_id, razorpay_payment_id, created_at,
                    internships:internship_id ( title ),
                    coupons ( code, discount_percent )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (!internshipError && internships) {
                const normalizedInternships = internships.map((i: any) => ({
                    ...i,
                    internships: i.internships ?? null,
                    coupons: i.coupons?.[0] ?? null,
                }));
                setInternshipPayments(normalizedInternships);
            }

            setLoading(false);
        };

        fetchPayments();
    }, []);

    const renderTable = (
        title: string,
        payments: (CoursePurchase | InternshipPurchase)[],
        isCourse: boolean
    ) => (
        <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            {payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <Table>
                    <TableCaption>History of your {isCourse ? "course" : "internship"} purchases.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{isCourse ? "Course" : "Internship"}</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Coupon</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Payment ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    {isCourse
                                        ? (p as CoursePurchase).courses?.name || "—"
                                        : (p as InternshipPurchase).internships?.title || "—"}
                                </TableCell>
                                <TableCell>
                                    {p.currency} {p.amount}
                                </TableCell>
                                <TableCell>
                                    {p.status === "completed" ? (
                                        <Badge className="bg-green-500 text-white">Completed</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                                            {p.status}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {p.coupons ? (
                                        <Badge variant="outline" className="text-indigo-600 border-indigo-400">
                                            {p.coupons.code} (-{p.coupons.discount_percent}%)
                                        </Badge>
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-xs">{p.razorpay_payment_id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );

    return (
        <div className="p-6">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {renderTable("💳 Your Course Payments", coursePayments, true)}
                    {renderTable("💳 Your Internship Payments", internshipPayments, false)}
                </>
            )}
        </div>
    );
}
