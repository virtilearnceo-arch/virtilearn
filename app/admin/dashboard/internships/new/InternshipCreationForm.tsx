/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import InternshipInfoForm from "../../../../../components/internship/create/InternshipInfoForm";
import { InternshipBenefitsForm } from "../../../../../components/internship/create/InternshipBenefitForm";
import { InternshipPrerequisitesForm } from "@/components/internship/create/InternshipPrerequisitesForm";
import { InternshipFeaturesForm } from "@/components/internship/create/InternshipFeaturesForm";
import { InternshipInstructorsForm } from "@/components/internship/create/InternshipInstructorsForm";
import { InternshipSubmitPreview } from "@/components/internship/create/InternshipSubmitPreview";

type InternshipCreationFormProps = {
    defaultData?: any;   // for edit mode
    isEdit?: boolean;    // flag to check if editing
};

export function InternshipCreationForm({
    defaultData,
    isEdit = false,
}: InternshipCreationFormProps) {
    const [step, setStep] = useState(0);
    const tabSteps = ["info", "benefits", "prerequisites", "features", "instructors", "submit"];

    const nextStep = () => {
        if (step < tabSteps.length - 1) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    // ✅ populate state from defaultData if editing
    const [internshipInfo, setInternshipInfo] = useState<any>(null);
    const [internshipBenefits, setInternshipBenefits] = useState<any>([]);
    const [internshipPrerequisites, setInternshipPrerequisites] = useState<any>([]);
    const [internshipFeatures, setInternshipFeatures] = useState<any>([]);
    const [internshipInstructors, setInternshipInstructors] = useState<any>([]);

    useEffect(() => {
        if (defaultData) {
            // console.log("Default Data", defaultData); // Log for debugging

            setInternshipInfo(defaultData); // Ensure info is populated correctly
            setInternshipBenefits(defaultData?.benefits ?? []);
            setInternshipPrerequisites(defaultData?.prerequisites ?? []);
            setInternshipFeatures(defaultData?.features ?? []);
            setInternshipInstructors(defaultData?.instructors ?? []);
        }
    }, [defaultData]);
    // console.log("internshipInfo", defaultData.id); // Debugging to check if 'id' is present

    const internshipid = defaultData?.id ?? null; // null if new internship

    return (
        <Tabs value={tabSteps[step]} className="w-full">
            <div className="w-full overflow-x-auto">
                <TabsList className="flex min-w-max space-x-16 mb-6">
                    <TabsTrigger value="info" disabled={step < 0}>Info</TabsTrigger>
                    <TabsTrigger value="benefits" disabled={step < 1}>Benefits</TabsTrigger>
                    <TabsTrigger value="prerequisites" disabled={step < 2}>Prerequisites</TabsTrigger>
                    <TabsTrigger value="features" disabled={step < 3}>Features</TabsTrigger>
                    <TabsTrigger value="instructors" disabled={step < 4}>Instructors</TabsTrigger>
                    <TabsTrigger value="submit" disabled={step < 5}>Submit</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="info">
                <InternshipInfoForm
                    onNext={nextStep}
                    onChange={(data: any) => setInternshipInfo(data)}
                    defaultValues={internshipInfo}
                />
            </TabsContent>

            <TabsContent value="benefits">
                <InternshipBenefitsForm
                    onNext={nextStep}
                    onBack={prevStep}
                    onChange={(data: any) => setInternshipBenefits(data)}
                    defaultValues={internshipBenefits}
                />
            </TabsContent>

            <TabsContent value="prerequisites">
                <InternshipPrerequisitesForm
                    onNext={nextStep}
                    onBack={prevStep}
                    onChange={(data: any) => setInternshipPrerequisites(data)}
                    defaultValues={internshipPrerequisites}
                />
            </TabsContent>

            <TabsContent value="features">
                <InternshipFeaturesForm
                    onNext={nextStep}
                    onBack={prevStep}
                    onChange={(data: any) => setInternshipFeatures(data)}
                    defaultValues={internshipFeatures}
                />
            </TabsContent>

            <TabsContent value="instructors">
                <InternshipInstructorsForm
                    onNext={nextStep}
                    onBack={prevStep}
                    onChange={(data: any) => setInternshipInstructors(data)}
                    defaultValues={internshipInstructors}
                />
            </TabsContent>

            <TabsContent value="submit">
                <InternshipSubmitPreview
                    onBack={prevStep}
                    internshipInfo={internshipInfo}
                    benefits={internshipBenefits}
                    prerequisites={internshipPrerequisites}
                    features={internshipFeatures}
                    instructors={internshipInstructors}
                    isEdit={isEdit}
                    internshipid={internshipid}
                />
            </TabsContent>
        </Tabs>
    );
}
