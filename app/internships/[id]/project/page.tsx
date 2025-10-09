"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Github, UploadCloud, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import PastSubmissions from "./PastAttempts";

export default function InternshipProjectPage() {
    const supabase = createClient();
    const { id } = useParams(); // internship id
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [githubLink, setGithubLink] = useState("");
    const [pptFile, setPptFile] = useState<File | null>(null);
    const [finalExamPassed, setFinalExamPassed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1️⃣ Get current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    toast.error("You must be logged in");
                    setLoading(false);
                    return;
                }

                // 2️⃣ Get user's internship record
                const { data: userInternship } = await supabase
                    .from("user_internships")
                    .select("id")
                    .eq("internship_id", id)
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (!userInternship) {
                    toast.error("You are not enrolled in this internship");
                    setLoading(false);
                    return;
                }

                const userInternshipId = userInternship.id;

                // 3️⃣ Fetch project
                const { data: projectData } = await supabase
                    .from("internship_projects")
                    .select("*")
                    .eq("internship_id", id)
                    .single();

                setProject(projectData);

                // 4️⃣ Fetch submissions only for this user
                const { data: submissionData } = await supabase
                    .from("internship_project_submissions")
                    .select("*")
                    .eq("project_id", projectData.id)
                    .eq("user_internship_id", userInternshipId)
                    .order("submitted_at", { ascending: false });

                setSubmissions(submissionData || []);

                // 5️⃣ Fetch final exam attempt only for this user
                const { data: examData } = await supabase
                    .from("internship_final_quiz_attempts")
                    .select("is_passed")
                    .eq("internship_id", id)
                    .eq("user_id", user.id)
                    .maybeSingle();

                setFinalExamPassed(!!examData?.is_passed);

            } catch (error) {
                console.error(error);
                toast.error("Failed to load project data");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, supabase]);

    const handleSubmit = async () => {
        if (!githubLink) {
            toast.error("GitHub link is required");
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return toast.error("Login required");

            const { data: userInternship } = await supabase
                .from("user_internships")
                .select("id")
                .eq("internship_id", id)
                .eq("user_id", user.id)
                .maybeSingle();

            if (!userInternship) return toast.error("Not enrolled");

            const userInternshipId = userInternship.id;

            // Upload PPT if provided
            let pptUrl: string | null = null;
            if (pptFile) {
                const filePath = `projects/${id}/${userInternshipId}/${Date.now()}-${pptFile.name}`;
                const { error: uploadError } = await supabase.storage
                    .from("internship-files")
                    .upload(filePath, pptFile);
                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from("internship-files")
                    .getPublicUrl(filePath);
                pptUrl = urlData.publicUrl;
            }

            // Check latest submission
            const latest = submissions[0];
            if (latest?.status === "submitted") {
                toast.error("Your last submission is still under review");
                setLoading(false);
                return;
            }

            if (latest && (latest.status === "resubmit_required" || latest.status === "rejected")) {
                await supabase
                    .from("internship_project_submissions")
                    .update({
                        github_link: githubLink,
                        ppt_url: pptUrl,
                        attempt_number: latest.attempt_number + 1,
                        submitted_at: new Date().toISOString(),
                        status: "submitted"
                    })
                    .eq("id", latest.id);

                toast.success("Resubmission uploaded successfully 🎉");
            } else {
                await supabase
                    .from("internship_project_submissions")
                    .insert({
                        project_id: project.id,
                        user_internship_id: userInternshipId,
                        github_link: githubLink,
                        ppt_url: pptUrl,
                        attempt_number: 1,
                        status: "submitted"
                    });

                toast.success("Submission uploaded successfully 🎉");
            }

            // Refresh submissions
            const { data: submissionData } = await supabase
                .from("internship_project_submissions")
                .select("*")
                .eq("project_id", project.id)
                .eq("user_internship_id", userInternshipId)
                .order("submitted_at", { ascending: false });

            setSubmissions(submissionData || []);

        } catch (error) {
            console.error(error);
            toast.error("Submission failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-purple-500" />
        </div>
    );

    if (!project) return (
        <div className="flex h-[60vh] items-center justify-center text-lg font-semibold">
            ❌ No project assigned yet.
        </div>
    );

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10 mt-16">
            {/* Project Details */}
            <Card className="shadow-2xl rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-neutral-900 dark:to-neutral-950">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                        {project.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                        {project.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 flex-wrap">
                        <Badge variant="outline">Difficulty: {project.difficulty}</Badge>
                        {project.deadline && (
                            <Badge variant="destructive">
                                Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </Badge>
                        )}
                        <Badge>Max Grade: {project.max_grade}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Button
                variant="outline"
                className="w-fit flex items-center gap-2"
                onClick={() => router.push(`/internships/${id}/learn`)}
            >
                Back to Learning
            </Button>

            {/* Final Exam Requirement */}
            <Card className="rounded-xl border-l-4 shadow-md p-4
                border-red-500 dark:border-red-400 bg-red-50 dark:bg-neutral-900">
                {!finalExamPassed ? (
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <Lock className="h-6 w-6" />
                        <p className="font-medium">
                            🚫 You must pass the Final Exam before submitting the project.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                        <ShieldCheck className="h-6 w-6" />
                        <p className="font-medium">
                            ✅ You’ve passed the Final Exam! You can now submit your project.
                        </p>
                    </div>
                )}
            </Card>

            {/* Submission Form */}
            <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Submit Your Work 🚀</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">GitHub Repository Link *</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://github.com/username/repo"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                disabled={!finalExamPassed}
                            />
                            <Button variant="outline" size="icon" disabled>
                                <Github className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Upload PPT (optional)</label>
                        <Input
                            type="file"
                            accept=".ppt,.pptx,.pdf"
                            onChange={(e) => setPptFile(e.target.files?.[0] || null)}
                            disabled={!finalExamPassed}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={
                            !finalExamPassed ||
                            submissions[0]?.status === "submitted" ||
                            submissions[0]?.status === "approved"
                        }
                    >
                        {submissions[0]?.status === "submitted" || submissions[0]?.status === "approved"
                            ? "Waiting/Approved"
                            : "Submit Project"}
                    </Button>
                </CardContent>
            </Card>

            {/* Past Submissions */}
            <PastSubmissions submissions={submissions} project={project} />
        </div>
    );
}
