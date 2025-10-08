"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-6 md:px-16 py-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-10"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Last updated: September 2025
                    </p>
                </div>

                {/* Sections */}
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            1. Introduction
                        </h2>
                        <p>
                            At <strong>VirtiLearn</strong>, your privacy is our priority. This
                            Privacy Policy explains how we collect, use, and protect your
                            information when you use our website, courses, internships, and
                            related services. By using VirtiLearn, you agree to the terms of
                            this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            2. Information We Collect
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Personal Information:</strong> Name, email address,
                                profile details, and payment information when applicable.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> Information about how you use our
                                platform, including course progress, device details, and browser
                                type.
                            </li>
                            <li>
                                <strong>Cookies & Tracking:</strong> We use cookies and similar
                                technologies to improve user experience and personalize content.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            3. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To provide and improve our learning services.</li>
                            <li>To communicate updates, offers, and relevant content.</li>
                            <li>To process payments and verify transactions securely.</li>
                            <li>To protect against fraud, misuse, or unauthorized access.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            4. Sharing of Information
                        </h2>
                        <p>
                            We do not sell your personal data. We may share your information
                            with:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Service Providers:</strong> For hosting, analytics, and
                                payment processing.
                            </li>
                            <li>
                                <strong>Legal Obligations:</strong> If required by law or legal
                                process.
                            </li>
                            <li>
                                <strong>Business Transfers:</strong> In case of a merger,
                                acquisition, or restructuring.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            5. Your Rights
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Access, update, or delete your account information.</li>
                            <li>Opt-out of promotional emails anytime.</li>
                            <li>
                                Request a copy of the data we hold about you by contacting
                                virtilearn@gmail.com
                                .
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            6. Data Security
                        </h2>
                        <p>
                            We implement strict security measures to protect your data.
                            However, no method of online transmission is 100% secure. By using
                            VirtiLearn, you acknowledge this risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            7. Children&apos;s Privacy
                        </h2>
                        <p>
                            VirtiLearn is not directed at individuals under 13 years of age. We
                            do not knowingly collect personal data from children.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            8. Updates to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes
                            will be posted on this page with a revised &quot;Last updated&quot;
                            date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            9. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, please reach
                            out to us at{" "}
                            <a
                                href="mailto:virtilearn@gmail.com
"
                                className="text-pink-600 dark:text-pink-400 underline"
                            >
                                virtilearn@gmail.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
