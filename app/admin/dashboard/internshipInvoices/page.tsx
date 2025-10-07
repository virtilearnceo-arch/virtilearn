/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function InvoiceManagementPage() {
    const supabase = createClient();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("internship_purchases")
            .select(`
                id,
                amount,
                currency,
                razorpay_order_id,
                razorpay_payment_id,
                status,
                created_at,
                users (
                    id,
                    email,
                    first_name,
                    last_name
                ),
                internships (
                    id,
                    title,
                    price
                ),
                coupons (
                    id,
                    code,
                    discount_percent
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to fetch invoices");
        } else {
            setInvoices(data || []);
        }
        setLoading(false);
    };

    // ✅ Apply search + filters in memory
    const filteredInvoices = useMemo(() => {
        return invoices.filter((inv) => {
            const customer = `${inv.users?.first_name || ""} ${inv.users?.last_name || ""}`.toLowerCase();
            const email = inv.users?.email?.toLowerCase() || "";
            const internship = inv.internships?.title?.toLowerCase() || "";
            const coupon = inv.coupons?.code?.toLowerCase() || "";

            const searchMatch =
                customer.includes(search.toLowerCase()) ||
                email.includes(search.toLowerCase()) ||
                internship.includes(search.toLowerCase()) ||
                coupon.includes(search.toLowerCase());

            // Date filter
            let dateMatch = true;
            if (dateFilter !== "all") {
                const created = new Date(inv.created_at).getTime();
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                if (dateFilter === "today") {
                    const start = new Date();
                    start.setHours(0, 0, 0, 0);
                    dateMatch = created >= start.getTime();
                } else if (dateFilter === "7days") {
                    dateMatch = created >= now - 7 * oneDay;
                } else if (dateFilter === "30days") {
                    dateMatch = created >= now - 30 * oneDay;
                }
            }

            // Status filter
            const statusMatch = statusFilter === "all" || inv.status === statusFilter;

            return searchMatch && dateMatch && statusMatch;
        });
    }, [invoices, search, dateFilter, statusFilter]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Internship Invoices</h2>

            {/* 🔍 Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <Input
                    placeholder="Search by name, email, internship, coupon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[280px]"
                />

                <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Date Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={fetchInvoices} variant="outline">
                    Refresh
                </Button>
            </div>

            {/* 🧾 Invoice Table - Horizontal scroll only */}
            <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1150px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Internship</TableHead>
                                <TableHead>Internship Price</TableHead>
                                <TableHead>Coupon</TableHead>
                                <TableHead>Discount %</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Payment ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={11}>Loading...</TableCell>
                                </TableRow>
                            ) : filteredInvoices.length ? (
                                filteredInvoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                                        <TableCell>
                                            {invoice.users?.first_name} {invoice.users?.last_name}
                                        </TableCell>
                                        <TableCell>{invoice.users?.email}</TableCell>
                                        <TableCell>{invoice.internships?.title}</TableCell>
                                        <TableCell>{invoice.internships?.price?.toFixed(2)}</TableCell>
                                        <TableCell>{invoice.coupons?.code || "-"}</TableCell>
                                        <TableCell>{invoice.coupons?.discount_percent || "-"}</TableCell>
                                        <TableCell>{invoice.amount?.toFixed(2)} {invoice.currency}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-sm font-medium ${invoice.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {invoice.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(invoice.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="truncate max-w-[180px]">{invoice.razorpay_payment_id}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11}>No invoices found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
