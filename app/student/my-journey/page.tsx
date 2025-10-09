/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Award, Users, FileText } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Highlighter } from "@/components/magicui/highlighter";

type Course = {
    id: string;
    name: string;
    description: string | null;
    categories: string[] | null;
    tags: string[] | null;
    price: number;
    estimated_price: number | null;
    level: string | null;
    thumbnail_url: string | null;
    duration: string | null; // HH:MM
    language: string | null;
    certification: boolean | null;
    ratings: number;
    purchased: number;
};

type Internship = {
    id: string;
    title: string;
    description: string | null;
    categories: string[] | null;
    tags: string[] | null;
    price: number;
    estimated_price: number | null;
    level: string | null;
    thumbnail_url: string | null;
    duration: string | null; // e.g., "3 mons"
    language: string | null;
    certification: boolean | null;
    enrolled_count: number;
    average_rating: number;
    max_seats: number | null;
};

export default function MyLearningPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<Course[]>([]);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyLearning();
    }, []);

    const fetchMyLearning = async () => {
        setLoading(true);

        // 1️⃣ Get logged-in user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            toast.error("Not logged in");
            setLoading(false);
            return;
        }

        // 2️⃣ Fetch enrolled courses
        const { data: userRow } = await supabase
            .from("users")
            .select("enrolled_courses")
            .eq("id", user.id)
            .single();

        const enrolledCourseIds: string[] = userRow?.enrolled_courses || [];

        const coursesData = enrolledCourseIds.length
            ? (await supabase.from("courses").select("*").in("id", enrolledCourseIds)).data || []
            : [];

        setCourses(coursesData);

        // 3️⃣ Fetch enrolled internships
        const { data: userInternships } = await supabase
            .from("user_internships")
            .select(`internship:internship_id (*)`)
            .eq("user_id", user.id);

        setInternships(userInternships?.map((ui: any) => ui.internship) || []);

        setLoading(false);
    };

    const formatDuration = (duration: string | null) => {
        if (!duration) return null;
        // For courses HH:MM
        if (duration.includes(":")) {
            const [h, m] = duration.split(":").map(Number);
            return `${h ? h + "h " : ""}${m ? m + "m" : ""}`.trim();
        }
        // For internships interval like "3 mons"
        const match = duration.match(/(\d+)\s+mon/);
        if (match) return `${match[1]} mo${parseInt(match[1]) > 1 ? "s" : ""}`;
        return duration;
    };

    return (
        <div className="p-8 space-y-12 mt-16">
            {/* =================== Courses Section =================== */}
            <div>
                <h2 className="text-3xl font-bold text-center mb-6">🎓 My Courses</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : courses.length === 0 ? (
                    <p className="text-center text-purple-600 font-bold"> <Highlighter action="highlight" color="#FFA500" >Go start learning</Highlighter> </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <CardContainer key={course.id} className="inter-var">
                                <CardBody className="relative group/card rounded-2xl p-6 
                                    border border-indigo-200/30 dark:border-indigo-800/30 
                                    bg-gradient-to-br from-indigo-50 via-purple-50 to-white 
                                    dark:from-indigo-950 dark:via-purple-950 dark:to-neutral-900
                                    shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full
                                    backdrop-blur-xl">
                                    <CardItem translateZ="50" className="text-lg md:text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-3 line-clamp-2">
                                        {course.name}
                                    </CardItem>
                                    <CardItem translateZ="80" className="w-full mb-3">
                                        <Image src={course.thumbnail_url || "https://via.placeholder.com/600x400?text=No+Image"} alt={course.name} width={600} height={400} className="h-48 sm:h-52 w-full object-cover rounded-xl ring-1 ring-indigo-200/40 dark:ring-indigo-700/40 group-hover/card:shadow-xl transition" />
                                    </CardItem>
                                    <CardItem as="p" translateZ="60" className="text-neutral-700 dark:text-neutral-300 text-sm mb-4 line-clamp-3">
                                        {course.description || "No description available"}
                                    </CardItem>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {course.language && (
                                            <Badge className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-sm">
                                                <Globe className="h-3 w-3" /> {course.language}
                                            </Badge>
                                        )}
                                        {course.certification && (
                                            <Badge className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                                                <Award className="h-3 w-3" /> Certificate
                                            </Badge>
                                        )}
                                        {/* Categories */}
                                        {Array.isArray(course.categories)
                                            ? course.categories.map((cat) => (
                                                <Badge
                                                    key={cat}
                                                    variant="outline"
                                                    className="border-indigo-400/40 text-indigo-700 dark:text-indigo-300"
                                                >
                                                    {cat}
                                                </Badge>
                                            ))
                                            : course.categories && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-indigo-400/40 text-indigo-700 dark:text-indigo-300"
                                                >
                                                    {course.categories}
                                                </Badge>
                                            )}

                                    </div>
                                    <div className="flex flex-wrap justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                                        <span>⭐ {course.ratings?.toFixed(1) || 0}</span>
                                        <span>👨‍🎓 {course.purchased || 0} enrolled</span>
                                        <span>🎯 {course.level || "All levels"}</span>
                                        {course.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-indigo-500" /> {formatDuration(course.duration)}</span>}
                                    </div>
                                    <div className="mt-auto flex justify-between items-center gap-3 pt-4 border-t border-indigo-200/30 dark:border-indigo-800/30">
                                        <CardItem translateZ={20} as="div" className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">
                                            {course.estimated_price ? (
                                                <div className="flex flex-col leading-tight"><span>₹{course.price}</span><span className="text-sm line-through text-neutral-400">₹{course.estimated_price}</span></div>
                                            ) : (<span>₹{course.price}</span>)}
                                        </CardItem>
                                        <CardItem translateZ={20} as={Link} href={`/courses/${course.id}`} className="shrink-0">
                                            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all">
                                                View Course →
                                            </button>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        ))}
                    </div>
                )}
            </div>

            {/* =================== Internships Section =================== */}
            <div>
                <h2 className="text-3xl font-bold text-center mb-6">💼 My Internships</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : internships.length === 0 ? (
                    <p className="text-center text-cyan-600 font-bold"> <Highlighter action="underline" color="#FFA500" >No internships yet. Go build real skills</Highlighter> </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internships.map((internship) => (
                            <CardContainer key={internship.id} className="inter-var">
                                <CardBody className="relative group/card rounded-2xl p-6 
                                    border border-cyan-200/30 dark:border-cyan-800/30 
                                    bg-gradient-to-br from-cyan-50 via-blue-50 to-white 
                                    dark:from-cyan-950 dark:via-blue-950 dark:to-neutral-900
                                    shadow-md hover:shadow-xl transition-all duration-500 flex flex-col h-full
                                    backdrop-blur-xl">
                                    <CardItem translateZ="50" className="text-lg md:text-xl font-bold text-cyan-700 dark:text-cyan-300 mb-3 line-clamp-2">
                                        {internship.title}
                                    </CardItem>
                                    <CardItem translateZ="80" className="w-full mb-3">
                                        <Image src={internship.thumbnail_url || "https://via.placeholder.com/600x400?text=No+Image"} alt={internship.title} width={600} height={400} className="h-48 sm:h-52 w-full object-cover rounded-xl ring-1 ring-cyan-200/40 dark:ring-cyan-700/40 group-hover/card:shadow-lg transition" />
                                    </CardItem>
                                    <CardItem as="p" translateZ="60" className="text-neutral-700 dark:text-neutral-300 text-sm mb-4 line-clamp-3">
                                        {internship.description || "No description available"}
                                    </CardItem>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {internship.language && (
                                            <Badge className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm">
                                                <Globe className="h-3 w-3" /> {internship.language}
                                            </Badge>
                                        )}
                                        {internship.certification && (
                                            <Badge className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                                                <Award className="h-3 w-3" /> Certificate
                                            </Badge>
                                        )}
                                        <Badge className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm">
                                            <FileText className="h-3 w-3" /> LOR
                                        </Badge>
                                        {internship.categories?.map((cat) => (
                                            <Badge key={cat} variant="outline" className="border-cyan-400/40 text-cyan-700 dark:text-cyan-300">{cat}</Badge>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                                        <span>⭐ {internship.average_rating?.toFixed(1) || 0}</span>
                                        <span>👨‍🎓 {internship.enrolled_count || 0} enrolled</span>
                                        <span>🎯 {internship.level || "All levels"}</span>
                                        {internship.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-cyan-500" /> {formatDuration(internship.duration)}</span>}
                                        {internship.max_seats && <span className="flex items-center gap-1"><Users className="h-3 w-3 text-blue-500" /> {internship.max_seats} seats</span>}
                                    </div>
                                    <div className="mt-auto flex justify-between items-center gap-3 pt-4 border-t border-cyan-200/30 dark:border-cyan-800/30">
                                        <CardItem translateZ={20} as="div" className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                                            {internship.estimated_price ? (
                                                <div className="flex flex-col leading-tight"><span>₹{internship.price}</span><span className="text-sm line-through text-neutral-400">₹{internship.estimated_price}</span></div>
                                            ) : (<span>₹{internship.price}</span>)}
                                        </CardItem>
                                        <CardItem translateZ={20} as={Link} href={`/internships/${internship.id}`} className="shrink-0">
                                            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all">
                                                View Internship →
                                            </button>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
