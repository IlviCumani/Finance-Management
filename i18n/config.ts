export const locales = ["en", "sq"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const LOCALE_COOKIE_NAME = "locale"

export const LOCALE_STORAGE_KEY = "locale"

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
