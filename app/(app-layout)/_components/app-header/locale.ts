"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

import { isLocale, LOCALE_COOKIE_NAME, type Locale } from "@/i18n/config"

/** Set the tongue upon the server, that all renders may speak as one. */
export async function setLocaleCookie(locale: Locale) {
  if (!isLocale(locale)) return

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })

  revalidatePath("/", "layout")
}
