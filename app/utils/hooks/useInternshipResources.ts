"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface InternshipResource {
  id: string;
  internship_id: string;
  type: "ebook" | "project";
  file_url: string;
  created_at: string;
}

export function useInternshipResources(internshipId: string | null) {
  const [resources, setResources] = useState<InternshipResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!internshipId) return;

    const supabase = createClient();

    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("internship_resources")
          .select("id, internship_id, type, file_url, created_at")
          .eq("internship_id", internshipId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching internship resources:", error.message);
          setError(error.message);
          return;
        }

        setResources(data || []);
      } catch (err: any) {
        console.error("Unexpected error fetching internship resources:", err);
        setError("Failed to fetch resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [internshipId]);

  return { resources, loading, error };
}
