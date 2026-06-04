import { describe, it, expect } from "vitest"
import { formatCurrency } from "@/lib/format/number-format"

describe("formatCurrency", () => {
  it("formats a positive amount with default currency (ALL)", () => {
    const result = formatCurrency(1500)
    expect(result).toContain("1,500")
    expect(result).toContain("ALL")
  })

  it("formats a negative amount as absolute value", () => {
    const result = formatCurrency(-250)
    expect(result).toContain("250")
    expect(result).toContain("ALL")
  })

  it("formats zero correctly", () => {
    const result = formatCurrency(0)
    expect(result).toContain("0")
    expect(result).toContain("ALL")
  })

  it("formats with EUR currency", () => {
    const result = formatCurrency(99.99, "EUR")
    expect(result).toContain("99.99")
  })

  it("formats with USD currency", () => {
    const result = formatCurrency(1234.56, "USD")
    expect(result).toBe("$1,234.56")
  })

  it("handles large numbers", () => {
    const result = formatCurrency(1000000, "USD")
    expect(result).toBe("$1,000,000.00")
  })

  it("handles decimal amounts", () => {
    const result = formatCurrency(0.5, "USD")
    expect(result).toBe("$0.50")
  })
})
