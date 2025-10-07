/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, ReactNode } from "react";
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
    PlayCircle,
    Tag,
    Film,
    PenLine,
    Languages,
    Tags,
    Info,
} from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import CertificatePreview from "@/components/InternshipCertificatePreview";
import CourseCTA from "@/components/courses/CourseCTA"; // reuse CTA for pricing
import InternshipCTA from "@/components/internship/InternshipCTA";



// 🔹 Types
type Internship = {
    max_seats: any;
    rating: number;
    average_rating: number;
    total_reviews: number;
    enrolled_count: number;
    skills: any;
    subtitles: any;
    id: string;
    title: string;
    description: string | null;
    categories: string[] | null;
    tags: string[] | null;
    price: number;
    estimated_price: number | null;
    level: string | null;
    demo_url: string | null;
    thumbnail_url: string | null;
    ratings: number;
    enrolled: number;
    created_at: string;
    duration: string | null;
    language: string | null;
    certification: boolean | null;
    recommendation: boolean | null;
};

type Instructor = {
    id: string;
    name: string;
    bio: string | null;
    avatar_url: string | null;
};

type InternshipBenefit = { id: string; title: string; description: string; };
type InternshipFeature = { id: string; title: string; description: string; };
type InternshipPrerequisite = { id: string; title: string; description: string; };
type InternshipSection = {
    id: string;
    title: string;
    internship_subsections: {
        internship_tabs: any; id: string; title: string;
    }[];
};

