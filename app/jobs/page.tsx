import { createClient } from "@/lib/server";
import JobsListingClient from "@/components/JobsListingClient";

export default async function JobsPage() {
  const supabase = await createClient();
  
  // Fetch all active jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return <JobsListingClient initialJobs={jobs || []} />;
}