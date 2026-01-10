'use server'

import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from "next/cache"; // Import this

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  // PURGE CACHE: This forces the Header to see the new cookie session
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const fullName = email.split("@")[0];

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  if (data?.session) {
    // PURGE CACHE: Only if the user is logged in immediately
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return { success: "Check your email.", requiresConfirmation: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // PURGE CACHE: Force layout to revert to "logged out" state
  revalidatePath("/", "layout");
  redirect("/login");
}