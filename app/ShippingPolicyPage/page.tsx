"use client";

import React from "react";

export default function ShippingPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-extrabold mb-6 text-purple-700">
                📦 Digital Delivery & Shipping Policy
            </h1>

            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                At VirtiLearn, we provide **digital courses, internships, and certificates**.
                All content is delivered online, so you won’t receive physical shipments.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">1. Course Materials</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Once you enroll in a course, all materials including videos, PDFs, and assignments
                are instantly available in your account. You can access them anytime, anywhere.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">2. Internship Resources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Internship resources, project briefs, and guidance documents are delivered digitally.
                You will receive access links via your VirtiLearn account or registered email.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">3. Certificates</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                After completing a course or internship, your certificate is generated digitally.
                You can download it immediately from your account. No physical shipping is involved.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">4. Delivery Time</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                All digital content is delivered instantly after purchase or upon completion of
                the course/internship requirements. For certificates, please allow a few minutes
                for processing.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">5. Support</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                If you face any issues accessing your courses, internship resources, or certificates,
                please contact our support team at <a href="mailto:virtilearn@gmail.com" className="text-purple-600 underline">virtilearn@gmail.com</a>.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 mt-8">
                VirtiLearn is committed to providing fast and reliable **digital delivery** for all
                educational content. Thank you for learning with us!
            </p>
        </div>
    );
}
