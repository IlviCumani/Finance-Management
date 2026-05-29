import { createActionClient } from "../actions"

export async function getLoggedUserProfile() {
  const supabase = await createActionClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user?.id)
    .single()
  if (profileError) {
    throw profileError
  }
  return {
    loggedUserDetails: profileData,
    user: data.user,
  }
}
