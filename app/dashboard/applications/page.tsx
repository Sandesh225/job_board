import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import MyApplicationsClient from "@/components/MyApplicationsClient";

export default async function MyApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userRole = user.user_metadata?.role;
  if (userRole !== 'job-seeker') {
    redirect("/dashboard");
  }

  // Fetch user's applications with job details
  const { data: applications } = await supabase
    .from('applications')
    .select('*, jobs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <MyApplicationsClient applications={applications || []} />;
}