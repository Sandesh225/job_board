import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import MyJobsClient from "@/components/MyJobsClient";

export default async function MyJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userRole = user.user_metadata?.role;
  if (userRole !== 'employer') {
    redirect("/dashboard");
  }

  // Fetch employer's jobs with application counts
  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      applications(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <MyJobsClient jobs={jobs || []} />;
}