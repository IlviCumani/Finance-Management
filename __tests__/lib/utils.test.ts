import { describe, it, expect, vi } from "vitest"
import { cn, getLogoDevUrl } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2")
  })

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "extra")).toBe("base extra")
  })

  it("handles empty input", () => {
    expect(cn()).toBe("")
  })

  it("merges complex tailwind classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })
})

describe("getLogoDevUrl", () => {
  it("constructs a logo.dev URL with the given name", () => {
    const url = getLogoDevUrl("spotify")
    expect(url).toContain("https://img.logo.dev/name/spotify")
    expect(url).toContain("format=webp")
    expect(url).toContain("retina=true")
    expect(url).toContain("fallback=404")
  })

  it("encodes the brand name in the URL", () => {
    const url = getLogoDevUrl("my-brand")
    expect(url).toContain("name/my-brand")
  })
})
