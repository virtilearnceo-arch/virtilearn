import * as React from "react";

type OtpEmailTemplateProps = {
    otp: string;
    email: string;
};

export function OtpEmailTemplate({ otp, email }: OtpEmailTemplateProps) {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif", padding: 0, margin: 0, backgroundColor: "#f3f4f6" }}>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ minHeight: "100vh", padding: "40px 0", background: "linear-gradient(135deg,#dbeafe,#fce7f3)" }}>
                <tr>
                    <td align="center">
                        <table width="600" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                            <tr>
                                <td style={{ padding: 40, textAlign: "center", background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", color: "#fff" }}>
                                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>🔑 Your VirtiLearn OTP</h1>
                                    <p style={{ marginTop: 8, fontSize: 15, opacity: 0.9 }}>OTP sent to {email}, valid for 5 minutes.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: 40, textAlign: "center" }}>
                                    <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: "4px" }}>{otp}</p>
                                    <p style={{ fontSize: 16, marginTop: 16 }}>Enter this code in the app to complete login.</p>
                                </td>
                            </tr>
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
