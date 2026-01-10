'use server'

import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // metadata is vital for Middleware RBAC
      data: { role: role }, 
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  // Sync with public.profiles table for relational data
  if (data?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, role, email }])
    
    if (profileError) console.error("Profile Error:", profileError.message)
  }

  if (data?.session) {
    redirect('/dashboard')
  }

  return { success: "Please check your email to verify your account." }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}