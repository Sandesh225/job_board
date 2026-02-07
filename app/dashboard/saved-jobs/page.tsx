import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import SavedJobsClient from "@/components/SavedJobsClient";

export const metadata = {
  title: "Saved Jobs - Dashboard",
  description: "View and manage your saved job opportunities.",
};

export default async function SavedJobsPage() {
  const supabase = await createClient();

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Role Check (Only Job Seekers should have saved jobs)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "job-seeker") {
    // Redirect employers to their dashboard
    redirect("/dashboard/my-jobs");
  }

  // 3. Fetch Saved Jobs
  // We perform an inner join on the 'jobs' table to get the actual job details
  const { data: savedJobs, error } = await supabase
    .from("saved_jobs")
    .select(`
      id,
      created_at,
      job:jobs (
        id,
        title,
        company,
        location,
        salary,
        job_type,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved jobs:", error);
    // You might want to render an error component here
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load saved jobs. Please try again later.
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Saved Jobs
        </h1>
        <p className="text-muted-foreground mt-2">
          Keep track of the opportunities you are interested in.
        </p>
      </div>

      {/* We cast the data to 'any' here briefly because Supabase Types 
        joins can be complex to type strictly without generated types. 
        The Client component enforces the shape.
      */}
      <SavedJobsClient initialSavedJobs={savedJobs as any} />
    </div>
  );
}