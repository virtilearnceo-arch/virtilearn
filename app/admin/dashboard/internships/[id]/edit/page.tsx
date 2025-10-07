/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InternshipCreationForm } from "@/app/admin/dashboard/internships/new/InternshipCreationForm"; // reuse your creation form
import { toast } from "sonner";

export default function EditInternshipPage() {
    const { id } = useParams<{ id: string; }>();
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [internshipData, setInternshipData] = useState<any>(null);

    // ✅ Fetch internship to edit from multiple tables
    useEffect(() => {
        const fetchInternship = async () => {
            // Fetch the internship details from the "internships" table
            const { data: internship, error: internshipError } = await supabase
                .from("internships")
                .select("*")
                .eq("id", id)
                .single();

            if (internshipError) {
                toast.error("Error loading internship");
                setLoading(false);
                return;
            }

            // Fetch related data for internship prerequisites, instructors, features, and benefits
            const { data: prerequisites } = await supabase
                .from("internship_prerequisites")
                .select("*")
                .eq("internship_id", id);

            const { data: instructors } = await supabase
                .from("internship_instructors")
                .select("*")
                .eq("internship_id", id);

            const { data: features } = await supabase
                .from("internship_features")
                .select("*")
                .eq("internship_id", id);

            const { data: benefits } = await supabase
                .from("internship_benefits")
                .select("*")
                .eq("internship_id", id);

            // Combine all the data
            const fullInternshipData = {
                ...internship,
                prerequisites,
                instructors,
                features,
                benefits,
            };

            setInternshipData(fullInternshipData);
            setLoading(false);
        };

        if (id) fetchInternship();
    }, [id, supabase]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Internship</h1>
            {internshipData ? (
                // Pass the fetched data to the form
                <InternshipCreationForm defaultData={internshipData} isEdit />
            ) : (
                <p>Internship not found</p>
            )}
        </div>
    );
}
