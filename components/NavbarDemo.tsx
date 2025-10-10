/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Bell, LogOut, Moon, Sun, User, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


export function NavbarDemo() {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<"admin" | "student" | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    const router = useRouter();
    const { setTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);

        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            setUser(session.user);

            const { data: userData, error } = await supabase
                .from("users")
                .select("first_name, last_name, profile_picture, role")
                .eq("id", session.user.id)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error.message);
                return;
            }

            if (userData) {
                setUserData(userData); // ✅ use userData here

                setRole(userData.role);
                if (userData.profile_picture) {
                    const { data: publicUrlData } = supabase.storage
                        .from("avatars")
                        .getPublicUrl(userData.profile_picture);
                    if (publicUrlData?.publicUrl) setProfileUrl(publicUrlData.publicUrl);
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const fullName =
        user?.user_metadata?.first_name && user?.user_metadata?.last_name
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
            : user?.email;

    // Navigation items
    const loggedInNavItems =
        role === "admin"
            ? [{ name: "Home", link: "/" },
            { name: "Dashboard", link: "/admin/dashboard" }]
            : [
                { name: "Home", link: "/" },
                { name: "Explore Courses", link: "/courses" },
                { name: "Explore Internships", link: "/internships" },
                { name: "My Journey", link: "/student/my-journey" },
                { name: "Certificates", link: "/student/certificates" },
            ];

    const nonLoggedInNavItems = [
        { name: "Home", link: "/" },
        { name: "Explore Courses", link: "/courses" },
        { name: "Explore Internships", link: "/internships" },
        { name: "Contact", link: "/contact" },
    ];

    // After fetching userData and setting role/profileUrl

    const avatarUrl = (() => {
        // 1. Supabase uploaded avatar
        if (profileUrl && !profileUrl.includes("https://lh3.googleusercontent.com")) return profileUrl;

        // 2. Google avatar (anywhere in the string)
        if (userData?.profile_picture?.includes("https://lh3.googleusercontent.com")) {
            return "https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/avatars/avatar-fallback.png";
        }

        // 3. Fallback
        return "https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/avatars/avatar-fallback.png";
    })();



    return (
        <div
            className="top-0 z-50 w-full transition-colors duration-500
  md:sticky md:backdrop-blur-xl md:border-b md:border-white/20 md:dark:border-white/10
  bg-gradient-to-r from-[#fff8f0]/100 via-[#fff0f8]/100 to-[#f0f4ff]/100
  dark:from-[#0f0a1a]/100 dark:via-[#1a1025]/100 dark:to-[#0f0a1a]/100
  fixed md:relative"
        >


            <Navbar className="h-16 px-4 md:px-6 lg:px-8">
                {/* Desktop Navbar */}
                <NavBody className="hidden md:flex h-full items-center relative">
                    <NavbarLogo />

                    {/* Nav Items */}
                    {isMounted && (
                        <NavItems
                            items={user ? loggedInNavItems : nonLoggedInNavItems}
                            className="flex-1"
                        />
                    )}

                    <div className="flex items-center gap-3 h-full z-10">
                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground transition-all duration-300">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Auth Buttons */}
                        {user ? (
                            <Avatar
                                className="cursor-pointer w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                onClick={() => router.push("/account")}
                            >
                                <AvatarImage src={avatarUrl} alt={fullName ?? "User"} />
                            </Avatar>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push("/auth/login")}
                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff9a4a] to-[#ff6f61] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                                >
                                    Login
                                </button>
                                <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#ff6f61]/60 to-transparent" />
                                <button
                                    onClick={() => router.push("/auth/sign-up")}
                                    className="px-3 py-1.5 rounded-lg border border-[#ff9a4a]/80 text-[#ff6f61] bg-white/70 dark:bg-[#1a1025]/40 font-semibold text-sm hover:bg-[#fff3ec] dark:hover:bg-[#2a1a35]/70 transition-all shadow-sm hover:shadow-md"
                                >
                                    Sign up for free
                                </button>
                            </div>
                        )}
                    </div>
                </NavBody>

                {/* Mobile Navbar */}
                <MobileNav className="md:hidden">
                    <MobileNavHeader className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#fff8f0]/80 via-[#fff0f8]/70 to-[#f0f4ff]/80 dark:from-[#0f0a1a]/80 dark:via-[#1a1025]/80 dark:to-[#0f0a1a]/80 rounded-b-xl">
                        <NavbarLogo />

                        <div className="flex items-center gap-3">
                            {user && (
                                <Avatar
                                    className="cursor-pointer w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                    onClick={() => router.push("/account")}
                                >
                                    <AvatarImage src={avatarUrl} alt={fullName ?? "User"} />
                                </Avatar>
                            )}

                            {/* Theme Toggle */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f8]/70 dark:bg-[#1a1025]/80 text-[#1a1025] dark:text-[#f0f4ff] shadow-sm hover:bg-[#f0e0f0]/80 dark:hover:bg-[#2a1a35]/80 transition-all duration-300">
                                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="bg-[#fff8f0]/90 dark:bg-[#0f0a1a]/90 rounded-md shadow-lg border border-[#e8dce8]/50 dark:border-[#2a1a35]/50"
                                >
                                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Hamburger */}
                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </div>
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                        className="bg-gradient-to-b from-[#fff8f0]/98 via-[#fff0f8]/98 to-[#f0f4ff]/98 dark:from-[#0f0a1a]/98 dark:via-[#1a1025]/98 dark:to-[#0f0a1a]/98 p-4 rounded-b-xl shadow-lg space-y-3"
                    >
                        {/* Navigation Links */}
                        {isMounted &&
                            (user ? loggedInNavItems : nonLoggedInNavItems).map((item, idx) => (
                                <div key={`mobile-link-${idx}`} className="w-full">
                                    <a
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center px-4 py-2 rounded-md text-[#1a1025] dark:text-[#f0f4ff] hover:bg-[#fff0f8]/60 dark:hover:bg-[#2a1a35]/70 transition font-semibold text-base"
                                    >
                                        {item.name}
                                    </a>
                                    {idx < (user ? loggedInNavItems.length : nonLoggedInNavItems.length) - 1 && (
                                        <div className="mx-auto my-1 h-px w-3/4 bg-gradient-to-r from-transparent via-[#999]/80 to-transparent dark:via-[#555]/80" />
                                    )}
                                </div>
                            ))}

                        {/* Auth Buttons */}
                        {!user && (
                            <div className="flex flex-col items-center justify-center gap-3 mt-6 w-full text-center">
                                <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-[#ffb67f]/70 to-transparent dark:via-[#ff8c42]/40 mb-2" />

                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push("/auth/login");
                                    }}
                                    className="w-[80%] max-w-xs mx-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#ff9a4a] to-[#ff6f61] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push("/auth/signup");
                                    }}
                                    className="w-[80%] max-w-xs mx-auto px-4 py-2.5 rounded-lg border border-[#ff9a4a]/80 text-[#ff6f61] bg-white/70 dark:bg-[#1a1025]/40 font-semibold hover:bg-[#fff3ec] dark:hover:bg-[#2a1a35]/70 transition-all shadow-sm hover:shadow-md text-center"
                                >
                                    Sign up for free
                                </button>

                                <div className="w-2/3 h-px mt-4 bg-gradient-to-r from-transparent via-[#ccc]/50 to-transparent dark:via-[#444]/50" />
                            </div>
                        )}
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>

        </div>
    );
}
