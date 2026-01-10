

// ============================================================================
// FILE 2: app/jobs/[id]/applicants/page.tsx
// Server Component Page for Job Applicants
// ============================================================================
import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import JobApplicantsClient from "@/components/JobApplicantsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch job and verify ownership
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Verify user owns this job
  if (job.user_id !== user.id) {
    redirect("/dashboard");
  }

  return <JobApplicantsClient jobId={id} jobTitle={job.title} />;
}
