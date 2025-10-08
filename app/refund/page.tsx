"use client";

import { motion } from "framer-motion";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-6 md:px-16 py-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-10"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-pink-500">
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Last updated: September 2025
                    </p>
                </div>

                {/* Sections */}
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                            1. General Policy
                        </h2>
                        <p>
                            At <strong>VirtiLearn</strong>, we strive to provide high-quality
                            learning experiences for engineers, creators, and innovators. This
                            Refund & Cancellation Policy explains when and how refunds may be
                            granted.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                            2. Course Purchases
                        </h2>
                        <p>
                            All course, workshop, and internship purchases are generally{" "}
                            <strong>non-refundable</strong>. However, exceptions may apply if:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You were charged incorrectly due to a technical issue.</li>
                            <li>The purchased content is unavailable or inaccessible.</li>
                            <li>You accidentally purchased multiple copies of the same course.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            3. Subscription Plans
                        </h2>
                        <p>
                            Subscriptions (monthly/annual) can be canceled anytime. Access
                            remains active until the end of the billing cycle, and{" "}
                            <strong>no partial refunds</strong> will be issued for unused
                            periods.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                            4. Cancellation Policy
                        </h2>
                        <p>
                            If you wish to cancel a paid program (like an internship or live
                            training), requests must be submitted{" "}
                            <strong>within 48 hours of purchase</strong>. After that,
                            cancellations are not guaranteed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                            5. Refund Processing
                        </h2>
                        <p>
                            Approved refunds will be processed within{" "}
                            <strong>7–14 business days</strong> to the original payment
                            method. Processing times may vary depending on your bank or
                            payment provider.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            6. Non-Refundable Items
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Completed courses or certifications.</li>
                            <li>One-time downloadable resources (e.g., templates, eBooks).</li>
                            <li>Promotional/discounted purchases unless otherwise stated.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                            7. Contact Us
                        </h2>
                        <p>
                            If you have any questions about our Refund & Cancellation Policy,
                            please contact us at{" "}
                            <a
                                href="mailto:virtilearn@gmail.com"
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
