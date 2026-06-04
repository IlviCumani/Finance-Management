import { describe, it, expect } from "vitest"
import {
  locales,
  defaultLocale,
  isLocale,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
} from "@/i18n/config"

describe("i18n config", () => {
  it("exports supported locales", () => {
    expect(locales).toContain("en")
    expect(locales).toContain("sq")
    expect(locales).toHaveLength(2)
  })

  it("has 'en' as the default locale", () => {
    expect(defaultLocale).toBe("en")
  })

  it("exports cookie and storage key constants", () => {
    expect(LOCALE_COOKIE_NAME).toBe("locale")
    expect(LOCALE_STORAGE_KEY).toBe("locale")
  })
})

describe("isLocale", () => {
  it("returns true for 'en'", () => {
    expect(isLocale("en")).toBe(true)
  })

  it("returns true for 'sq'", () => {
    expect(isLocale("sq")).toBe(true)
  })

  it("returns false for unsupported locale", () => {
    expect(isLocale("fr")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isLocale("")).toBe(false)
  })

  it("returns false for random string", () => {
    expect(isLocale("not-a-locale")).toBe(false)
  })
})
