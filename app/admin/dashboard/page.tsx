"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import UsersManagementPage from "../../admin/dashboard/users/page";
import CourseLineAnalyticsChart from "../../admin/dashboard/courses/page";
import UserRadarChart from "../../admin/dashboard/analytics/user-analytics/page";
import CoursesPage from "../../admin/dashboard/analytics/course-analytics/page";
import OrderAnalyticsChart from "./analytics/orders-analytics/page";
import InvoiceManagementPage from "./invoices/page";

export default function AdminDashboardHome() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                router.replace("/"); // redirect if not logged in
                return;
            }

            // Fetch user role
            const { data: userData, error } = await supabase
                .from("users")
                .select("role")
                .eq("id", session.user.id)
                .single();

            if (error || userData?.role !== "admin") {
                router.replace("/"); // redirect if not admin
                return;
            }

            setIsLoading(false); // user is admin, show dashboard
        };

        checkAdmin();
    }, [router]);

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Row 1 - Analytics */}
            <div className="grid gap-6 md:grid-cols-2">
                <CourseLineAnalyticsChart />
                <UserRadarChart />
            </div>

            {/* Row 2 - Management Tables */}
            <div className="grid gap-6 md:grid-cols-2">
                <UsersManagementPage />
                <CoursesPage />
            </div>

            {/* Row 3 - Orders & Invoices */}
            <div className="grid gap-6 md:grid-cols-2">
                <OrderAnalyticsChart />
                <InvoiceManagementPage />
            </div>
        </div>
    );
}
