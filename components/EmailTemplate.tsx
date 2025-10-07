import * as React from "react";

type EmailTemplateProps = {
    type: "course" | "internship";
    firstName: string;
    lastName: string;
    title: string; // course or internship title
    description?: string;
    duration: string;
    language: string;
    amount: number;
    orderId: string;
    paymentId: string;
    appUrl: string;
};

export function EmailTemplate({
    type,
    firstName,
    lastName,
    title,
    description,
    duration,
    language,
    amount,
    orderId,
    paymentId,
    appUrl,
}: EmailTemplateProps) {
    const headerTitle = type === "course" ? "You’re Enrolled in a Course!" : "You’re Enrolled in an Internship!";
    const headerEmoji = type === "course" ? "🚀" : "💼";

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", padding: 0, margin: 0, backgroundColor: "#f3f4f6" }}>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ minHeight: "100vh", padding: "40px 0", background: "linear-gradient(135deg,#dbeafe,#fce7f3)" }}>
                <tr>
                    <td align="center">
                        <table width="600" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden" }}>

                            {/* Header */}
                            <tr>
                                <td style={{ padding: 40, textAlign: "center", background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", color: "#fff" }}>
                                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{headerEmoji} {headerTitle}</h1>
                                    <p style={{ marginTop: 8, fontSize: 15, opacity: 0.9 }}>Hi {firstName}, your enrollment is confirmed!</p>
                                </td>
                            </tr>

                            {/* Body */}
                            <tr>
                                <td style={{ padding: 40 }}>
                                    <p style={{ fontSize: 16, lineHeight: 1.6 }}>Hello {firstName} {lastName},</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.6 }}>
                                        You have successfully enrolled in <strong>{title}</strong>. {description || "Get ready to start your learning journey!"}
                                    </p>

                                    <ul style={{ fontSize: 16, lineHeight: 1.6, margin: "16px 0" }}>
                                        <li><b>Duration:</b> {duration}</li>
                                        <li><b>Language:</b> {language}</li>
                                        <li><b>Amount Paid:</b> ₹{amount}</li>
                                    </ul>

                                    <h3 style={{ marginTop: 24 }}>💳 Payment Info</h3>
                                    <ul style={{ fontSize: 16, lineHeight: 1.6 }}>
                                        <li><b>Order ID:</b> {orderId}</li>
                                        <li><b>Payment ID:</b> {paymentId}</li>
                                        <li><b>Status:</b> ✅ Successful</li>
                                    </ul>

                                    <p style={{ textAlign: "center", marginTop: 32 }}>
                                        <a
                                            href={appUrl}
                                            style={{
                                                display: "inline-block",
                                                padding: "14px 32px",
                                                background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)",
                                                color: "#fff",
                                                borderRadius: 12,
                                                textDecoration: "none",
                                                fontWeight: "bold",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                                                transition: "all 0.3s"
                                            }}
                                        >
                                            {type === "course" ? "👉 Start Learning Now" : "👉 Access Internship"}
                                        </a>
                                    </p>
                                </td>
                            </tr>

                            {/* Footer */}
                            <tr>
                                <td style={{ padding: 20, textAlign: "center", fontSize: 12, color: "#9ca3af", backgroundColor: "#f9fafb" }}>
                                    &copy; 2025 VirtiLearn. All rights reserved.
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </div>
    );
}