// 🔹 Dummy avatars
const avatars = [
    { imageUrl: "https://avatars.githubusercontent.com/u/16860528" },
    { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
    { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
    { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
    { imageUrl: "https://avatars.githubusercontent.com/u/59442788" },
];

export default function InternshipDetailsPage() {
    const { id } = useParams();
    const supabase = createClient();

    const [internship, setInternship] = useState<Internship | null>(null);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [benefits, setBenefits] = useState<InternshipBenefit[]>([]);
    const [features, setFeatures] = useState<InternshipFeature[]>([]);
    const [prerequisites, setPrerequisites] = useState<InternshipPrerequisite[]>([]);
    const [sections, setSections] = useState<InternshipSection[]>([]);
    const [loading, setLoading] = useState(true);

    const [couponCode, setCouponCode] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponId, setCouponId] = useState<string | null>(null);


    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);



    useEffect(() => {
        if (id) fetchInternship(id as string);
    }, [id]);


    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user ?? null);
            setLoadingUser(false);
        };
        getUser();
    }, [supabase]);

    const fetchInternship = async (internshipId: string) => {
        setLoading(true);
        try {
            const { data: internship, error } = await supabase
                .from("internships")
                .select("*")
                .eq("id", internshipId)
                .single();
            if (error) throw error;
            setInternship(internship);

            const { data: instructors } = await supabase
                .from("internship_instructors")
                .select("instructors(*)")
                .eq("internship_id", internshipId);
            setInstructors(
                instructors?.map((i) => {
                    if (i.instructors && !Array.isArray(i.instructors)) {
                        return i.instructors as Instructor;
                    }
                    throw new Error("Unexpected instructors shape");
                }) || []
            );

            const { data: benefits } = await supabase
                .from("internship_benefits")
                .select("*")
                .eq("internship_id", internshipId)
                .order("order", { ascending: true });
            setBenefits(benefits || []);

            const { data: features } = await supabase
                .from("internship_features")
                .select("*")
                .eq("internship_id", internshipId);
            setFeatures(features || []);

            const { data: prereqs } = await supabase
                .from("internship_prerequisites")
                .select("*")
                .eq("internship_id", internshipId);
            setPrerequisites(prereqs || []);

            const { data: sections } = await supabase
                .from("internship_sections")
                .select(`
    *,
    internship_subsections (
      *,
      internship_tabs (*)
    )
  `)
                .eq("internship_id", internshipId)
                .order("order", { ascending: true });

            setSections(sections || []);



        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch internship details");
        }
        setLoading(false);
    };

    const formatDuration = (interval: string | null) => {
        if (!interval) return null;
        const match = interval.match(/(\d+)\s+mons?/);
        return match ? `${match[1]} months` : interval;
    };

    const applyCoupon = async () => {
        if (!couponCode) return toast.error("Enter a coupon code");

        const { data: coupon, error } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", couponCode.toUpperCase())
            .maybeSingle();

        if (error || !coupon) return toast.error("Invalid coupon");

        if (coupon.internship_id && coupon.internship_id !== internship?.id)
            return toast.error("Coupon not valid for this internship");

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
            return toast.error("Coupon expired");

        if (coupon.max_uses && coupon.used_count >= coupon.max_uses)
            return toast.error("Coupon usage limit reached");

        // ✅ Integer discount calculation
        const discount = Math.floor((internship!.price * coupon.discount_percent) / 100);
        const newPrice = Math.max(internship!.price - discount, 0);

        // ✅ Ensure discounted price is an integer
        setDiscountedPrice(Math.round(newPrice));

        setAppliedCoupon(coupon.code);
        setCouponId(coupon.id);

        // ✅ Also make discount percent look clean
        toast.success(`Coupon applied! You saved ${Math.round(coupon.discount_percent)}% 🎉`);
    };


    if (loading) return <div className="p-8">⏳ Loading internship...</div>;
    if (!internship) return <div className="p-8">❌ Internship not found.</div>;
    if (loadingUser) return <p className="text-center">Loading...</p>;


    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="lg:col-span-2 space-y-8 mb-32">
                        {/* Title */}
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <BookOpen className="hidden md:block h-8 w-8 text-purple-600" />
                            {internship.title}
                        </h1>


                        {/* Info badges */}
                        {/* 📌 Internship Details */}
                        <div className="flex flex-col gap-6">

                            {/* 🌟 Internship Info */}
                            <div className="flex flex-col space-y-3 text-sm">

                                {/* 🌐 Language - Outline Badge */}
                                {internship.language && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-blue-500" />
                                        <Badge className="border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 transition">
                                            🌐 {internship.language}
                                        </Badge>
                                    </div>
                                )}

                                {/* 🎓 Certificate - Solid Gradient */}
                                {internship.certification && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-green-600" />
                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700 transition">
                                            🎓 Certificate Included
                                        </Badge>
                                    </div>
                                )}

                                {/* 🎯 Level - Outline Badge */}
                                {internship.level && (
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-pink-500" />
                                        <Badge className="border border-pink-500 text-pink-500 bg-transparent hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-900/30 transition">
                                            🎯 {internship.level}
                                        </Badge>
                                    </div>
                                )}

                                {/* ⏳ Duration - Solid */}
                                {internship.duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-emerald-500" />
                                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 transition">
                                            ⏳ {formatDuration(internship.duration)}
                                        </Badge>
                                    </div>
                                )}

                                {/* 👥 Seats - Outline Badge */}
                                {internship.max_seats && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-red-500" />
                                        <Badge className="border border-red-500 text-red-500 bg-transparent hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/30 transition">
                                            👥 {internship.max_seats} Seats
                                        </Badge>
                                    </div>
                                )}

                                {/* 🎬 Demo - Solid */}
                                {internship.demo_url && (
                                    <div className="flex items-center gap-2">
                                        <Film className="h-4 w-4 text-orange-500" />
                                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 transition">
                                            🎬 Demo Available
                                        </Badge>
                                    </div>
                                )}

                                {/* 🌐 Subtitles - Outline */}
                                {internship.subtitles?.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Languages className="h-4 w-4 text-teal-500" />
                                        <Badge className="border border-teal-500 text-teal-500 bg-transparent hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/30 transition">
                                            🌐 {internship.subtitles.length} Subtitles
                                        </Badge>
                                    </div>
                                )}

                                {/* ✍️ Letter of Recommendation - Solid */}
                                <div className="flex items-center gap-2">
                                    <PenLine className="h-4 w-4 text-indigo-500" />
                                    <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 transition">
                                        ✍️ Letter of Recommendation
                                    </Badge>
                                </div>
                            </div>


                        </div>

                        {/* 🚀 What You’ll Explore */}
                        {(internship.categories ?? []).length > 0 && (
                            <div className="flex items-start gap-2">
                                <Tags className="h-4 w-4 text-purple-600 mt-1" />
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-purple-700 mb-2">
                                        🚀 What You’ll Explore
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(internship.categories ?? []).map((cat: any, idx: any) => (
                                            <Badge
                                                key={idx}
                                                className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                                            >
                                                {cat.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* 🔖 Trending Skills You’ll Master */}
                        {(internship.tags ?? []).length > 0 && (
                            <div className="flex items-start gap-2 mt-4">
                                <Tag className="h-4 w-4 text-pink-600    mt-1" />
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-pink-700 mb-2">
                                        🔖 Trending Skills You’ll Master
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(internship.tags ?? []).map((tag, idx) => (
                                            <Badge
                                                key={idx}
                                                className="bg-pink-100 text-pink-800 hover:bg-pink-200"
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* Skills list */}
                        {internship.skills?.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Sparkles className="h-5 w-5 text-indigo-600 dark:text-yellow-500" />
                                    Skills You’ll Learn
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {internship.skills.map((skill: string, i: number) => (
                                        <Badge
                                            key={i}
                                            className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-200 
                     dark:bg-orange-900 dark:text-orange-100 dark:border-orange-800 dark:hover:bg-orange-800"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Ratings + Stats */}
                        <div className="flex flex-wrap gap-5 text-sm text-gray-600 mt-2">
                            {internship.average_rating > 0 && (
                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    {internship.average_rating.toFixed(1)} ({internship.total_reviews} reviews)
                                </span>
                            )}
                            {internship.enrolled_count > 0 && (
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    {internship.enrolled_count} Enrolled
                                </span>
                            )}
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
                                <div
                                    className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
      rounded-2xl blur-2xl opacity-40 pointer-events-none"
                                />

                                <CardContent className="relative p-8 space-y-6">
                                    {/* 💸 Price + Coupon */}
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

                                                    {internship.estimated_price && (
                                                        <span className="text-xl line-through text-neutral-400">
                                                            ₹{internship.estimated_price}
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
                                                    {internship.price}
                                                </motion.span>

                                                {internship.estimated_price && (
                                                    <span className="text-lg line-through text-neutral-400">
                                                        ₹{internship.estimated_price}
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
                                            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 
          text-lg font-semibold tracking-wider placeholder:text-neutral-400 
          focus:ring-2 focus:ring-green-400 focus:outline-none 
          rounded-xl px-4 py-3"
                                        />
                                        <Button
                                            onClick={applyCoupon}
                                            className="px-6 py-3 rounded-xl text-lg font-bold 
          bg-gradient-to-r from-green-500 to-emerald-600 
          hover:from-green-600 hover:to-emerald-700 
          text-white shadow-md hover:shadow-lg 
          transition-transform transform hover:scale-105"
                                        >
                                            Apply 🚀
                                        </Button>
                                    </motion.div>

                                    {/* CTA Section */}
                                    <Card className="relative overflow-hidden rounded-2xl border shadow-lg">
                                        <CardContent className="p-8 space-y-6">

                                            {user ? (
                                                <InternshipCTA
                                                    internship={internship}
                                                    price={discountedPrice ?? internship.price}
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

                                    {/* Guarantee + Perks */}
                                    <p className="text-xs text-neutral-500 text-center">
                                        💸 30-day money-back guarantee
                                    </p>
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
                                        <div className="flex items-center gap-2">
                                            <span className="text-pink-600">📝</span> Letter of Recommendation (LOR)
                                        </div>
                                    </div>
                                    Thumbnail
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                                        <Image
                                            src={internship.thumbnail_url || "https://via.placeholder.com/800x400"}
                                            alt={internship.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Demo Video */}
                                    {internship.demo_url && (
                                        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg mt-6">
                                            <iframe src={internship.demo_url} className="w-full h-full" allowFullScreen />
                                            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                                🎬 Demo Video
                                            </div>
                                        </div>
                                    )}


                                </CardContent>
                            </Card>

                        </div>


                        {/* 📄 Internship Description */}
                        <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed mt-2">
                            {internship.description}
                        </p>

                        {/* 🌟 Internship Stats Grid */}
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 shadow-md border border-neutral-200 dark:border-neutral-700">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-medium">

                                {internship.duration && (
                                    <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                        <Clock className="h-6 w-6 text-emerald-500 group-hover:rotate-180 transition-all" />
                                        <span className="text-neutral-700 dark:text-neutral-300">{formatDuration(internship.duration)}</span>
                                    </div>
                                )}

                                {internship.max_seats && (
                                    <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                        <Users className="h-6 w-6 text-red-500 group-hover:animate-bounce" />
                                        <span className="text-neutral-700 dark:text-neutral-300">{internship.max_seats} Seats</span>
                                    </div>
                                )}

                                {internship.level && (
                                    <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                        <Layers className="h-6 w-6 text-pink-500 group-hover:animate-pulse" />
                                        <span className="text-neutral-700 dark:text-neutral-300">{internship.level}</span>
                                    </div>
                                )}

                                {internship.demo_url && (
                                    <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
                                        <Film className="h-6 w-6 text-orange-500 group-hover:animate-spin" />
                                        <span className="text-neutral-700 dark:text-neutral-300">Demo Available</span>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>


                    {/* Benefits */}
                    {benefits.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-12 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Lightbulb className="h-7 w-7 text-yellow-500 dark:text-yellow-400" />
                                What you&apos;ll learn
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((b) => (
                                    <div
                                        key={b.id}
                                        className="flex flex-col gap-1 p-3 rounded-xl bg-green-50 text-gray-900 dark:bg-green-900 dark:text-gray-100"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                                            <span className="font-semibold">{b.title}</span>
                                        </div>
                                        {b.description && <p className="ml-7 text-sm text-gray-700 dark:text-gray-300">{b.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prerequisites */}
                    {prerequisites.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-12 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Target className="h-7 w-7 text-red-500 dark:text-red-400" />
                                Prerequisites 🎯
                            </h2>
                            <div className="space-y-3">
                                {prerequisites.map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-3 rounded-lg bg-red-50 text-gray-900 dark:bg-red-900/40 dark:text-gray-100"
                                    >
                                        <div className="font-semibold">⚡ {p.title}</div>
                                        {p.description && <p className="ml-5 text-sm text-gray-700 dark:text-gray-300">{p.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-12 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Sparkles className="h-7 w-7 text-purple-500 dark:text-purple-400" />
                                Internship Features ✨
                            </h2>
                            <div className="space-y-3">
                                {features.map((f) => (
                                    <div
                                        key={f.id}
                                        className="p-3 rounded-lg bg-purple-50 text-gray-900 dark:bg-purple-900/40 dark:text-gray-100"
                                    >
                                        <div className="font-semibold">🌟 {f.title}</div>
                                        {f.description && <p className="ml-5 text-sm text-gray-700 dark:text-gray-300">{f.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    <CertificatePreview />

                    {/* Sections */}
                    {sections.length > 0 && (
                        <div className="mt-14">
                            <h2 className="text-3xl font-extrabold mb-16 flex items-center gap-3 text-gray-900 dark:text-gray-100">
                                <BookOpen className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                                Internship Content
                            </h2>

                            <Accordion
                                type="multiple"
                                className="w-full space-y-4"
                                value={sections.map((section) => section.id)} // all sections active
                            >
                                {sections.map((section, idx) => (
                                    <AccordionItem
                                        key={section.id}
                                        value={section.id}
                                        className="border rounded-xl shadow-sm 
                     bg-gradient-to-br from-purple-50 to-white 
                     dark:from-purple-900/30 dark:to-gray-900"
                                    >
                                        <AccordionTrigger className="px-4 py-3 hover:bg-purple-100/60 dark:hover:bg-purple-800/40 rounded-lg">
                                            <div className="flex items-center gap-3 font-semibold text-purple-800 dark:text-purple-300">
                                                <span className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                                                    {idx + 1}
                                                </span>
                                                {section.title}
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="px-4 pb-4">
                                            {/* Subsections remain collapsed by default */}
                                            <Accordion type="multiple" className="space-y-3">
                                                {section.internship_subsections?.map((ss, sidx) => (
                                                    <AccordionItem
                                                        key={ss.id}
                                                        value={ss.id}
                                                        className="border rounded-lg 
                             bg-pink-50 
                             dark:bg-pink-900/30"
                                                    >
                                                        <AccordionTrigger className="px-3 py-2 hover:bg-pink-100/70 dark:hover:bg-pink-800/40 rounded-md">
                                                            <div className="flex items-center gap-2 text-pink-800 dark:text-pink-300 font-medium">
                                                                📖 {ss.title}
                                                            </div>
                                                        </AccordionTrigger>

                                                        <AccordionContent className="pl-5 pr-3 pb-3">
                                                            {ss.internship_tabs?.length > 0 ? (
                                                                <ul className="space-y-2">
                                                                    {ss.internship_tabs.map((tab: any, tidx: any) => (
                                                                        <li
                                                                            key={tab.id}
                                                                            className="flex items-center gap-3 p-2 rounded-md 
                                       bg-white border border-gray-200 hover:border-indigo-400 
                                       dark:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-500 transition"
                                                                        >
                                                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                                                                {tidx + 1}.
                                                                            </span>
                                                                            <span className="text-gray-800 dark:text-gray-200">{tab.title}</span>

                                                                            {tab.is_preview && (
                                                                                <span className="ml-auto text-xs px-2 py-0.5 
                                               bg-green-100 text-green-700 
                                               dark:bg-green-900/40 dark:text-green-300 rounded-full"
                                                                                >
                                                                                    Preview
                                                                                </span>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                                    No tabs available
                                                                </p>
                                                            )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}




                    {/* Instructors */}
                    {instructors.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-3xl font-extrabold mb-16 flex items-center gap-3 text-gray-900 dark:text-gray-100">
                                <GraduationCap className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                                Meet the Mentors
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8 mb-40">
                                {instructors.map((inst) => (
                                    <div
                                        key={inst.id}
                                        className="p-6 rounded-2xl 
                     bg-indigo-50 text-gray-900 
                     dark:bg-indigo-900/30 dark:text-gray-100"
                                    >
                                        <div className="flex items-center gap-5">
                                            <Image
                                                src={inst.avatar_url || "https://via.placeholder.com/100"}
                                                alt={inst.name}
                                                width={70}
                                                height={70}
                                                className="rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-bold">{inst.name}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{inst.bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Right column (sticky) */}
                <div className="space-y-6 lg:sticky lg:top-8 self-start h-fit">


                    <div className="hidden lg:block">
                        <Card
                            className="relative overflow-hidden border border-neutral-200 dark:border-neutral-700 
    rounded-2xl bg-gradient-to-b from-white to-neutral-50 
    dark:from-neutral-900 dark:to-neutral-800 
    shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Subtle glow effect */}
                            <div
                                className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
      rounded-2xl blur-2xl opacity-40 pointer-events-none"
                            />

                            <CardContent className="relative p-8 space-y-6">
                                {/* 💸 Price + Coupon */}
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

                                                {internship.estimated_price && (
                                                    <span className="text-xl line-through text-neutral-400">
                                                        ₹{internship.estimated_price}
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
                                                ₹{internship.price}
                                            </motion.span>

                                            {internship.estimated_price && (
                                                <span className="text-lg line-through text-neutral-400">
                                                    ₹{internship.estimated_price}
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
                                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 
          text-lg font-semibold tracking-wider placeholder:text-neutral-400 
          focus:ring-2 focus:ring-green-400 focus:outline-none 
          rounded-xl px-4 py-3"
                                    />
                                    <Button
                                        onClick={applyCoupon}
                                        className="px-6 py-3 rounded-xl text-lg font-bold 
          bg-gradient-to-r from-green-500 to-emerald-600 
          hover:from-green-600 hover:to-emerald-700 
          text-white shadow-md hover:shadow-lg 
          transition-transform transform hover:scale-105"
                                    >
                                        Apply 🚀
                                    </Button>
                                </motion.div>

                                {/* CTA Section */}
                                <Card className="relative overflow-hidden rounded-2xl border shadow-lg">
                                    <CardContent className="p-8 space-y-6">

                                        {user ? (
                                            <InternshipCTA
                                                internship={internship}
                                                price={discountedPrice ?? internship.price}
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

                                {/* Guarantee + Perks */}
                                <p className="text-xs text-neutral-500 text-center">
                                    💸 30-day money-back guarantee
                                </p>
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
                                    <div className="flex items-center gap-2">
                                        <span className="text-pink-600">📝</span> Letter of Recommendation (LOR)
                                    </div>
                                </div>
                                Thumbnail
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                                    <Image
                                        src={internship.thumbnail_url || "https://via.placeholder.com/800x400"}
                                        alt={internship.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Demo Video */}
                                {internship.demo_url && (
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg mt-6">
                                        <iframe src={internship.demo_url} className="w-full h-full" allowFullScreen />
                                        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                            🎬 Demo Video
                                        </div>
                                    </div>
                                )}


                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </div>
    );
}
