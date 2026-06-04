import { CookieOptions, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createActionClient() {
  const cookiesStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookiesStore
            .getAll()
            .map(({ name, value }) => ({ name, value }))
        },
        setAll(
          cookies: Array<{
            name: string
            value: string
            options?: CookieOptions
          }>
        ) {
          cookies.forEach(({ name, value, options }) =>
            cookiesStore.set(name, value, options)
          )
        },
      },
    }
  )
}
