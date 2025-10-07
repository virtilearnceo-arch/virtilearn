/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
    Clock,
    Globe,
    Award,
    Star,
    Users,
    Layers,
    CheckCircle,
    Target,
    BookOpen,
    Sparkles,
    Lightbulb,
    GraduationCap,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import CourseCTA from "@/components/courses/CourseCTA";
import CertificatePreview from "@/components/CertificatePreview";


const avatars = [
    {
        imageUrl: "https://avatars.githubusercontent.com/u/16860528",
        profileUrl: "https://github.com/dillionverma",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/20110627",
        profileUrl: "https://github.com/tomonarifeehan",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/106103625",
        profileUrl: "https://github.com/BankkRoll",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/59228569",
        profileUrl: "https://github.com/safethecode",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/59442788",
        profileUrl: "https://github.com/sanjay-mali",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/89768406",
        profileUrl: "https://github.com/itsarghyadas",
    },
];

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

type Instructor = {
    id: string;
    name: string;
    bio: string | null;
    avatar_url: string | null;
};

type CourseBenefit = { id: string; title: string; };
type CourseFeature = { id: string; title: string; };
type CoursePrerequisite = { id: string; title: string; };
type CourseData = {
    order: number;
    section_order: number;
    id: string;
    title: string;
    section: string | null;
    is_preview: boolean;
};

