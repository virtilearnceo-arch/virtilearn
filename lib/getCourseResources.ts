import { createClient } from "@/lib/supabase/client";

export async function getCourseResources(courseId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("course_resources")
    .select("*")
    .eq("course_id", courseId);

  if (error) throw error;
  return data;
}
