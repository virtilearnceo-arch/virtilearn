/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";

export default function EditProfileForm() {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilePicPath, setProfilePicPath] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // ✅ Fetch user profile info
    useEffect(() => {
        const fetchUserProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("users")
                .select("first_name, last_name, profile_picture")
                .eq("id", user.id)
                .single();

            if (error) {
                toast.error("Error fetching user profile");
                return;
            }

            if (data) {
                setFirstName(data.first_name || "");
                setLastName(data.last_name || "");
                setProfilePicPath(data.profile_picture || "");

                if (data.profile_picture) {
                    const { data: signedData } = await supabase.storage
                        .from("avatars")
                        .createSignedUrl(data.profile_picture, 60 * 60);
                    if (signedData?.signedUrl) {
                        setProfileUrl(signedData.signedUrl);
                    }
                }
            }
        };

        fetchUserProfile();
    }, []);

    // ✅ Handle update
    const handleUpdate = async () => {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            toast.error("User not found");
            setLoading(false);
            return;
        }

        let filePath = profilePicPath;

        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Only PNG, JPG, or WEBP images allowed");
                setLoading(false);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Max file size is 2MB");
                setLoading(false);
                return;
            }

            const ext = file.name.split(".").pop();
            filePath = `${user.id}/${uuidv4()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                console.error(uploadError);
                toast.error("Image upload failed.");
                setLoading(false);
                return;
            }

            const { data: signedData } = await supabase.storage
                .from("avatars")
                .createSignedUrl(filePath, 60 * 60);
            if (signedData?.signedUrl) {
                setProfileUrl(signedData.signedUrl);
            }
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({
                first_name: firstName,
                last_name: lastName,
                profile_picture: filePath,
            })
            .eq("id", user.id);

        if (updateError) {
            toast.error("Failed to update profile");
        } else {
            toast.success("Profile updated!");
            setProfilePicPath(filePath);
            setFile(null);
        }

        setLoading(false);
    };

    return (

        <Card
            className="w-full border border-indigo-200/20 
             bg-gradient-to-br from-indigo-50 via-white to-pink-50 
             dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950/40
             shadow-sm rounded-2xl"
        >
            <CardHeader>
                <CardTitle
                    className="text-lg font-semibold 
                 bg-gradient-to-r from-purple-600 to-pink-600 
                 bg-clip-text text-transparent"
                >
                    Edit Profile
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">First Name</Label>
                    <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="mt-1 border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   focus:border-indigo-400 focus:ring focus:ring-indigo-200/50"
                    />
                </div>

                <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Last Name</Label>
                    <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="mt-1 border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   focus:border-indigo-400 focus:ring focus:ring-indigo-200/50"
                    />
                </div>

                <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Profile Picture</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="mt-1 border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   focus:border-indigo-400 focus:ring focus:ring-indigo-200/50"
                    />
                    {(file || profileUrl) && (
                        <img
                            src={file ? URL.createObjectURL(file) : profileUrl}
                            alt="Profile"
                            className="w-20 h-20 rounded-full mt-2 object-cover 
                     border border-indigo-100 dark:border-indigo-800"
                        />
                    )}
                </div>

                <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full rounded-xl 
                 bg-gradient-to-r from-purple-600 to-pink-600 
                 text-white shadow 
                 hover:from-purple-700 hover:to-pink-700 
                 transition-colors"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </Button>
            </CardContent>
        </Card>


    );
}
