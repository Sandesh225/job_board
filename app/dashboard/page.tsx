import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import EmployerDashboard from "@/components/dashboard/EmployerDashboard";
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the role from your profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return (
    <main className="container mx-auto py-10">
      {profile?.role === 'employer' ? (
        <EmployerDashboard user={user} />
      ) : (
        <CandidateDashboard user={user} />
      )}
    </main>
  );
}