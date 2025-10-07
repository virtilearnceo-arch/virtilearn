"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";


interface Certificate {
    id: string;
    name_on_certificate: string;
    certificate_url: string;
    created_at: string;
}

export default function CourseCompletedPage() {
    const { id: courseId } = useParams<{ id: string; }>();
    const supabase = createClient();

    const [userId, setUserId] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [courseTitle, setCourseTitle] = useState<string>("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Review states
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState<number>(0);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    // Disclaimer confirmation
    const [confirmed, setConfirmed] = useState(false);

    // ✅ Get logged-in user
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data.user?.id || null);
        };
        getUser();
    }, []);

    // ✅ Fetch course title
    useEffect(() => {
        if (!courseId) return;
        const fetchCourse = async () => {
            const { data } = await supabase
                .from("courses")
                .select("name")
                .eq("id", courseId)
                .single();

            if (data) setCourseTitle(data.name);
        };
        fetchCourse();
    }, [courseId]);

    // ✅ Fetch certificate if already exists
    useEffect(() => {
        if (!userId || !courseId) return;
        const fetchCert = async () => {
            const { data } = await supabase
                .from("course_certificates")
                .select("*")
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .maybeSingle();

            if (data) setCertificate(data);
        };
        fetchCert();
    }, [userId, courseId]);

    // ✅ Fetch if user already submitted review
    useEffect(() => {
        if (!userId || !courseId) return;

        const checkReview = async () => {
            const { data } = await supabase
                .from("course_reviews")
                .select("id")
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .maybeSingle();

            if (data) setReviewSubmitted(true);
        };

        checkReview();
    }, [userId, courseId]);

    // ✅ Submit Review First
    const submitReview = async () => {
        if (!reviewText.trim() || rating === 0 || !userId || !courseId) return;
        setLoading(true);

        const { error } = await supabase.from("course_reviews").insert({
            user_id: userId,
            course_id: courseId,
            comment: reviewText,
            rating: rating,
        });

        setLoading(false);
        if (!error) setReviewSubmitted(true);
    };

    // 🎨 Draw certificate canvas with template (always from Supabase)
    const drawCertificate = async (
        studentName: string,
        courseName: string,
        verificationCode: string
    ) => {
        const canvas = document.createElement("canvas");
        canvas.width = 2000;
        canvas.height = 1414;
        const ctx = canvas.getContext("2d")!;

        return new Promise<string>(async (resolve, reject) => {
            try {
                // ✅ Load font before drawing anything
                await document.fonts.load("550 65px 'Open Sans'");
                await document.fonts.load("550 48px 'Open Sans'");
                await document.fonts.load("550 40px 'Open Sans'");
                await document.fonts.load("550 36px 'Open Sans'");
                await document.fonts.load("550 30px 'Open Sans'");
                await document.fonts.ready; // wait until all fonts declared are ready

                // ✅ Get certificate template from Supabase
                const { data: templateUrlData } = supabase.storage
                    .from("certificates")
                    .getPublicUrl("Course_Cerificate.png");

                const template = new Image();
                template.crossOrigin = "anonymous";
                template.src = templateUrlData.publicUrl;

                template.onload = () => {
                    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

                    ctx.fillStyle = "#2c3133";
                    // ctx.textAlign = "left";

                    // 🟣 Student Name
                    ctx.textAlign = "center";
                    ctx.font = "550 65px 'Open Sans'";
                    ctx.fillText(studentName, 990, 720);

                    // 🟣 Course Name
                    ctx.textAlign = "center";
                    ctx.font = "550 48px 'Open Sans'";
                    ctx.fillText(courseName, 990, 880);

                    // 🟣 Issued Date
                    ctx.font = "550 36px 'Open Sans'";
                    ctx.fillText(new Date().toLocaleDateString(), 1100, 1140);

                    // 🟣 Verification Code
                    ctx.textAlign = "center";
                    ctx.font = "550 30px 'Open Sans'";
                    ctx.fillText(verificationCode, 1000, 1190);

                    resolve(canvas.toDataURL("image/png"));
                };

                template.onerror = (err) => reject(err);
            } catch (err) {
                reject(err);
            }
        });
    };

    const generateCertificate = async () => {
        if (!name.trim() || !userId || !courseId || !confirmed) return;
        if (certificate) return alert("Certificate already generated. You cannot overwrite it.");

        setLoading(true);

        try {
            const verificationCode = `${userId.slice(0, 6)}-${courseId.slice(0, 6)}`;
            const dataUrl = await drawCertificate(name, courseTitle, verificationCode);
            setPreviewUrl(dataUrl);

            const fileName = `${userId}/${courseId}.png`;

            // Convert base64 → Blob
            const base64 = dataUrl.split(",")[1];
            const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], { type: "image/png" });

            // ✅ Upload directly to the public `certificates` bucket
            const { error: uploadError } = await supabase.storage
                .from("certificates")
                .upload(fileName, blob, {
                    contentType: "image/png",
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // ✅ Get public URL (since bucket is public)
            const { data: publicUrlData } = supabase.storage
                .from("certificates")
                .getPublicUrl(fileName);

            // ✅ Save record in `course_certificates` table
            const { data, error } = await supabase
                .from("course_certificates")
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    name_on_certificate: name,
                    certificate_url: publicUrlData.publicUrl,
                    verification_code: verificationCode,   // ✅ save in DB

                })
                .select()
                .single();

            if (error) throw error;
            setCertificate(data);
        } catch (err) {
            console.error("Error generating certificate:", err);
        } finally {
            setLoading(false);
        }
    };




    const downloadCertificate = (certificateUrl: string) => {
        const link = document.createElement("a");
        link.href = certificateUrl; // already a public URL
        link.download = "certificate.png"; // force file download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="p-10 max-w-3xl mx-auto text-center">
            {!certificate ? (
                <>
                    <h1 className="text-3xl font-extrabold mb-6">
                        🎉 Congrats on Completing {courseTitle || "the course"}!
                    </h1>

                    {/* Step 1: Review Gate */}
                    {!reviewSubmitted ? (
                        <div className="bg-white p-6 shadow-lg rounded-2xl border mb-6">
                            <h2 className="text-xl font-bold mb-3 text-purple-700">
                                ⭐ Leave a Review Before Unlocking Certificate
                            </h2>
                            <div className="flex justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={32}
                                        className={`cursor-pointer ${rating >= star
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <Textarea
                                placeholder="Share your experience..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="mb-4"
                            />
                            <Button
                                onClick={submitReview}
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Step 2: Certificate Disclaimer + Form */}
                            <p className="mb-4 text-gray-600">
                                ✅ Review submitted! Now generate your certificate.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
                                <p className="text-sm text-yellow-800 font-medium">
                                    ⚠️ Disclaimer: You can generate your certificate only ONCE.
                                    Please make sure your name is correct before confirming.
                                    Once created, it cannot be changed or overwritten.
                                </p>
                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="confirm"
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                    />
                                    <label htmlFor="confirm" className="text-sm text-gray-700">
                                        I confirm that my name is correct and I want to generate my certificate.
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center mb-6">
                                <Input
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="max-w-xs"
                                />
                                <Button
                                    onClick={generateCertificate}
                                    disabled={loading || !confirmed}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                >
                                    {loading ? "Generating..." : "Generate Certificate"}
                                </Button>
                            </div>
                            {previewUrl && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">🔎 Preview</h3>
                                    <img
                                        src={previewUrl}
                                        alt="Certificate Preview"
                                        className="border rounded-lg shadow-lg mx-auto mb-6"
                                    />

                                    {/* 🔴 Warning Message */}
                                    <p className="mt-4 text-center text-red-600 font-bold bg-red-100 px-4 py-2 rounded-lg border border-red-300">
                                        ⚠️ Do not refresh the page until the <span className="underline">Download Certificate</span> button is visible.
                                    </p>
                                </div>
                            )}

                        </>
                    )}
                </>
            ) : (
                <div>
                    <h1 className="text-3xl font-extrabold mb-4 text-purple-700">
                        🎉 Your Certificate is Ready!
                    </h1>
                    <img
                        src={certificate.certificate_url}
                        alt="Certificate"
                        className="border-4 border-purple-600 rounded-xl shadow-2xl mx-auto mb-6"
                    />
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => window.open(certificate.certificate_url, "_blank")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2"
                        >
                            View Certificate
                        </Button>
                        <Button
                            onClick={() => downloadCertificate(certificate.certificate_url)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2"
                        >
                            Download Certificate
                        </Button>
                    </div>

                </div>
            )}
        </div>
    );
}
