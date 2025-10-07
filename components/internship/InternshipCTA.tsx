/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type InternshipCTAProps = {
    internship: any;
    price: number; // final price
    couponId?: string | null;
};

export default function InternshipCTA({ internship, price, couponId }: InternshipCTAProps) {
    const supabase = createClient();
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const checkEnrollment = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("user_internships")
                .select("id")
                .eq("user_id", user.id)
                .eq("internship_id", internship.id)
                .maybeSingle();

            if (error) console.error(error);
            if (data) setIsEnrolled(true);
        };

        checkEnrollment();
    }, [internship.id, supabase]);

    return (
        <>
            {isEnrolled ? (
                <Link href={`/internships/${internship.id}/learn`}>
                    <button className="w-full px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium shadow-md hover:bg-green-700">
                        🎉 Go to Internship
                    </button>
                </Link>
            ) : (
                <Link
                    href={{
                        pathname: `/checkout/internship/${internship.id}`,
                        query: couponId ? { price, couponId } : { price },
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
