// /app/dashboard/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard Redirect",
    description: "Routing based on role",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
            {children}
        </div>
    );
}
