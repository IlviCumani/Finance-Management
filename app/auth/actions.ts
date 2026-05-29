"use server"

import { createActionClient } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const supabase = await createActionClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect("/dashboard")
}

export async function register(formData: FormData) {
  const supabase = await createActionClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  // const fullName = formData.get("fullName") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect("/dashboard")
}

export async function logout() {
  const supabase = await createActionClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
