"use server";

import { createClient } from "@/lib/server";
import { jobFormSchema, JobFormValues } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createJob(data: JobFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "employer") {
    return { error: "Only employers can post jobs." };
  }

  const validation = jobFormSchema.safeParse(data);
  if (!validation.success) return { error: "Invalid data" };

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    title: data.title,
    company: data.company,
    job_type: data.jobType,
    location: data.location,
    experience_level: data.experienceLevel,
    salary: data.salary || null,
    description: data.description,
    application_url: data.applicationUrl,
  });

  if (error) return { error: "Database failure" };

  revalidatePath("/jobs");
  return { success: true };
}
