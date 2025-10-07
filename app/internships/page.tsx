"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Award, Users, FileText } from "lucide-react";



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
    duration: string | null; // e.g. "3 mons"
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

export default function InternshipsPage() {
    const supabase = createClient();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("internships").select("*");

        if (error) {
            console.error(error);
            toast.error("Failed to fetch internships");
        } else {
            setInternships(data || []);
        }
        setLoading(false);
    };

    // format Postgres interval like "3 mons" → "3 months"
    const formatDuration = (duration: string | null) => {
        if (!duration) return null;

        const match = duration.match(/(\d+)\s+mon/); // handle "3 mons"
        if (match) {
            const months = parseInt(match[1], 10);
            return `${months} month${months > 1 ? "s" : ""}`;
        }

        return duration;
    };

    return (
        <div className="p-8 space-y-6">
            <div className="text-center mb-12">
                <h2
                    className="text-4xl font-extrabold 
            bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 
            bg-clip-text text-transparent drop-shadow-sm"
                >
                    💼 Internships
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-lg">
                    Explore hands-on internships and start building real skills.
                </p>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : internships.length === 0 ? (
                <p>No internships available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internships.map((internship) => (
                        <CardContainer key={internship.id} className="inter-var sm:mx-0 max-w-xs sm:max-w-full">
                            <CardBody
                                className="relative group/card rounded-2xl p-6 sm:p-6
                  border border-blue-200/30 dark:border-blue-800/30 
                  bg-gradient-to-br from-blue-50 via-cyan-50 to-white 
                  dark:from-blue-950 dark:via-cyan-950 dark:to-neutral-900
                  shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full
                  backdrop-blur-xl"
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
                                        className="h-48 sm:h-52 w-full object-cover rounded-xl 
                      ring-1 ring-blue-200/40 dark:ring-blue-700/40 
                      group-hover/card:shadow-xl transition"
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

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {internship.language && (
                                        <Badge
                                            className="flex items-center gap-1 
                      bg-gradient-to-r from-blue-500 to-cyan-500 
                      text-white border-0 shadow-sm"
                                        >
                                            <Globe className="h-3 w-3" />
                                            {internship.language}
                                        </Badge>
                                    )}
                                    {internship.certification && (
                                        <Badge
                                            className="flex items-center gap-1 
                      bg-gradient-to-r from-green-500 to-emerald-500 
                      text-white border-0 shadow-sm"
                                        >
                                            <Award className="h-3 w-3" />
                                            Certificate
                                        </Badge>
                                    )}
                                    {/* Letter of Recommendation */}
                                    <Badge
                                        className="flex items-center gap-1 
                    bg-gradient-to-r from-purple-500 to-pink-500 
                    text-white border-0 shadow-sm"
                                    >
                                        <FileText className="h-3 w-3" />
                                        LOR
                                    </Badge>
                                    {internship.categories?.map((cat) => (
                                        <Badge
                                            key={cat}
                                            variant="outline"
                                            className="border-blue-400/40 text-blue-700 dark:text-blue-300"
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                                    <span>⭐ {internship.average_rating?.toFixed(1) || 0}</span>
                                    <span>👨‍🎓 {internship.enrolled_count || 0} enrolled</span>
                                    <span>🎯 {internship.level || "All levels"}</span>
                                    {internship.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-blue-500" />
                                            {formatDuration(internship.duration)}
                                        </span>
                                    )}
                                    {internship.max_seats && (
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3 text-cyan-500" />
                                            {internship.max_seats} seats
                                        </span>
                                    )}
                                </div>

                                {/* Footer pinned to bottom */}
                                <div className="mt-auto flex justify-between items-center gap-3 pt-4 border-t border-blue-200/30 dark:border-blue-800/30">
                                    <CardItem
                                        translateZ={20}
                                        as="div"
                                        className="text-lg font-semibold text-indigo-600 dark:text-indigo-300"
                                    >
                                        {internship.estimated_price ? (
                                            <div className="flex flex-col leading-tight">
                                                <span>₹{internship.price}</span>
                                                <span className="text-sm line-through text-neutral-400">
                                                    ₹{internship.estimated_price}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>₹{internship.price}</span>
                                        )}
                                    </CardItem>

                                    <CardItem
                                        translateZ={20}
                                        as={Link}
                                        href={`/internships/${internship.id}`}
                                        className="shrink-0"
                                    >
                                        <button
                                            className="px-4 py-2 rounded-xl 
                        bg-gradient-to-r from-blue-600 to-cyan-600 
                        text-white font-semibold text-sm 
                        shadow-md hover:shadow-xl hover:scale-105 transition-all"
                                        >
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
    );
}
