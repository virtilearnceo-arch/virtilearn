/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Clock, Globe, Award, Users, FileText } from "lucide-react";

// ==================
// Types
// ==================
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
    demo_url: string | null;
    duration: string | null;
    skills: string[] | null;
    certification: boolean | null;
    max_seats: number | null;
    language: string | null;
    subtitles: string[] | null;
    rating: number;
    enrolled_count: number;
    created_at: string;
    updated_at: string;
    average_rating: number;
    total_reviews: number;
};

type Course = {
    id: string;
    name: string;
    description: string | null;
    categories: string | null;
    tags: string[] | null;
    price: number;
    estimated_price: number | null;
    level: string | null;
    demo_url: string | null;
    thumbnail_url: string | null;
    ratings: number;
    purchased: number;
    created_at: string;
    duration: string | null;
    language: string | null;
    certification: boolean | null;
};

// ==================
// Helpers
// ==================
const formatDuration = (duration: string | null) => {
    if (!duration) return null;
    const parts = duration.split(":");
    if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        let result = "";
        if (hours) result += `${hours}h `;
        if (minutes) result += `${minutes}m`;
        return result.trim() || null;
    }
    return duration;
};

// ==================
// Landing Section
// ==================
export default function TopHighlights() {
    const supabase = createClient();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        const { data: internshipsData, error: internshipsError } = await supabase
            .from("internships")
            .select("*")
            .order("enrolled_count", { ascending: false })
            .limit(3);

        const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("*")
            .order("purchased", { ascending: false })
            .limit(3);

        if (internshipsError || coursesError) {
            console.error(internshipsError || coursesError);
            toast.error("Failed to fetch highlights");
        } else {
            setInternships(internshipsData || []);
            setCourses(coursesData || []);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 space-y-20">
            {/* Featured Internships */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                        💼 Featured Internships
                    </h2>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-lg">
                        Hands-on internships to kickstart your career.
                    </p>
                </div>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internships.map((internship) => (
                            <CardContainer key={internship.id} className="inter-var sm:mx-0 max-w-xs sm:max-w-full ">
                                <CardBody
                                    className="rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30 sm:p-6
 
                bg-gradient-to-br from-blue-50 via-cyan-50 to-white 
                dark:from-blue-950 dark:via-cyan-950 dark:to-neutral-900
                shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                                >
                                    {/* Title */}
                                    <CardItem
                                        translateZ="50"
                                        className="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-300 mb-3 line-clamp-2"
                                    >
                                        {internship.title}
                                    </CardItem>

                                    {/* Thumbnail */}
                                    <CardItem translateZ="80" className="w-full mb-3">
                                        <Image
                                            src={
                                                internship.thumbnail_url ||
                                                "https://via.placeholder.com/600x400?text=No+Image"
                                            }
                                            alt={internship.title}
                                            width={600}
                                            height={400}
                                            className="h-48 sm:h-52 w-full object-cover rounded-xl"
                                        />
                                    </CardItem>

                                    {/* Description */}
                                    <CardItem
                                        as="p"
                                        translateZ="60"
                                        className="text-neutral-700 dark:text-neutral-300 text-sm mb-4 line-clamp-2 sm:line-clamp-3"
                                    >
                                        {internship.description || "No description available"}
                                    </CardItem>

                                    {/* Stats */}
                                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                                        <span>⭐ {internship.average_rating?.toFixed(1) || 0}</span>
                                        <span>👨‍🎓 {internship.enrolled_count || 0} enrolled</span>
                                        <span>🎯 {internship.level || "All levels"}</span>
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-auto pt-4 border-t border-blue-200/30 dark:border-blue-800/30">
                                        <CardItem
                                            translateZ={20}
                                            as={Link}
                                            href={`/internships/${internship.id}`}
                                            className="shrink-0"
                                        >
                                            <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all">
                                                View Internship →
                                            </button>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/internships"
                        className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-2xl transition"
                    >
                        Explore All Internships →
                    </Link>
                </div>
            </section>

            {/* Featured Courses */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                        📚 Featured Courses
                    </h2>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-lg">
                        Our most popular courses, loved by learners.
                    </p>
                </div>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <CardContainer key={course.id} className="inter-var sm:mx-0 max-w-xs sm:max-w-full ">
                                <CardBody
                                    className="rounded-2xl p-6 border border-indigo-200/30 dark:border-indigo-800/30  sm:p-6

                bg-gradient-to-br from-indigo-50 via-purple-50 to-white 
                dark:from-indigo-950 dark:via-purple-950 dark:to-neutral-900
                shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                                >
                                    {/* Title */}
                                    <CardItem
                                        translateZ="50"
                                        className="text-lg md:text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-3 line-clamp-2"
                                    >
                                        {course.name}
                                    </CardItem>

                                    {/* Thumbnail */}
                                    <CardItem translateZ="80" className="w-full mb-3">
                                        <Image
                                            src={
                                                course.thumbnail_url ||
                                                "https://via.placeholder.com/600x400?text=No+Image"
                                            }
                                            alt={course.name}
                                            width={600}
                                            height={400}
                                            className="h-48 sm:h-52 w-full object-cover rounded-xl"
                                        />
                                    </CardItem>

                                    {/* Description */}
                                    <CardItem
                                        as="p"
                                        translateZ="60"
                                        className="text-neutral-700 dark:text-neutral-300 text-sm mb-4 line-clamp-2 sm:line-clamp-3"
                                    >
                                        {course.description || "No description available"}
                                    </CardItem>

                                    {/* Stats */}
                                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                                        <span>⭐ {course.ratings?.toFixed(1) || 0}</span>
                                        <span>👨‍🎓 {course.purchased || 0} enrolled</span>
                                        <span>🎯 {course.level || "All levels"}</span>
                                        {course.duration && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-indigo-500" />
                                                {formatDuration(course.duration)}
                                            </span>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-auto pt-4 border-t border-indigo-200/30 dark:border-indigo-800/30">
                                        <CardItem
                                            translateZ={20}
                                            as={Link}
                                            href={`/courses/${course.id}`}
                                            className="shrink-0"
                                        >
                                            <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all">
                                                View Course →
                                            </button>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/courses"
                        className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-2xl transition"
                    >
                        Explore All Courses →
                    </Link>
                </div>
            </section>
        </div>
    );
}
