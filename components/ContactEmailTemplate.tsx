import * as React from "react";

type ContactEmailTemplateProps = {
    type: "contact";
    name: string;
    email: string;
    message: string;
};

export function ContactEmailTemplate({ type, name, email, message }: ContactEmailTemplateProps) {
    const headerTitle = "New Contact Form Submission!";
    const headerEmoji = "📬";

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", padding: 0, margin: 0, backgroundColor: "#f3f4f6" }}>
            <table
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                style={{
                    minHeight: "100vh",
                    padding: "40px 0",
                    background: "linear-gradient(135deg,#dbeafe,#fce7f3)"
                }}
            >
                <tr>
                    <td align="center">
                        <table
                            width="600"
                            cellPadding={0}
                            cellSpacing={0}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 16,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                overflow: "hidden"
                            }}
                        >
                            {/* Header */}
                            <tr>
                                <td
                                    style={{
                                        padding: 40,
                                        textAlign: "center",
                                        background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)",
                                        color: "#fff"
                                    }}
                                >
                                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
                                        {headerEmoji} {headerTitle}
                                    </h1>
                                    <p style={{ marginTop: 8, fontSize: 15, opacity: 0.9 }}>
                                        You have received a new message from {name}.
                                    </p>
                                </td>
                            </tr>

                            {/* Body */}
                            <tr>
                                <td style={{ padding: 40 }}>
                                    <p style={{ fontSize: 16, lineHeight: 1.6 }}>Hello Admin,</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.6 }}>
                                        You have received a new contact form submission:
                                    </p>

                                    <ul style={{ fontSize: 16, lineHeight: 1.6, margin: "16px 0" }}>
                                        <li><b>Name:</b> {name}</li>
                                        <li><b>Email:</b> {email}</li>
                                        <li><b>Message:</b> {message}</li>
                                    </ul>

                                    <p style={{ fontSize: 16, lineHeight: 1.6 }}>
                                        Please respond to the user promptly.
                                    </p>

                                    <p style={{ textAlign: "center", marginTop: 32 }}>
                                        <a
                                            href={`mailto:${email}`}
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
                                            Reply to {name}
                                        </a>
                                    </p>
                                </td>
                            </tr>

                            {/* Footer */}
                            <tr>
                                <td
                                    style={{
                                        padding: 20,
                                        textAlign: "center",
                                        fontSize: 12,
                                        color: "#9ca3af",
                                        backgroundColor: "#f9fafb"
                                    }}
                                >
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
