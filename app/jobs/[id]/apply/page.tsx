import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import ApplyJobClient from "@/components/ApplyJobClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplyJobPage({ params }: PageProps) {
  // 1. Await the params (Next.js 15 requirement)
  const { id } = await params;
  const supabase = await createClient();

  // 2. Check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("Redirecting: No user found");
    redirect("/login");
  }

  // 3. Check Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "job-seeker") {
    console.log(`Redirecting: User role is ${profile?.role}, not job-seeker`);
    redirect(`/jobs/${id}`);
  }

  // 4. Fetch Job
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (jobError || !job) {
    console.log("Error: Job not found");
    notFound();
  }

  // 5. Prevent Duplicate Applications
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingApplication) {
    console.log("Redirecting: Application already exists");
    redirect(`/jobs/${id}`);
  }

  // 6. If all checks pass, render the client form
  return <ApplyJobClient job={job} user={user} />;
}