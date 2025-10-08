"use client";

import Image from "next/image";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/magicui/scroll-based-velocity";
import { CertificateCard } from "./CertificatesShowcase"; // reuse your CertificateCard

const fakePosts = [
    {
        user: "Ananya Sharma",
        avatar: "https://i.pravatar.cc/40?img=1",
        certificate: "Course",
        img: "https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Course_Sample_Certificate.png",
        text: "Just completed my VirtiLearn AI course! 🚀 Feeling accomplished and ready to build amazing projects.",
    },
    {
        user: "Rohan Mehta",
        avatar: "https://i.pravatar.cc/40?img=2",
        certificate: "Internship",
        img: "https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Internship_Sample_Certificate.png",
        text: "Finished my web dev internship at VirtiLearn! 💻 Check out my verified certificate. #VirtiLearn #Achievement",
    },
    {
        user: "Priya Nair",
        avatar: "https://i.pravatar.cc/40?img=3",
        certificate: "Course",
        img: "https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Course_Sample_Certificate.png",
        text: "Learning never stops! Completed a premium VirtiLearn course with QR-verifiable certificate. 🔗",
    },
];

export default function LinkedInMockScroll() {
    return (
        <section className="max-w-7xl mx-auto py-20 px-6 md:px-12 text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                💼 Shared by Our Students
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg max-w-3xl mx-auto mb-12">
                Real students showing off their <span className="font-semibold text-yellow-500">verified VirtiLearn certificates</span> on LinkedIn
            </p>

            <ScrollVelocityContainer className="flex gap-8 py-4">
                <ScrollVelocityRow baseVelocity={10} direction={1} className="flex gap-8">
                    {fakePosts.map((post, idx) => (
                        <div key={idx} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-80 p-4 flex flex-col gap-4">
                            {/* User info */}
                            <div className="flex items-center gap-3">
                                <Image src={post.avatar} alt={post.user} width={40} height={40} className="rounded-full" />
                                <span className="font-semibold text-neutral-800 dark:text-neutral-100">{post.user}</span>
                            </div>

                            {/* Certificate preview */}
                            <CertificateCard type={post.certificate as "Course" | "Internship"} img={post.img} />

                            {/* Post text */}
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 text-left">{post.text}</p>
                        </div>
                    ))}
                </ScrollVelocityRow>

                <ScrollVelocityRow baseVelocity={10} direction={-1} className="flex gap-8">
                    {fakePosts.map((post, idx) => (
                        <div key={idx} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-80 p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Image src={post.avatar} alt={post.user} width={40} height={40} className="rounded-full" />
                                <span className="font-semibold text-neutral-800 dark:text-neutral-100">{post.user}</span>
                            </div>
                            <CertificateCard type={post.certificate as "Course" | "Internship"} img={post.img} />
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 text-left">{post.text}</p>
                        </div>
                    ))}
                </ScrollVelocityRow>
            </ScrollVelocityContainer>

            {/* Left & Right gradient masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </section>
    );
}
