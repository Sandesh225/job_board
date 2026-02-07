import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import ApplyJobClient from "@/components/ApplyJobClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Job application page
 * Only job-seekers allowed
 */
export default async function ApplyJobPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Enforce job-seeker role
  if (profile?.role !== "job-seeker") {
    redirect(`/jobs/${id}`);
  }

  // Fetch job data
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Prevent duplicate applications
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingApplication) {
    redirect(`/jobs/${id}`);
  }

  return <ApplyJobClient job={job} user={user} />;
}