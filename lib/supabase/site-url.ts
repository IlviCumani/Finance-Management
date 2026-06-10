import { headers } from "next/headers"

/**
 * Resolves the application origin at request time.
 * Avoids NEXT_PUBLIC_APP_URL, which is inlined at build time and can
 * incorrectly point to localhost in production deployments.
 */
export async function getSiteUrl(): Promise<string> {
  const headersList = await headers()
  const forwardedHost = headersList.get("x-forwarded-host")
  const forwardedProto = headersList.get("x-forwarded-proto")

  if (forwardedHost) {
    const protocol = forwardedProto ?? "https"
    return `${protocol}://${forwardedHost}`
  }

  const host = headersList.get("host")
  if (host) {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    return `${protocol}://${host}`
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}
