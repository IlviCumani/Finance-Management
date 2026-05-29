import { CookieOptions, createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

const GUEST_PATH_PREFIXES = ["/auth/login", "/auth/register"] as const

function isGuestOnlyPath(pathname: string): boolean {
  if (pathname === "/") return true
  return GUEST_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard")
}

function withSessionCookies(
  from: NextResponse,
  to: NextResponse
): NextResponse {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie.name, cookie.value)
  }
  return to
}

export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies
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
          cookies.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.search = ""
    return withSessionCookies(response, NextResponse.redirect(url))
  }

  if (user && isGuestOnlyPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return withSessionCookies(response, NextResponse.redirect(url))
  }

  return response
}
