import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import JobDetailClient from "@/components/JobDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Get current user to check if they've applied
  const { data: { user } } = await supabase.auth.getUser();

  let hasApplied = false;
  if (user) {
    const { data: application } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', job.id)
      .eq('user_id', user.id)
      .single();
    
    hasApplied = !!application;
  }

  return (
    <JobDetailClient 
      job={job} 
      user={user} 
      hasApplied={hasApplied}
    />
  );
}