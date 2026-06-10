"use server"

import { createActionClient } from "@/lib/supabase/actions"
import { getSiteUrl } from "@/lib/supabase/site-url"
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
  const fullName = formData.get("fullName") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
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

export async function signInWithGoogle() {
  const supabase = await createActionClient()
  const siteUrl = await getSiteUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error || !data.url) {
    return { error: error?.message ?? "OAuth initiation failed" }
  }

  redirect(data.url)
}
