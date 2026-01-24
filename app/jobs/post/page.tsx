import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import PostJobForm from "@/components/PostJobForm";

/**
 * Server Component - Protected Route
 * Only employers can access
 */
export default async function PostJobPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Only employers allowed
  if (profile?.role !== "employer") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <PostJobForm />
    </div>
  );
}