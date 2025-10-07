/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type CourseCTAProps = {
    course: any;
    price: number; // final price (discounted or original)
    couponId?: string | null; // coupon id if applied
};

export default function CourseCTA({ course, price, couponId }: CourseCTAProps) {
    const supabase = createClient();
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const checkEnrollment = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // not logged in

            const { data, error } = await supabase
                .from("purchases")
                .select("id")
                .eq("user_id", user.id)
                .eq("course_id", course.id)
                .maybeSingle();

            if (error) console.error(error);
            if (data) setIsEnrolled(true);
        };

        checkEnrollment();
    }, [course.id, supabase]);

    return (
        <>
            {isEnrolled ? (
                <Link href={`/courses/${course.id}/learn`}>
                    <button className="w-full px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium shadow-md hover:bg-green-700">
                        🎉 Go to Course
                    </button>
                </Link>
            ) : (
                <Link
                    href={{
                        pathname: `/checkout/${course.id}`,
                        query: couponId
                            ? { price, couponId }
                            : { price }, // ✅ avoid sending "undefined"
                    }}
                >
                    <button className="w-full px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium shadow-md hover:bg-purple-700">
                        🚀 Enroll Now for ₹{price}
                    </button>
                </Link>

            )}
        </>
    );
}
