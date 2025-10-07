/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EditProfileForm from "./components/EditProfileForm";
import UpdatePasswordForm from "./components/UpdatePasswordForm";
import UserCourses from "./components/UserCourses";
import UserPayments from "./components/UserPayments";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/auth/login");
    }

    return (
        <div className="flex flex-col max-w-4xl mx-auto gap-6 p-4">
            {/* Tabs List */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {[
                    { value: "profile", label: "Edit Profile", color: "purple" },
                    { value: "password", label: "Update Password", color: "indigo" },
                    { value: "learning", label: "My Learning", color: "pink" },
                    { value: "payments", label: "Payments", color: "purple" },
                    { value: "logout", label: "Logout", color: "red" },
                ].map((tab) => (
                    <Button
                        key={tab.value}
                        variant={activeTab === tab.value ? "default" : "outline"}
                        className={`flex-1 rounded-xl px-4 py-2 text-white font-semibold transition-all duration-300
              ${tab.color === "purple" && (activeTab === tab.value ? "bg-purple-600" : "bg-purple-200 text-purple-700")}
              ${tab.color === "indigo" && (activeTab === tab.value ? "bg-indigo-600" : "bg-indigo-200 text-indigo-700")}
              ${tab.color === "pink" && (activeTab === tab.value ? "bg-pink-600" : "bg-pink-200 text-pink-700")}
              ${tab.color === "red" && (activeTab === tab.value ? "bg-red-600" : "bg-red-200 text-red-700")}
            `}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Tabs Content */}
            <div className="mt-4">
                {activeTab === "profile" && (
                    <Card className="w-full shadow-lg border border-indigo-200/30 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-purple-700 font-bold">Edit Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditProfileForm />
                        </CardContent>
                    </Card>
                )}

                {activeTab === "password" && <UpdatePasswordForm />}

                {activeTab === "learning" && (
                    <div className="flex flex-col gap-8">
                        <UserCourses />
                        {/* Add UserInternships component here if needed */}
                    </div>
                )}

                {activeTab === "payments" && <UserPayments />}

                {activeTab === "logout" && (
                    <Card
                        className="w-full shadow-lg border border-red-200/30 
             bg-gradient-to-br from-red-50 via-white to-pink-50 
             dark:from-gray-900 dark:via-gray-950 dark:to-red-950/40
             rounded-2xl"
                    >
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 font-bold">
                                Logout
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex justify-center">
                            <Button
                                variant="destructive"
                                className="bg-gradient-to-r from-red-500 to-pink-500 
                 text-white hover:from-red-600 hover:to-pink-600 
                 transition-all duration-300 rounded-xl"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>

                )}
            </div>
        </div>
    );
}
