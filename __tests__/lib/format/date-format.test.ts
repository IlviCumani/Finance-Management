import { describe, it, expect } from "vitest"
import { formatDateForUI } from "@/lib/format/date-format"

describe("formatDateForUI", () => {
  it("formats a Date object with default format", () => {
    const date = new Date(2024, 5, 15)
    const result = formatDateForUI(date)
    expect(result).toBe("15 Jun 2024")
  })

  it("formats a date string with default format", () => {
    const result = formatDateForUI("2024-03-01")
    expect(result).toBe("01 Mar 2024")
  })

  it("returns '--' for empty string", () => {
    const result = formatDateForUI("")
    expect(result).toBe("--")
  })

  it("applies a custom format", () => {
    const date = new Date(2024, 0, 5)
    const result = formatDateForUI(date, "yyyy-MM-dd")
    expect(result).toBe("2024-01-05")
  })

  it("applies 'MMMM yyyy' format", () => {
    const date = new Date(2024, 11, 25)
    const result = formatDateForUI(date, "MMMM yyyy")
    expect(result).toBe("December 2024")
  })

  it("handles ISO string input", () => {
    const result = formatDateForUI("2024-07-20T10:30:00.000Z")
    expect(result).toBe("20 Jul 2024")
  })
})
