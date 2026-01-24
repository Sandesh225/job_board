"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

/**
 * LOGIN ACTION
 * Returns success flag instead of redirecting
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");

  // Return success instead of redirecting
  return { success: true };
}

/**
 * SIGNUP ACTION
 */
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
      data: {
        role,
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  // If email confirmation is OFF, session exists immediately
  if (data?.session) {
    revalidatePath("/", "layout");
    return { success: true };
  }

  // Email confirmation ON → show success message
  return {
    success: "Check your email to confirm your account.",
    requiresConfirmation: true,
  };
}
