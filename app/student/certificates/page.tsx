/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CourseCertificate {
    id: string;
    course_id: string;
    name_on_certificate: string;
    certificate_url: string;
    issued_at: string;
    courses?: { name: string; } | null;   // 👈 fetch as object
}

interface InternshipCertificate {
    id: string;
    internship_id: string;
    name_on_certificate: string;
    certificate_url: string;
    issued_at: string;
    internships?: { title: string; } | null; // 👈 fetch as object
}

export default function CertificatesPage() {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [courseCertificates, setCourseCertificates] = useState<CourseCertificate[]>([]);
    const [internshipCertificates, setInternshipCertificates] = useState<InternshipCertificate[]>([]);

    // Get logged-in user
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data.user?.id || null);
        };
        getUser();
    }, []);

    // Fetch Course Certificates
    useEffect(() => {
        // Fetch Course Certificates
        if (!userId) return;
        const fetchCourseCertificates = async () => {
            const { data, error } = await supabase
                .from("course_certificates")
                .select(`
            id,
            course_id,
            name_on_certificate,
            certificate_url,
            issued_at,
            courses!inner(name)
        `)
                .eq("user_id", userId);

            if (!error && data) {
                const normalized = data.map((cert: any) => ({
                    ...cert,
                    courses: cert.courses ?? null, // already a single object from !inner
                }));
                setCourseCertificates(normalized);
            }
        };

        fetchCourseCertificates();
    }, [userId]);

    // Fetch Internship Certificates
    useEffect(() => {
        // Fetch Internship Certificates
        if (!userId) return;
        const fetchInternshipCertificates = async () => {
            const { data, error } = await supabase
                .from("internship_certificates")
                .select(`
            id,
            internship_id,
            name_on_certificate,
            certificate_url,
            issued_at,
            internships!inner(title)
        `)
                .eq("user_id", userId);

            if (!error && data) {
                const normalized = data.map((cert: any) => ({
                    ...cert,
                    internships: cert.internships ?? null, // now a proper object
                }));
                setInternshipCertificates(normalized);
            }
        };

        fetchInternshipCertificates();
    }, [userId]);

    // Download helper
    const downloadCertificate = (certificateUrl: string) => {
        const link = document.createElement("a");
        link.href = certificateUrl;
        link.download = "certificate.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto p-10 space-y-16 mt-16">
            {/* Course Certificates */}
            <div>
                <h1 className="text-3xl font-bold mb-6 text-purple-700">
                    🎓 My Course Certificates
                </h1>
                <Table>
                    <TableCaption>
                        {courseCertificates.length === 0
                            ? "No course certificates yet. Go start learning! 💪"
                            : "All course certificates you’ve earned"}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Course</TableHead>
                            <TableHead>Name on Certificate</TableHead>
                            <TableHead>Issued At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courseCertificates.map((cert) => (
                            <TableRow key={cert.id}>
                                <TableCell className="font-medium">
                                    {cert.courses?.name || "Unknown Course"}
                                </TableCell>
                                <TableCell>{cert.name_on_certificate}</TableCell>
                                <TableCell>{new Date(cert.issued_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        onClick={() => window.open(cert.certificate_url, "_blank")}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                    >
                                        View
                                    </Button>
                                    <Button
                                        onClick={() => downloadCertificate(cert.certificate_url)}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                    >
                                        Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Internship Certificates */}
            <div>
                <h1 className="text-3xl font-bold mb-6 text-cyan-700">
                    💼 My Internship Certificates
                </h1>
                <Table>
                    <TableCaption>
                        {internshipCertificates.length === 0
                            ? "No internship certificates yet. Time to gain real-world experience! 💪"
                            : "All internship certificates you’ve earned"}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Internship</TableHead>
                            <TableHead>Name on Certificate</TableHead>
                            <TableHead>Issued At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {internshipCertificates.map((cert) => (
                            <TableRow key={cert.id}>
                                <TableCell className="font-medium">
                                    {cert.internships?.title || "Unknown Internship"}
                                </TableCell>
                                <TableCell>{cert.name_on_certificate}</TableCell>
                                <TableCell>{new Date(cert.issued_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        onClick={() => window.open(cert.certificate_url, "_blank")}
                                        className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                                    >
                                        View
                                    </Button>
                                    <Button
                                        onClick={() => downloadCertificate(cert.certificate_url)}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                    >
                                        Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
