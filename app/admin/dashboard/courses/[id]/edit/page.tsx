/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseInfoForm } from "@/components/courses/create/CourseInfoForm";
import { CourseBenefitsForm } from "@/components/courses/create/CourseBenefitsForm";
import { CourseContentForm } from "@/components/courses/create/CourseContentForm";
import { CourseInstructorsForm } from "@/components/courses/create/CourseInstructorsForm"; // ✅ import
import { CourseSubmitPreview } from "@/components/courses/create/CourseSubmitPreview";
import { CourseResourcesForm } from "@/components/courses/create/CourseResourceForm";


export default function EditCoursePage() {
    const { id } = useParams() as { id: string; };
    const supabase = createClient();

    const [step, setStep] = useState(0);
    const tabSteps = ["info", "benefits", "content", "resources", "instructors", "submit"];

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);

    const [courseInfo, setCourseInfo] = useState<any>(null);
    const [courseBenefits, setCourseBenefits] = useState<any>(null);
    const [courseContent, setCourseContent] = useState<any>(null);
    const [courseInstructors, setCourseInstructors] = useState<any>([]);
    const [courseResources, setCourseResources] = useState<any>(null);


    const nextStep = () => setStep((prev) => Math.min(prev + 1, tabSteps.length - 1));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    useEffect(() => {
        if (id) fetchFullCourse();
    }, [id]);

    const fetchFullCourse = async () => {
        setLoading(true);

        const { data: course } = await supabase
            .from("courses")
            .select("*")
            .eq("id", id)
            .single();

        const { data: benefits } = await supabase
            .from("course_benefits")
            .select("*")
            .eq("course_id", id);

        const { data: prerequisites } = await supabase
            .from("course_prerequisites")
            .select("*")
            .eq("course_id", id);

        const { data: content } = await supabase
            .from("course_data")
            .select("*, course_data_links(*)")
            .eq("course_id", id);

        const { data: instructors } = await supabase
            .from("course_instructors") // ✅ join table
            .select("instructor_id, instructors(id, name)")
            .eq("course_id", id);

        // ✅ fetch previous resource URLs
        const { data: resources } = await supabase
            .from("course_resources")
            .select("type, file_url")
            .eq("course_id", id);

        let ebookUrl = null;
        let projectZipUrl = null;

        resources?.forEach((res: any) => {
            if (res.type === "ebook") ebookUrl = res.file_url;
            if (res.type === "project") projectZipUrl = res.file_url;
        });


        setInitialData({
            course,
            benefits,
            prerequisites,
            content,
            instructors,
            resources
        });

        setCourseInfo(course);
        setCourseBenefits({ benefits, prerequisites });
        setCourseContent(content);
        setCourseInstructors(instructors?.map((ci) => ci.instructors) || []);
        setCourseResources({ ebookUrl, projectZipUrl });
        setLoading(false);
    };

    if (loading) {
        return <div className="p-6">Loading course data...</div>;
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Edit Course</h1>

            <Tabs value={tabSteps[step]} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                    <TabsTrigger value="info">Course Info</TabsTrigger>
                    <TabsTrigger value="benefits" disabled={step < 1}>Benefits</TabsTrigger>
                    <TabsTrigger value="content" disabled={step < 2}>Content</TabsTrigger>
                    <TabsTrigger value="resources" disabled={step < 3}>Resources</TabsTrigger>
                    <TabsTrigger value="instructors" disabled={step < 4}>Instructors</TabsTrigger>
                    <TabsTrigger value="submit" disabled={step < 5}>Submit</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <CourseInfoForm
                        mode="edit"
                        courseId={id}
                        onNext={nextStep}
                        onChange={(data: any) => setCourseInfo(data)}
                        defaultValues={courseInfo}
                    />
                </TabsContent>

                <TabsContent value="benefits">
                    <CourseBenefitsForm
                        mode="edit"
                        courseId={id}
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseBenefits(data)}
                        defaultValues={courseBenefits}
                    />
                </TabsContent>

                <TabsContent value="content">
                    <CourseContentForm
                        mode="edit"
                        courseId={id}
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseContent(data)}
                        defaultValues={courseContent}
                    />
                </TabsContent>

                <TabsContent value="resources">
                    <CourseResourcesForm
                        defaultValues={courseResources}
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseResources(data)}
                    />
                </TabsContent>



                <TabsContent value="instructors">
                    <CourseInstructorsForm
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseInstructors(data)}
                        defaultValues={courseInstructors}
                    />
                </TabsContent>

                <TabsContent value="submit">
                    <CourseSubmitPreview
                        mode="edit"
                        courseId={id}
                        onBack={prevStep}
                        courseInfo={courseInfo}
                        benefits={courseBenefits}
                        content={courseContent}
                        instructors={courseInstructors}
                        resources={courseResources}   // ✅ FIXED
                    />


                </TabsContent>
            </Tabs>
        </div>
    );
}
