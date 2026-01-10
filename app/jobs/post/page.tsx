import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import PostJobForm from "@/components/PostJobForm";

export default async function PostJobPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log('PostJobPage - User:', user?.email);
  console.log('PostJobPage - User Role:', user?.user_metadata?.role);

  if (!user) {
    console.log('PostJobPage - No user, redirecting to /login');
    redirect("/login");
  }

  // Fetch role to ensure only employers can post
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  console.log('PostJobPage - Profile Role:', profile?.role);

  if (profile?.role !== 'employer') {
    console.log('PostJobPage - Not an employer, redirecting to /dashboard');
    redirect("/dashboard");
  }

  console.log('PostJobPage - Rendering form');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PostJobForm />
    </div>
  );
}