export default function CourseDetailsPage() {
    const { id } = useParams();
    const supabase = createClient();

    const [course, setCourse] = useState<Course | null>(null);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [benefits, setBenefits] = useState<CourseBenefit[]>([]);
    const [features, setFeatures] = useState<CourseFeature[]>([]);
    const [prerequisites, setPrerequisites] = useState<CoursePrerequisite[]>([]);
    const [courseData, setCourseData] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponId, setCouponId] = useState<string | null>(null);

    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);





    useEffect(() => {
        if (id) {
            fetchCourse(id as string);
        }
    }, [id]);

    // // ✅ Hooks must be declared at the top level (no conditionals)
    // useEffect(() => {
    //     if (id) {
    //         fetchCourse(id as string);
    //     }
    // }, [id]);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user ?? null);
            setLoadingUser(false);
        };
        getUser();
    }, [supabase]);


    const fetchCourse = async (courseId: string) => {
        setLoading(true);

        try {
            const { data: course, error: courseErr } = await supabase
                .from("courses")
                .select("*")
                .eq("id", courseId)
                .single();

            if (courseErr) throw courseErr;
            setCourse(course);

            const { data: instructorRows } = await supabase
                .from("course_instructors")
                .select("instructors(*)")
                .eq("course_id", courseId);

            setInstructors(
                (instructorRows ?? [])
                    .map((row) => row.instructors as unknown as Instructor) // 👈 cast safely
                    .filter((inst): inst is Instructor => inst != null)
            );



            const { data: benefits } = await supabase
                .from("course_benefits")
                .select("*")
                .eq("course_id", courseId)
                .order("order", { ascending: true });
            setBenefits(benefits || []);

            const { data: features } = await supabase
                .from("course_features")
                .select("*")
                .eq("course_id", courseId);
            setFeatures(features || []);

            const { data: prereqs } = await supabase
                .from("course_prerequisites")
                .select("*")
                .eq("course_id", courseId);
            setPrerequisites(prereqs || []);

            const { data: courseData } = await supabase
                .from("course_data")
                .select("*")
                .eq("course_id", courseId)
                .order("section_order", { ascending: true }) // sections first
                .order("order", { ascending: true });        // lessons inside sections
            setCourseData(courseData || []);

        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch course details");
        }

        setLoading(false);
    };



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

    if (loading) return <div className="p-8">⏳ Loading course details...</div>;
    if (!course) return <div className="p-8">❌ Course not found.</div>;

    // Group content by section
    const groupedContent = courseData.reduce((acc, item) => {
        const section = item.section || "General";
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {} as Record<string, CourseData[]>);

    // Sort lessons within each section by "order"
    Object.keys(groupedContent).forEach((section) => {
        groupedContent[section].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    // Optional: sort sections by section_order
    const sortedSections = Object.entries(groupedContent).sort(
        ([aSection, aLessons], [bSection, bLessons]) => {
            const aOrder = aLessons[0]?.section_order ?? 0;
            const bOrder = bLessons[0]?.section_order ?? 0;
            return aOrder - bOrder;
        }
    );


    const applyCoupon = async () => {
        if (!couponCode) return toast.error("Enter a coupon code");

        const { data: coupon, error } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", couponCode.toUpperCase())
            .maybeSingle();

        if (error || !coupon) return toast.error("Invalid coupon");

        // Validate course restriction
        if (coupon.course_id && coupon.course_id !== course.id) {
            return toast.error("Coupon not valid for this course");
        }

        // Validate expiry
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return toast.error("Coupon expired");
        }

        // Validate usage
        if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
            return toast.error("Coupon usage limit reached");
        }

        // ✅ Apply discount on *discounted price* (course.price)
        // ✅ Apply discount on *discounted price* (course.price)
        const discount = Math.floor((course.price * coupon.discount_percent) / 100);
        const newPrice = Math.max(course.price - discount, 0);

        // make sure it's always integer
        setDiscountedPrice(Math.round(newPrice));


        // ⚡ Store BOTH coupon id & code separately
        setAppliedCoupon(coupon.code);  // for UI
        setCouponId(coupon.id);         // for backend
        toast.success(
            `Coupon applied! You saved ${coupon.discount_percent}% 🎉`
        );
    };

    if (loadingUser) return <p className="text-center">Loading...</p>;
    if (loading) return <div className="p-8">⏳ Loading course details...</div>;
    if (!course) return <div className="p-8">❌ Course not found.</div>;





    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-10 ">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        {/* <BookOpen className="hidden md:block h-8 w-8 text-purple-600" /> */}
                        {course.name}
                    </h1>

                    {/* 🌟 Course Info */}
                    <div className="mt-4 space-y-3 text-sm">
                        {/* 🌐 Language */}
                        {course.language && (
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-500" />
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    🌐 {course.language}
                                </Badge>
                            </div>
                        )}

                        {/* 🎓 Certification */}
                        {course.certification && (
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-green-600" />
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                                    🎓 Certificate Included
                                </Badge>
                            </div>
                        )}

                        {/* 📂 Category */}
                        {course.categories && (
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500">📂</span>
                                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                    {course.categories}
                                </Badge>
                            </div>
                        )}

                        {(course.tags ?? []).length > 0 && (
                            <div className="flex items-start gap-2">
                                <span className="text-pink-500">🏷️</span>
                                <div className="flex flex-wrap gap-2">
                                    {(course.tags ?? []).map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="border-pink-400 text-pink-600 dark:text-pink-300 dark:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/30"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* ⭐ Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐</span>
                            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                {course.ratings?.toFixed(1) || "0.0"} Rating
                            </Badge>
                        </div>

                        {/* 👨‍🎓 Students */}
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-500">👨‍🎓</span>
                            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {course.purchased || 0} Enrolled
                            </Badge>
                        </div>

                        {/* 🎯 Level */}
                        {course.level && (
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">🎯</span>
                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                    {course.level}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">
                        {course.description}
                    </p>

                    {/* 🌟 Course Stats */}
                    <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 shadow-md border border-neutral-200 dark:border-neutral-700">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-medium">

                            {/* ⭐ Rating */}
                            <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <Star className="h-6 w-6 text-yellow-400 group-hover:animate-spin" />
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {course.ratings?.toFixed(1) || "0.0"} <span className="text-xs text-neutral-500">Rating</span>
                                </span>
                            </div>

                            {/* 👨‍🎓 Students */}
                            <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <Users className="h-6 w-6 text-indigo-500 group-hover:animate-bounce" />
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {course.purchased || 0} <span className="text-xs text-neutral-500">Students</span>
                                </span>
                                <AvatarCircles numPeople={course.purchased || 0} avatarUrls={avatars} />
                            </div>

                            {/* 🎯 Level */}
                            <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <Layers className="h-6 w-6 text-pink-500 group-hover:animate-pulse" />
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {course.level || "All Levels"}
                                </span>
                            </div>

                            {/* ⏳ Duration */}
                            <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <Clock className="h-6 w-6 text-emerald-500 group-hover:rotate-180 transition-all" />
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {formatDuration(course.duration)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 👉 Price Card (Mobile only) */}
                    <div className="block lg:hidden">
                        <Card
                            className="relative overflow-hidden border border-neutral-200 dark:border-neutral-700 
               rounded-2xl bg-gradient-to-b from-white to-neutral-50 
               dark:from-neutral-900 dark:to-neutral-800 
               shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Subtle glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
                    rounded-2xl blur-2xl opacity-40 pointer-events-none" />

                            <CardContent className="relative p-8 space-y-6">
                                {/* 💸 Price Section with Coupon */}
                                {/* 💸 Price Section with Estimated Price + Coupon */}
                                {/* 💸 Price Section with Estimated + Coupon */}
                                <div className="text-center space-y-3">
                                    {appliedCoupon ? (
                                        <motion.div
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <motion.span
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-5xl font-extrabold tracking-tight text-green-500 drop-shadow-lg"
                                                >
                                                    ₹{discountedPrice?.toFixed(2)}
                                                </motion.span>

                                                {/* Show estimated price (original high price) */}
                                                {course.estimated_price && (
                                                    <span className="text-xl line-through text-neutral-400">
                                                        ₹{course.estimated_price}
                                                    </span>
                                                )}
                                            </div>

                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="mt-2 px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold"
                                            >
                                                🎉 Coupon <b>{appliedCoupon}</b> applied
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.span
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
                                            >
                                                ₹{course.price}
                                            </motion.span>

                                            {/* Show estimated price crossed out if available */}
                                            {course.estimated_price && (
                                                <span className="text-lg line-through text-neutral-400">
                                                    ₹{course.estimated_price}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>


                                {/* 🎟️ Coupon Input */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="flex gap-2 mt-6"
                                >
                                    <Input
                                        placeholder="🎟️ Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-lg font-semibold tracking-wider placeholder:text-neutral-400 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-xl px-4 py-3"
                                    />
                                    <Button
                                        onClick={applyCoupon}
                                        className="px-6 py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                                    >
                                        Apply 🚀
                                    </Button>
                                </motion.div>



                                {/* CTA Button */}
                                <Card className="relative overflow-hidden rounded-2xl border shadow-lg">
                                    <CardContent className="p-8 space-y-6">
                                        {user ? (
                                            <CourseCTA
                                                course={course}
                                                price={discountedPrice ?? course.price}
                                                couponId={couponId}
                                            />
                                        ) : (
                                            <Button
                                                onClick={() => (window.location.href = "/auth/login")}
                                                className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                                            >
                                                Login to Enroll 🚀
                                            </Button>
                                        )}


                                    </CardContent>
                                </Card>


                                {/* Guarantee */}
                                <p className="text-xs text-neutral-500 text-center">
                                    💸 30-day money-back guarantee
                                </p>

                                {/* Extra Perks */}
                                <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">✅</span> Lifetime access
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600">🎓</span> Certificate of completion
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-600">📱</span> Learn on any device
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">💻</span> 1 fully working project with installation guide
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-600">📖</span> Free Ebook included
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>



                    {/* 📘 Benefits / Learning Outcomes */}
                    {benefits.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-16 flex items-center gap-2 ">
                                <Lightbulb className="h-7 w-7 text-yellow-500 animate-pulse" />
                                What you&apos;ll learn
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((b) => (
                                    <div
                                        key={b.id}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-100 
                     dark:from-neutral-800 dark:to-neutral-900 border border-emerald-200 dark:border-neutral-700 
                     shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                                    >
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0 group-hover:animate-bounce" />
                                        <span className="text-neutral-800 dark:text-neutral-200">{b.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 🎯 Prerequisites */}
                    {prerequisites.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-16 flex items-center gap-2">
                                <Target className="h-7 w-7 text-red-500 animate-pulse" /> Prerequisites 🎯
                            </h2>
                            <div className="space-y-3">
                                {prerequisites.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-100
                     dark:from-neutral-800 dark:to-neutral-900 border border-red-200 dark:border-neutral-700 
                     hover:shadow-md transition-all"
                                    >
                                        <span className="text-red-600 text-lg">⚡</span>
                                        <span className="text-neutral-800 dark:text-neutral-200">{p.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✨ Features */}
                    {features.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-16 flex items-center gap-2">
                                <Sparkles className="h-7 w-7 text-purple-500 animate-pulse" /> Course Features ✨
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {features.map((f) => (
                                    <div
                                        key={f.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-100
                     dark:from-neutral-800 dark:to-neutral-900 border border-purple-200 dark:border-neutral-700 
                     hover:shadow-md transition-all"
                                    >
                                        <span className="text-purple-600">🌟</span>
                                        <span className="text-neutral-800 dark:text-neutral-200">{f.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <CertificatePreview />

                    {/* 📘 Course Content */}
                    {courseData.length > 0 && (
                        <div className="mt-24">
                            <h2 className="text-3xl font-extrabold mb-16 flex items-center gap-3 tracking-tight ">
                                <BookOpen className="h-8 w-8 text-indigo-500 animate-pulse" />
                                Course Content
                            </h2>

                            <Accordion type="multiple" className="w-full space-y-3">
                                {(() => {
                                    // Group content by section
                                    const groupedContent = courseData.reduce((acc, item) => {
                                        const section = item.section || "General";
                                        if (!acc[section]) acc[section] = [];
                                        acc[section].push(item);
                                        return acc;
                                    }, {} as Record<string, CourseData[]>);

                                    // Sort lessons inside each section by "order"
                                    Object.keys(groupedContent).forEach((section) => {
                                        groupedContent[section].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                                    });

                                    // Sort sections by section_order
                                    const sortedSections = Object.entries(groupedContent).sort(
                                        ([, aLessons], [, bLessons]) =>
                                            (aLessons[0]?.section_order ?? 0) - (bLessons[0]?.section_order ?? 0)
                                    );

                                    return sortedSections.map(([section, lessons], idx) => (
                                        <AccordionItem key={section} value={section}>
                                            <AccordionTrigger
                                                className="group text-lg font-semibold px-4 py-3 rounded-xl 
                bg-gradient-to-r from-indigo-50 to-purple-100 dark:from-neutral-800 dark:to-neutral-900
                border border-indigo-200 dark:border-neutral-700
                hover:shadow-lg hover:scale-[1.015] transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="flex items-center justify-center h-8 w-8 rounded-full 
                    bg-gradient-to-br from-purple-500 to-pink-500 
                    text-white text-sm font-bold shadow-md"
                                                    >
                                                        {idx + 1}
                                                    </span>
                                                    {section}
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent>
                                                <ul className="space-y-3 mt-3">
                                                    {lessons.map((lesson) => (
                                                        <li
                                                            key={lesson.id}
                                                            className="flex items-center justify-between px-4 py-2 rounded-lg 
                      bg-gradient-to-r from-pink-50 to-rose-100 dark:from-neutral-800 dark:to-neutral-900
                      border border-pink-200 dark:border-neutral-700
                      hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-pink-600">📖</span>
                                                                <span>{lesson.title}</span>
                                                            </div>
                                                            {lesson.is_preview && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-pink-500 text-pink-600 bg-pink-50/80 dark:bg-neutral-800"
                                                                >
                                                                    🎥 Preview
                                                                </Badge>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ));
                                })()}
                            </Accordion>
                        </div>
                    )}


                    {/* 👨‍🏫 Instructors */}
                    {instructors.length > 0 && (
                        <div className="mt-16 ">
                            <h2 className="text-3xl font-extrabold mb-16 flex items-center gap-3 tracking-tight">
                                <GraduationCap className="h-8 w-8 text-indigo-500 animate-bounce" />
                                Meet the Instructors
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8 mb-30">
                                {instructors.map((inst) => (
                                    <div
                                        key={inst.id}
                                        className="relative group p-6 rounded-2xl border border-indigo-200 dark:border-neutral-700 
                     bg-gradient-to-r from-indigo-50 to-purple-100 
                     dark:from-neutral-800 dark:to-neutral-900
                     hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            <Image
                                                src={inst.avatar_url || "https://via.placeholder.com/100?text=No+Image"}
                                                alt={inst.name}
                                                width={70}
                                                height={70}
                                                className="rounded-full object-cover ring-4 ring-indigo-300/70 shadow-md 
                         group-hover:ring-indigo-500 group-hover:shadow-xl transition-all"
                                            />
                                            <div>
                                                <p className="font-bold text-lg text-neutral-900 dark:text-white">{inst.name}</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{inst.bio}</p>
                                            </div>
                                        </div>

                                        {/* Floating badge on hover */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                          transition-all text-indigo-700 text-xs font-semibold bg-indigo-100 
                          px-2 py-1 rounded-full shadow-sm dark:bg-indigo-900/40 dark:text-indigo-300">
                                            🌟 Expert
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                </div>

                {/* Right column (sticky preview) */}
                {/* Right column (sticky preview) */}
                {/* Right column (sticky preview) */}
                <div className="space-y-6 lg:sticky lg:top-8 self-start h-fit">

                    <div className="hidden lg:block">

                        <Card
                            className="relative overflow-hidden border border-neutral-200 dark:border-neutral-700 
               rounded-2xl bg-gradient-to-b from-white to-neutral-50 
               dark:from-neutral-900 dark:to-neutral-800 
               shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Subtle glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
                    rounded-2xl blur-2xl opacity-40 pointer-events-none" />

                            <CardContent className="relative p-8 space-y-6">
                                {/* 💸 Price Section with Coupon */}
                                {/* 💸 Price Section with Estimated Price + Coupon */}
                                {/* 💸 Price Section with Estimated + Coupon */}
                                <div className="text-center space-y-3">
                                    {appliedCoupon ? (
                                        <motion.div
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <motion.span
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-5xl font-extrabold tracking-tight text-green-500 drop-shadow-lg"
                                                >
                                                    ₹{discountedPrice?.toFixed(2)}
                                                </motion.span>

                                                {/* Show estimated price (original high price) */}
                                                {course.estimated_price && (
                                                    <span className="text-xl line-through text-neutral-400">
                                                        ₹{course.estimated_price}
                                                    </span>
                                                )}
                                            </div>

                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="mt-2 px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold"
                                            >
                                                🎉 Coupon <b>{appliedCoupon}</b> applied
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.span
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
                                            >
                                                ₹{course.price}
                                            </motion.span>

                                            {/* Show estimated price crossed out if available */}
                                            {course.estimated_price && (
                                                <span className="text-lg line-through text-neutral-400">
                                                    ₹{course.estimated_price}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>


                                {/* 🎟️ Coupon Input */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="flex gap-2 mt-6"
                                >
                                    <Input
                                        placeholder="🎟️ Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-lg font-semibold tracking-wider placeholder:text-neutral-400 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-xl px-4 py-3"
                                    />
                                    <Button
                                        onClick={applyCoupon}
                                        className="px-6 py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                                    >
                                        Apply 🚀
                                    </Button>
                                </motion.div>



                                {/* CTA Button */}
                                <Card className="relative overflow-hidden rounded-2xl border shadow-lg">
                                    <CardContent className="p-8 space-y-6">
                                        {user ? (
                                            <CourseCTA
                                                course={course}
                                                price={discountedPrice ?? course.price}
                                                couponId={couponId}
                                            />
                                        ) : (
                                            <Button
                                                onClick={() => (window.location.href = "/auth/login")}
                                                className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                                            >
                                                Login to Enroll 🚀
                                            </Button>
                                        )}

                                    </CardContent>
                                </Card>


                                {/* Guarantee */}
                                <p className="text-xs text-neutral-500 text-center">
                                    💸 30-day money-back guarantee
                                </p>

                                {/* Extra Perks */}
                                <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">✅</span> Lifetime access
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600">🎓</span> Certificate of completion
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-600">📱</span> Learn on any device
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">💻</span> 1 fully working project with installation guide
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-600">📖</span> Free Ebook included
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* 📸 Thumbnail */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-700">
                        <Image
                            src={
                                course.thumbnail_url ||
                                "https://via.placeholder.com/800x400?text=No+Image"
                            }
                            alt={course.name}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />

                        {/* Overlay gradient for subtle shine */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    </div>

                    {/* 🎥 Demo Video */}
                    {course.demo_url && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-700 mt-6">
                            <iframe
                                src={course.demo_url}
                                className="w-full h-full"
                                allowFullScreen
                            />
                            {/* Play indicator overlay */}
                            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                🎬 Demo Video
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
