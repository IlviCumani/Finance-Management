import { isLocale, LOCALE_STORAGE_KEY, type Locale } from "./config"

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return stored && isLocale(stored) ? stored : null
}

export function writeStoredLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
