import { createClient } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import ApplyJobClient from "@/components/ApplyJobClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplyJobPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Check if user is job-seeker
  const userRole = user.user_metadata?.role;
  if (userRole !== 'job-seeker') {
    redirect(`/jobs/${id}`);
  }

  // Fetch job details
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Check if already applied
  const { data: existingApplication } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', id)
    .eq('user_id', user.id)
    .single();

  if (existingApplication) {
    redirect(`/jobs/${id}`);
  }

  return <ApplyJobClient job={job} user={user} />;
}