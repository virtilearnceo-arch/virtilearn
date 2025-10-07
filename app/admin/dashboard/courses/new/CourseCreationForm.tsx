/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseInfoForm } from "@/components/courses/create/CourseInfoForm";
import { CourseBenefitsForm } from "@/components/courses/create/CourseBenefitsForm";
import { CourseContentForm } from "@/components/courses/create/CourseContentForm";
import { CourseInstructorsForm } from "@/components/courses/create/CourseInstructorsForm";
import { CourseResourcesForm } from "@/components/courses/create/CourseResourceForm";
import { CourseSubmitPreview } from "@/components/courses/create/CourseSubmitPreview";

export function CreateCoursePage() {
    const [step, setStep] = useState(0);
    const tabSteps = ["info", "benefits", "content", "resources", "instructors", "submit"];

    const nextStep = () => setStep((prev) => Math.min(prev + 1, tabSteps.length - 1));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    const [courseInfo, setCourseInfo] = useState<any>(null);
    const [courseBenefits, setCourseBenefits] = useState<any>(null);
    const [courseContent, setCourseContent] = useState<any>(null);
    const [courseResources, setCourseResources] = useState<any>({}); // was null
    const [courseInstructors, setCourseInstructors] = useState<any>([]);



    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Create Course</h1>

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
                        onNext={nextStep}
                        onChange={(data: any) => setCourseInfo(data)}
                        defaultValues={courseInfo}
                    />
                </TabsContent>

                <TabsContent value="benefits">
                    <CourseBenefitsForm
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseBenefits(data)}
                        // defaultValues={courseBenefits}
                        defaultValues={{
                            benefits: courseBenefits?.benefits ?? [],
                            prerequisites: courseBenefits?.prerequisites ?? [],
                            features: courseBenefits?.features ?? [], // 👈 ensure features are passed
                        }}
                    />
                </TabsContent>

                <TabsContent value="content">
                    <CourseContentForm
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseContent(data)}
                        defaultValues={courseContent}
                    />
                </TabsContent>

                <TabsContent value="resources">
                    <CourseResourcesForm
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={(data: any) => setCourseResources(data)}
                        defaultValues={courseResources}
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
                        onBack={prevStep}
                        courseInfo={courseInfo}
                        benefits={courseBenefits}
                        content={courseContent}
                        resources={courseResources}
                        instructors={courseInstructors}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
