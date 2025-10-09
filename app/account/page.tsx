/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import EditProfileForm from "./components/EditProfileForm";
import UpdatePasswordForm from "./components/UpdatePasswordForm";
import UserCourses from "./components/UserCourses";
import UserPayments from "./components/UserPayments";

export default function Page() {
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/auth/login");
    }

    return (
        <div className="flex flex-col max-w-4xl mx-auto gap-6 p-4 mt-48 mb-10 sm:mt-6">
            <Tabs defaultValue="profile" className="w-full">
                {/* Tabs Header */}
                <TabsList className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-transparent">
                    <TabsTrigger
                        value="profile"
                        className="flex-1 rounded-xl px-4 py-2 text-white font-semibold bg-purple-600 data-[state=inactive]:bg-purple-200 data-[state=inactive]:text-purple-700"
                    >
                        Edit Profile
                    </TabsTrigger>

                    <TabsTrigger
                        value="password"
                        className="flex-1 rounded-xl px-4 py-2 text-white font-semibold bg-indigo-600 data-[state=inactive]:bg-indigo-200 data-[state=inactive]:text-indigo-700"
                    >
                        Update Password
                    </TabsTrigger>

                    <TabsTrigger
                        value="learning"
                        className="flex-1 rounded-xl px-4 py-2 text-white font-semibold bg-pink-600 data-[state=inactive]:bg-pink-200 data-[state=inactive]:text-pink-700"
                    >
                        My Learning
                    </TabsTrigger>

                    <TabsTrigger
                        value="payments"
                        className="flex-1 rounded-xl px-4 py-2 text-white font-semibold bg-purple-600 data-[state=inactive]:bg-purple-200 data-[state=inactive]:text-purple-700"
                    >
                        Payments
                    </TabsTrigger>

                    <TabsTrigger
                        value="logout"
                        className="flex-1 rounded-xl px-4 py-2 text-white font-semibold bg-red-600 data-[state=inactive]:bg-red-200 data-[state=inactive]:text-red-700"
                    >
                        Logout
                    </TabsTrigger>
                </TabsList>

                {/* Tabs Content */}
                <TabsContent value="profile" className="mt-24">
                    <Card className="w-full shadow-lg border border-indigo-200/30 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-purple-700 font-bold">
                                Edit Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditProfileForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password" className="mt-2">
                    <UpdatePasswordForm />
                </TabsContent>

                <TabsContent value="learning" className="mt-24">
                    <div className="flex flex-col gap-8">
                        <UserCourses />
                        {/* Add UserInternships if needed */}
                    </div>
                </TabsContent>

                <TabsContent value="payments" className="mt-24">
                    <UserPayments />
                </TabsContent>

                <TabsContent value="logout" className="mt-24">
                    <Card className="w-full shadow-lg border border-red-200/30 bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-red-950/40 rounded-2xl">
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
                </TabsContent>

            </Tabs>
        </div>
    );
}
