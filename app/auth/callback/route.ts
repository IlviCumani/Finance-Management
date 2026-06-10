import { createActionClient } from "@/lib/supabase/actions"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createActionClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${next}`)
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login`)
}
