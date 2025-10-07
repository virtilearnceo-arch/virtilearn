"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
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
                        Terms of Use
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Last updated: September 2025
                    </p>
                </div>

                {/* Sections */}
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using <strong>VirtiLearn</strong>, you agree to be
                            bound by these Terms of Use and our Privacy Policy. If you do not
                            agree, please discontinue use of the platform immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            2. Eligibility
                        </h2>
                        <p>
                            You must be at least 13 years old to use our services. By using
                            VirtiLearn, you confirm that you meet this requirement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            3. User Accounts
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                            <li>You agree to provide accurate, up-to-date information.</li>
                            <li>VirtiLearn reserves the right to suspend or terminate accounts that violate these terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            4. Use of Services
                        </h2>
                        <p>
                            You agree to use VirtiLearn only for lawful purposes and in
                            accordance with these Terms. Prohibited uses include:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Engaging in fraudulent or harmful activity.</li>
                            <li>Distributing unauthorized or malicious content.</li>
                            <li>Attempting to gain unauthorized access to our systems.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            5. Intellectual Property
                        </h2>
                        <p>
                            All content, trademarks, and materials on VirtiLearn are the
                            property of VirtiLearn or its licensors. You may not copy,
                            reproduce, or distribute any content without prior written
                            permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            6. Payments and Subscriptions
                        </h2>
                        <p>
                            If you purchase a paid course, internship, or subscription, you
                            agree to provide accurate billing details. Payments are processed
                            securely through our partners, and refunds are subject to our
                            Refund Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            7. Termination
                        </h2>
                        <p>
                            We may suspend or terminate your access to VirtiLearn at any time,
                            with or without notice, if you violate these Terms of Use or for
                            any other reason deemed necessary.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            8. Limitation of Liability
                        </h2>
                        <p>
                            VirtiLearn is provided &quot;as is&quot; and we make no guarantees
                            about the availability or accuracy of our services. To the maximum
                            extent permitted by law, VirtiLearn is not liable for any damages
                            arising from your use of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            9. Changes to Terms
                        </h2>
                        <p>
                            We may update these Terms of Use from time to time. Continued use
                            of VirtiLearn after updates means you accept the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            10. Governing Law
                        </h2>
                        <p>
                            These Terms are governed by the laws of India, without regard to
                            conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            11. Contact Us
                        </h2>
                        <p>
                            For questions about these Terms of Use, reach out to us at{" "}
                            <a
                                href="mailto:support@virtilearn.in"
                                className="text-pink-600 dark:text-pink-400 underline"
                            >
                                support@virtilearn.in
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
