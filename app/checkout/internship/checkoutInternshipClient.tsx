/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutInternshipClient({
    internshipId,
    userId,
}: {
    internshipId: string;
    userId: string | null;
}) {
    const [razorpayLoaded, setRazorpayLoaded] = React.useState(false);
    const [internship, setInternship] = React.useState<any>(null);
    const [success, setSuccess] = React.useState(false);
    const [countdown, setCountdown] = React.useState(10);
    const searchParams = useSearchParams();

    const rawDiscountedPrice = searchParams.get("price");
    const discountedPrice =
        rawDiscountedPrice && !isNaN(Number(rawDiscountedPrice))
            ? Number(rawDiscountedPrice)
            : null;

    const rawCouponId = searchParams.get("couponId");
    const couponId =
        rawCouponId && rawCouponId !== "undefined" ? rawCouponId : null;

    React.useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
    }, []);

    React.useEffect(() => {
        (async () => {
            const res = await fetch(`/api/internships/${internshipId}`);
            const data = await res.json();
            setInternship(data);
        })();
    }, [internshipId]);

    React.useEffect(() => {
        if (success) {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        window.location.href = `/internships/${internshipId}/learn`;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [success, internshipId]);

    const handlePayment = async () => {
        if (!razorpayLoaded || !internship || !userId) return;

        try {
            const finalAmount = discountedPrice ?? internship.price;

            // Create order on backend
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: finalAmount, // in INR
                    currency: "INR",
                    receipt: `intern_${internship.id.slice(0, 8)}_${userId.slice(0, 6)}_${Date.now()}`,
                }),
            });


            const order = await orderRes.json();
            if (!order?.id) {
                console.error("Order creation failed:", order);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount, // paise (already handled by backend)
                currency: order.currency,
                name: "VirtiLearn",
                description: internship.title,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await fetch("/api/razorpay/verify-internship", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                user_id: userId,
                                internship_id: internship.id,
                                amount: finalAmount,
                                coupon_id: couponId || null,
                            }),
                        });
                        setSuccess(true);
                    } catch (err) {
                        console.error("Verification failed:", err);
                    }
                },
                theme: { color: "#a855f7" },
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 opacity-90" />

            <div className="relative w-full max-w-lg p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-100 text-center">
                {!success ? (
                    <>
                        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-transparent bg-clip-text">
                            Internship Checkout
                        </h1>

                        {internship ? (
                            <>
                                <p className="text-lg text-gray-700 mb-4">
                                    You’re enrolling in{" "}
                                    <span className="font-semibold">{internship.title}</span>
                                </p>

                                <div className="mb-8">
                                    {discountedPrice && (
                                        <p className="text-gray-400 line-through mb-1">
                                            ₹{internship.price}
                                        </p>
                                    )}
                                    <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-transparent bg-clip-text">
                                        ₹{discountedPrice ? discountedPrice : internship.price}
                                    </p>
                                    {discountedPrice && (
                                        <span className="mt-2 inline-block text-sm text-green-600 font-medium">
                                            Coupon applied 🎉
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 mb-6">
                                Loading internship details...
                            </p>
                        )}

                        <p className="mb-4 text-sm text-gray-600 italic">
                            ⚡ Please don’t refresh during payment. You’ll be redirected
                            automatically after success.
                        </p>

                        <button
                            disabled={!razorpayLoaded || !internship}
                            onClick={handlePayment}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50"
                        >
                            {razorpayLoaded ? "Pay & Enroll" : "Loading Payment..."}
                        </button>

                        <p className="mt-6 text-sm text-gray-500">
                            🔒 Secure payment powered by Razorpay
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-transparent bg-clip-text animate-pulse">
                            🎉 Payment Successful!
                        </h1>
                        <p className="text-lg text-gray-700 mb-4">
                            You’re now enrolled in{" "}
                            <span className="font-semibold">{internship?.title}</span>
                        </p>
                        <p className="text-md text-gray-600">
                            ⏳ Do not refresh. You’ll be redirected to your internship page in{" "}
                            <span className="font-bold text-purple-600">{countdown}</span>{" "}
                            seconds.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}