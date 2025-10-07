// app/admin/dashboard/page.tsx
"use client";

import UsersManagementPage from "../../admin/dashboard/users/page";
import CourseLineAnalyticsChart from "../../admin/dashboard/courses/page";
import UserRadarChart from "../../admin/dashboard/analytics/user-analytics/page";
import CoursesPage from "../../admin/dashboard/analytics/course-analytics/page";
import OrderAnalyticsChart from "./analytics/orders-analytics/page";
import InvoiceManagementPage from "./invoices/page";

export default function AdminDashboardHome() {
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
            {/* Row 2 - Management Tables */}
            <div className="grid gap-6 md:grid-cols-2">
                <OrderAnalyticsChart />
                <InvoiceManagementPage />
            </div>
        </div>
    );
}
