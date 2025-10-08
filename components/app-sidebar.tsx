"use client";

import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { navMain } from ".././app/data/nav";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* Optional: add team switcher or logo here */}
                <h1 className="text-xl font-bold px-3">Admin</h1>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        name: "Admin",
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Admin`,
                    }}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
