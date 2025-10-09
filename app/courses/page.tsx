import { createClient } from "@/lib/supabase/server";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Award } from "lucide-react";


import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses | VirtiLearn",
    description: "Browse top programming, web development, AI/ML, and data science courses on VirtiLearn. Learn from experts and boost your career.",
    openGraph: {
        title: "VirtiLearn Courses - Learn Programming, AI & More",
        description: "Explore the best online courses in programming, web development, AI/ML, and data science.",
        url: "https://www.virtilearn.in/courses",
        siteName: "VirtiLearn",
        images: [
            {
                url: "/public/images/OG_card.png",
                width: 1200,
                height: 630,
                alt: "VirtiLearn Courses Page",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};


// ==================
// Types
// ==================
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
// Page Component
// ==================
export default async function CoursesPage() {
    const supabase = await createClient();

    const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return (
            <div className="p-8 text-center text-red-500">
                Failed to fetch courses. Please try again later.
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="p-8 text-center text-neutral-500">
                No courses available.
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="text-center mb-12 mt-20">
                <h2
                    className="text-4xl font-extrabold 
               bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 
               bg-clip-text text-transparent drop-shadow-sm"
                >
                    📚 All Courses
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-lg">
                    Explore our complete catalog and find your next learning adventure.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course: Course) => (
                    <CardContainer key={course.id} className="inter-var mx-auto sm:mx-0 max-w-xs sm:max-w-full ">
                        <CardBody
                            className="relative group/card rounded-2xl p-6  sm:p-6
                border border-indigo-200/30 dark:border-indigo-800/30 
                bg-gradient-to-br from-indigo-50 via-purple-50 to-white 
                dark:from-indigo-950 dark:via-purple-950 dark:to-neutral-900
                shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full
                backdrop-blur-xl  "
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
                                    className="h-48 sm:h-52 w-full object-cover rounded-xl 
                      ring-1 ring-indigo-200/40 dark:ring-indigo-700/40 
                      group-hover/card:shadow-xl transition"
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

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.language && (
                                    <Badge
                                        className="flex items-center gap-1 
                      bg-gradient-to-r from-indigo-500 to-purple-500 
                      text-white border-0 shadow-sm"
                                    >
                                        <Globe className="h-3 w-3" />
                                        {course.language}
                                    </Badge>
                                )}
                                {course.certification && (
                                    <Badge
                                        className="flex items-center gap-1 
                      bg-gradient-to-r from-green-500 to-emerald-500 
                      text-white border-0 shadow-sm"
                                    >
                                        <Award className="h-3 w-3" />
                                        Certificate
                                    </Badge>
                                )}
                                {course.categories && (
                                    <Badge
                                        variant="outline"
                                        className="border-indigo-400/40 text-indigo-700 dark:text-indigo-300"
                                    >
                                        {course.categories}
                                    </Badge>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
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

                            {/* Footer pinned to bottom */}
                            <div className="mt-auto flex justify-between items-center gap-3 pt-4 border-t border-indigo-200/30 dark:border-indigo-800/30">
                                <CardItem
                                    translateZ={20}
                                    as="div"
                                    className="text-lg font-semibold text-indigo-700 dark:text-indigo-200"
                                >
                                    {course.estimated_price ? (
                                        <div className="flex flex-col leading-tight">
                                            <span>₹{course.price}</span>
                                            <span className="text-sm line-through text-neutral-400">
                                                ₹{course.estimated_price}
                                            </span>
                                        </div>
                                    ) : (
                                        <span>₹{course.price}</span>
                                    )}
                                </CardItem>

                                <CardItem
                                    translateZ={20}
                                    as={Link}
                                    href={`/courses/${course.id}`}
                                    className="shrink-0"
                                >
                                    <button
                                        className="px-4 py-2 rounded-xl 
                      bg-gradient-to-r from-indigo-600 to-purple-600 
                      text-white font-semibold text-sm 
                      shadow-md hover:shadow-xl hover:scale-105 transition-all"
                                    >
                                        View Course →
                                    </button>
                                </CardItem>
                            </div>
                        </CardBody>
                    </CardContainer>
                ))}
            </div>
        </div>
    );
}
