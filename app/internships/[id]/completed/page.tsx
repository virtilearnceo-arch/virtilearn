/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    issued_at: string;
}

export default function InternshipCompletedPage() {
    const { id: userInternshipId } = useParams<{ id: string; }>(); // This is user_internships.id
    const supabase = createClient();

    const [userId, setUserId] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [internshipTitle, setInternshipTitle] = useState<string>("");
    const [studentName, setStudentName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Review states
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState<number>(0);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const [internshipDuration, setInternshipDuration] = useState<number | null>(null);

    // Disclaimer
    const [confirmed, setConfirmed] = useState(false);

    // ✅ Get logged-in user
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data.user?.id || null);
        };
        getUser();
    }, []);

    // ✅ Fetch user_internship + joined internship + user info
    useEffect(() => {
        if (!userId || !userInternshipId) return;

        const fetchUserInternship = async () => {
            const { data, error } = await supabase
                .from("user_internships")
                .select(`
      id,
      internship_id,
      status,
      progress,
      internship:internship_id (title),
      user:user_id (first_name, last_name)
    `)
                .eq("id", userInternshipId)
                .maybeSingle();

            if (error) {
                console.error("Error fetching user internship:", error);
                return;
            }
            if (!data) {
                alert("You are not enrolled in this internship.");
                return;
            }

            // ✅ Supabase returns arrays for relationships → unwrap
            const internship = Array.isArray(data.internship) ? data.internship[0] : data.internship;
            const user = Array.isArray(data.user) ? data.user[0] : data.user;

            setInternshipTitle(internship?.title ?? "");
            setStudentName(`${user?.first_name ?? ""} ${user?.last_name ?? ""}`);
        };


        fetchUserInternship();
    }, [userId, userInternshipId]);

    // ✅ Fetch certificate only for this user + this internship
    useEffect(() => {
        if (!userId || !userInternshipId) return;

        const fetchCert = async () => {
            const { data, error } = await supabase
                .from("internship_certificates")
                .select("*")
                .eq("user_id", userId) // ✅ only this user
                .eq(
                    "internship_id",
                    (
                        await supabase
                            .from("user_internships")
                            .select("internship_id")
                            .eq("id", userInternshipId)
                            .maybeSingle()
                    )?.data?.internship_id || ""
                )
                .maybeSingle();

            if (error) {
                console.error("Error fetching certificate:", error);
                return;
            }

            if (data) {
                setCertificate(data);
                setPreviewUrl(data.certificate_url); // if you want preview
            }
        };

        fetchCert();
    }, [userId, userInternshipId]);

    useEffect(() => {
        if (!userId || !userInternshipId) return;

        const fetchUserInternship = async () => {
            const { data, error } = await supabase
                .from("user_internships")
                .select(`
    id,
    internship_id,
    status,
    progress,
    internship:internship_id (title, duration),
    user:user_id (first_name, last_name)
  `)
                .eq("id", userInternshipId)
                .maybeSingle();

            if (error) return console.error(error);
            if (!data) return alert("You are not enrolled in this internship.");

            // ✅ Supabase types `internship` as an array → pick the first element
            const internship = Array.isArray(data.internship) ? data.internship[0] : data.internship;
            const user = Array.isArray(data.user) ? data.user[0] : data.user;

            setInternshipTitle(internship?.title ?? "");
            setStudentName(`${user?.first_name ?? ""} ${user?.last_name ?? ""}`);

            const months = parseIntervalToMonths(internship?.duration ?? null);
            setInternshipDuration(months);


        };

        fetchUserInternship();
    }, [userId, userInternshipId]);


    // // ✅ Check if review already exists
    // useEffect(() => {
    //     if (!userId || !userInternshipId) return;

    //     const checkReview = async () => {
    //         const { data } = await supabase
    //             .from("internship_reviews")
    //             .select("id")
    //             .eq("user_id", userId)
    //             .eq("internship_id", internshipIdFromEnrollment(userInternshipId))
    //             .maybeSingle();

    //         if (data) setReviewSubmitted(true);
    //     };

    //     // Helper to get internship_id from user_internships row
    //     const internshipIdFromEnrollment = (uid: string) => {
    //         // Could store in state or fetch here if needed
    //         return ""; // handled in submitReview
    //     };

    //     checkReview();
    // }, [userId, userInternshipId]);

    // ✅ Submit review
    const submitReview = async () => {
        if (!reviewText.trim() || rating === 0 || !userId || !userInternshipId) return;
        setLoading(true);

        // Get internship_id from user_internships
        const { data: enrollment } = await supabase
            .from("user_internships")
            .select("internship_id")
            .eq("id", userInternshipId)
            .maybeSingle();

        if (!enrollment) {
            setLoading(false);
            return alert("You are not enrolled in this internship.");
        }


        const internship_id = enrollment.internship_id;

        const { error } = await supabase
            .from("internship_reviews")
            .upsert(
                {
                    user_id: userId,
                    internship_id,
                    comment: reviewText,
                    rating,
                } as any, // 👈 cast to bypass TS overload mismatch
                { onConflict: "internship_id,user_id" }
            );


        setLoading(false);
        if (!error) setReviewSubmitted(true);
        else console.error("Error submitting review:", error);
    };

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data.user?.id || null);
        };
        getUser();
    }, []);


    function parseIntervalToMonths(interval: string | null): number {
        if (!interval) return 0;

        let totalMonths = 0;
        const yearMatch = interval.match(/(\d+)\s+year/);
        const monthMatch = interval.match(/(\d+)\s+mon/);

        if (yearMatch) totalMonths += parseInt(yearMatch[1]) * 12;
        if (monthMatch) totalMonths += parseInt(monthMatch[1]);

        return totalMonths;
    }



    // ✅ Draw certificate
    const drawCertificate = async (studentName: string, internshipName: string, verificationCode: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = 2000;
        canvas.height = 1414;
        const ctx = canvas.getContext("2d")!;

        return new Promise<string>(async (resolve, reject) => {
            try {

                await document.fonts.load("700 65px 'Open Sans'");
                await document.fonts.load("700 48px 'Open Sans'");
                await document.fonts.load("700 40px 'Open Sans'");
                await document.fonts.load("700 30px 'Open Sans'");
                await document.fonts.ready; // wait until all fonts declared are ready


                const templateUrl =
                    "https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/Internship_Certificate.png";
                const template = new Image();
                template.crossOrigin = "anonymous";
                template.src = templateUrl;

                template.onload = () => {
                    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

                    // Customize these coordinates to fix text position
                    ctx.fillStyle = "#2c3133";
                    ctx.textAlign = "center";
                    ctx.font = "550 65px 'Open Sans'";
                    ctx.fillText(studentName, 990, 720); // <-- adjust X,Y here
                    ctx.font = "550 48px 'Open Sans'";
                    ctx.fillText(internshipName, 990, 880); // <-- adjust X,Y here
                    ctx.font = "550 40px 'Open Sans'";
                    if (internshipDuration) {
                        ctx.font = "550 40px 'Open Sans'";
                        ctx.fillText(`${internshipDuration} `, 772, 945); // <-- adjust Y as needed
                    }
                    ctx.font = "550 36px 'Open Sans'";
                    ctx.fillText(new Date().toLocaleDateString(), 1100, 1140);
                    ctx.textAlign = "center";
                    ctx.font = "550 30px 'Open Sans'";
                    ctx.fillText(`${userId?.slice(0, 6)}-${userInternshipId?.slice(0, 6)}`, 1000, 1190);

                    resolve(canvas.toDataURL("image/png"));
                };
                template.onerror = (err) => reject(err);
            } catch (err) {
                reject(err);
            }
        });
    };

    // ✅ Generate certificate;
    const generateCertificate = async () => {
        if (!studentName.trim() || !userId || !userInternshipId || !confirmed) return;
        if (certificate) return alert("Certificate already generated.");

        setLoading(true);

        try {
            const { data: enrollment } = await supabase
                .from("user_internships")
                .select("internship_id")
                .eq("id", userInternshipId)
                .maybeSingle();

            if (!enrollment) throw new Error("Enrollment not found");
            const internship_id = enrollment.internship_id;

            const dataUrl = await drawCertificate(studentName, internshipTitle, `${userId.slice(0, 6)}-${userInternshipId.slice(0, 6)}`);
            setPreviewUrl(dataUrl);

            const verificationCode = `${userId.slice(0, 6)}-${userInternshipId.slice(0, 6)}`;



            const fileName = `${userId}/${internship_id}.png`;
            const base64 = dataUrl.split(",")[1];
            const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], { type: "image/png" });

            const { error: uploadError } = await supabase.storage
                .from("certificates")
                .upload(fileName, blob, { contentType: "image/png", upsert: false });
            if (uploadError) throw uploadError;

            const certificateUrl = `https://mgakimsdodrycekkmbxg.supabase.co/storage/v1/object/public/certificates/${fileName}`;


            const { data, error } = await supabase
                .from("internship_certificates")
                .insert({
                    user_id: userId,
                    internship_id,
                    name_on_certificate: studentName,
                    certificate_url: certificateUrl,
                    verification_code: verificationCode,   // ✅ save in DB

                })
                .select()
                .maybeSingle();

            if (error) throw error;
            setCertificate(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };





    const downloadCertificate = (certificateUrl: string) => {
        const link = document.createElement("a");
        link.href = certificateUrl;
        link.download = "internship_certificate.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <div className="p-10 max-w-3xl mx-auto text-center mt-16 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {!certificate ? (
                <>
                    <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
                        🎉 Congrats on Completing {internshipTitle || "the internship"}!
                    </h1>

                    {!reviewSubmitted ? (
                        <div className="bg-white dark:bg-neutral-900 p-6 shadow-lg rounded-2xl border border-gray-200 dark:border-neutral-700 mb-6 transition-colors duration-300">
                            <h2 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-400">
                                ⭐ Leave a Review Before Unlocking Certificate
                            </h2>

                            <div className="flex justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={32}
                                        className={`cursor-pointer ${rating >= star
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                            }`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>

                            <Textarea
                                placeholder="Share your experience..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="mb-4 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />

                            <Button
                                onClick={submitReview}
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all"
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 text-gray-600 dark:text-gray-300">
                                ✅ Review submitted! Now generate your certificate.
                            </p>

                            <div className="bg-yellow-50 dark:bg-neutral-800 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4 mb-4 transition-colors duration-300">
                                <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">
                                    ⚠️ Disclaimer: You can generate your internship certificate only
                                    ONCE. Please make sure your name is correct before confirming.
                                    Once created, it cannot be changed or overwritten.
                                </p>

                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="confirm"
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                        className="accent-yellow-500 dark:accent-yellow-400"
                                    />
                                    <label
                                        htmlFor="confirm"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        I confirm that my name is correct and I want to generate my
                                        certificate.
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center mb-6">
                                <Input
                                    placeholder="Your full name"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="max-w-xs bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                <Button
                                    onClick={generateCertificate}
                                    disabled={loading || !confirmed}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all"
                                >
                                    {loading ? "Generating..." : "Generate Certificate"}
                                </Button>
                            </div>

                            {previewUrl && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                        🔎 Preview
                                    </h3>
                                    <img
                                        src={previewUrl}
                                        alt="Certificate Preview"
                                        className="border border-gray-300 dark:border-neutral-700 rounded-lg shadow-lg mx-auto mb-6"
                                    />

                                    <label
                                        htmlFor="confirm"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        ⏳ Wait for <span className="underline">Download Certificate</span> button to be visible
                                    </label>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <div>
                    <h1 className="text-3xl font-extrabold mb-4 text-purple-700 dark:text-purple-400">
                        🎉 Your Certificate is Ready!
                    </h1>

                    <img
                        src={certificate.certificate_url}
                        alt="Internship Certificate"
                        className="border-4 border-purple-600 dark:border-purple-500 rounded-xl shadow-2xl mx-auto mb-6"
                    />

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => window.open(certificate.certificate_url, "_blank")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-6 py-2"
                        >
                            View Certificate
                        </Button>
                        <Button
                            onClick={() => downloadCertificate(certificate.certificate_url)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-6 py-2"
                        >
                            Download Certificate
                        </Button>
                    </div>
                </div>
            )}
        </div>

    );
}
