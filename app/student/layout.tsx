import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
        return;
    }

    const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || !data) {
        redirect("/auth/login");
        return;
    }

    if (data.role !== "student") {
        if (data.role === "admin") {
            redirect("/admin/dashboard");
        } else {
            redirect("/auth/login");
        }
        return;
    }

    return <div className="min-h-screen">{children}</div>;
}
