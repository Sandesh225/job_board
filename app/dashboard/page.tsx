import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import EmployerDashboard from "@/components/dashboard/EmployerDashboard";
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  try {
    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError);
      redirect("/login");
    }

    // Fetch user profile with error handling
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile query error:", profileError);
      // If profile doesn't exist, create a default one
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "User",
        role: user.user_metadata?.role || "job-seeker",
      });

      if (insertError) {
        console.error("Failed to create profile:", insertError);
        redirect("/login");
      }
    }

    // Determine which dashboard to show
    const userRole = profile?.role || user.user_metadata?.role || "job-seeker";

    return (
      <main className="container mx-auto py-10">
        {userRole === "employer" ? (
          <EmployerDashboard user={user} />
        ) : (
          <CandidateDashboard user={user} />
        )}
      </main>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/login");
  }
}