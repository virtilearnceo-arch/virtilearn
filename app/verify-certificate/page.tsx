"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CertificateResult {
    name_on_certificate: string;
    certificate_url: string;
    issued_at: string;
    type: "course" | "internship";
}

export default function VerifyCertificatePage() {
    const supabase = createClient();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CertificateResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // 1️⃣ Check in course_certificates
            const { data: courseCert, error: courseErr } = await supabase
                .from("course_certificates")
                .select("name_on_certificate, certificate_url, issued_at")
                .eq("verification_code", code)
                .maybeSingle();

            if (courseErr) throw courseErr;
            if (courseCert) {
                setResult({ ...courseCert, type: "course" });
                return;
            }

            // 2️⃣ Check in internship_certificates
            const { data: internCert, error: internErr } = await supabase
                .from("internship_certificates")
                .select("name_on_certificate, certificate_url, issued_at")
                .eq("verification_code", code)
                .maybeSingle();

            if (internErr) throw internErr;
            if (internCert) {
                setResult({ ...internCert, type: "internship" });
                return;
            }

            // ❌ Not found
            setError("❌ No certificate found for this verification code.");
        } catch (err) {
            console.error(err);
            setError("⚠️ Something went wrong. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-16 px-6 text-center mt-16">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 mb-6">
                🔎 Verify Certificate
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Enter the verification code printed on the certificate to check its authenticity.
            </p>

            <div className="flex gap-3 justify-center mb-8">
                <Input
                    placeholder="e.g. aa8016-748aaf"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="max-w-xs"
                />
                <Button
                    onClick={handleVerify}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                    {loading ? "Verifying..." : "Verify"}
                </Button>
            </div>

            {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}

            {result && (
                <div className="mt-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                        ✅ Certificate Found ({result.type})
                    </h2>
                    <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                        Issued to: <span className="font-bold">{result.name_on_certificate}</span>
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Issued at: {new Date(result.issued_at).toLocaleDateString()}
                    </p>

                    <a
                        href={result.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-5 py-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-md"
                    >
                        View Certificate
                    </a>
                </div>
            )}
        </div>
    );
}
