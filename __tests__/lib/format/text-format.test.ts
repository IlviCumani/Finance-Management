import { describe, it, expect } from "vitest"
import { getInitials, formatCodeToText } from "@/lib/format/text-format"

describe("getInitials", () => {
  it("returns initials for a two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD")
  })

  it("returns initials for a single-word name", () => {
    expect(getInitials("Alice")).toBe("A")
  })

  it("respects maxCharsToReturn limit", () => {
    expect(getInitials("John Michael Doe", 3)).toBe("JMD")
  })

  it("defaults to 2 characters max", () => {
    expect(getInitials("John Michael Doe")).toBe("JM")
  })

  it("returns uppercase initials", () => {
    expect(getInitials("jane smith")).toBe("JS")
  })

  it("returns empty string for undefined", () => {
    expect(getInitials(undefined)).toBe("")
  })

  it("returns empty string for empty string", () => {
    expect(getInitials("")).toBe("")
  })
})

describe("formatCodeToText", () => {
  it("replaces underscores with spaces and capitalizes", () => {
    const result = formatCodeToText("hello_world")
    expect(result).toContain("Hello")
    expect(result).toContain("World")
    expect(result).not.toContain("_")
  })

  it("replaces dashes with spaces and capitalizes", () => {
    const result = formatCodeToText("some-text-here")
    expect(result).toContain("Some")
    expect(result).toContain("Text")
    expect(result).toContain("Here")
    expect(result).not.toContain("-")
  })

  it("handles camelCase by inserting spaces before capitals", () => {
    const result = formatCodeToText("camelCase")
    expect(result).toContain("Camel")
    expect(result).toContain("Case")
  })

  it("handles empty string", () => {
    expect(formatCodeToText("")).toBe("")
  })
})
