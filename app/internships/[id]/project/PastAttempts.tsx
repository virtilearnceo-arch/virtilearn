"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PastSubmissions({
    submissions,
    project,
}: {
    submissions: any[];
    project: any;
}) {
    if (submissions.length === 0) {
        return (
            <Card className="rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-lg bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Your Past Attempts 📂</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">No submissions yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-lg bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Your Past Attempts 📂</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-neutral-800 text-left">
                            <th className="p-3">Attempt</th>
                            <th className="p-3">GitHub</th>
                            <th className="p-3">PPT</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Grade</th>
                            <th className="p-3">Feedback</th>
                            <th className="p-3">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((s) => (
                            <tr key={s.id} className="border-b border-gray-200 dark:border-neutral-800">
                                <td className="p-3 font-semibold">{s.attempt_number}</td>
                                <td className="p-3">
                                    <a href={s.github_link} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline">
                                        Repo
                                    </a>
                                </td>
                                <td className="p-3">
                                    {s.ppt_url ? (
                                        <a href={s.ppt_url} target="_blank" className="text-purple-600 dark:text-purple-400 underline">
                                            Download
                                        </a>
                                    ) : "-"}
                                </td>
                                <td className="p-3">
                                    {s.status === "approved" && (
                                        <div className="flex flex-col gap-2">
                                            <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                                                <CheckCircle2 className="h-4 w-4" /> Approved
                                            </Badge>
                                            <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700"
                                                onClick={() =>
                                                    window.location.href = `/internships/${s.user_internship_id}/completed`
                                                }
                                            >
                                                🎉 Download Certificate
                                            </Button>
                                        </div>
                                    )}
                                    {s.status === "rejected" && <Badge className="bg-red-100 text-red-700"><XCircle className="h-4 w-4" /> Rejected</Badge>}
                                    {s.status === "resubmit_required" && <Badge className="bg-yellow-100 text-yellow-700"><AlertCircle className="h-4 w-4" /> Resubmit</Badge>}
                                    {s.status === "submitted" && <Badge className="bg-blue-100 text-blue-700"><Clock className="h-4 w-4" /> Pending</Badge>}
                                </td>
                                <td className="p-3">{s.grade ? `${s.grade}/${project.max_grade}` : "-"}</td>
                                <td className="p-3">{s.feedback || "-"}</td>
                                <td className="p-3">{new Date(s.submitted_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
