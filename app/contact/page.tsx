"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) throw new Error("Failed to submit form");

            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-16 px-6">
            <div className="shadow-input mx-auto w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-black">
                <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                    📬 Get in Touch
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    Have questions? Fill the form and our team will contact you.
                    <br />
                    Or email us directly at{" "}
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        virtilearn@gmail.com
                    </span>
                </p>

                {success && (
                    <div className="mt-4 rounded-md bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ✅ Message sent successfully! Our team will reach out soon.
                    </div>
                )}

                <form className="my-8 space-y-4" onSubmit={handleSubmit}>
                    <LabelInputContainer>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" type="text" required />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" placeholder="john@example.com" type="email" required />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="message">Message</Label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Write your message here..."
                            required
                            className="w-full rounded-md border border-neutral-300 bg-white p-3 text-neutral-800 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                            rows={4}
                        />
                    </LabelInputContainer>

                    <button
                        className="group/btn relative block h-11 w-full rounded-md bg-gradient-to-br from-pink-600 to-rose-700 font-medium text-white shadow-md transition hover:from-pink-700 hover:to-rose-800"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Message →"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};
