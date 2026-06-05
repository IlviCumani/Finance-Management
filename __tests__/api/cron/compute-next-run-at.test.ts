import { describe, it, expect } from "vitest"
import { computeNextRunAt } from "@/app/api/cron/process-recurring-transactions/compute-next-run-at"

describe("computeNextRunAt", () => {
  const baseDate = "2026-06-01T10:00:00.000Z"

  it("advances by one day for 'daily' frequency", () => {
    const result = computeNextRunAt(baseDate, "daily")
    expect(result).toBe("2026-06-02T10:00:00.000Z")
  })

  it("advances by one week for 'weekly' frequency", () => {
    const result = computeNextRunAt(baseDate, "weekly")
    expect(result).toBe("2026-06-08T10:00:00.000Z")
  })

  it("advances by one month for 'monthly' frequency", () => {
    const result = computeNextRunAt(baseDate, "monthly")
    expect(result).toBe("2026-07-01T10:00:00.000Z")
  })

  it("advances by three months for 'quarterly' frequency", () => {
    const result = computeNextRunAt(baseDate, "quarterly")
    expect(result).toBe("2026-09-01T10:00:00.000Z")
  })

  it("advances by one year for 'yearly' frequency", () => {
    const result = computeNextRunAt(baseDate, "yearly")
    expect(result).toBe("2027-06-01T10:00:00.000Z")
  })

  it("handles end-of-month edge case for monthly advancement", () => {
    const jan31 = "2026-01-31T12:00:00.000Z"
    const result = computeNextRunAt(jan31, "monthly")
    expect(new Date(result).getMonth()).toBe(1)
  })

  it("handles leap year for yearly advancement", () => {
    const feb29 = "2024-02-29T08:00:00.000Z"
    const result = computeNextRunAt(feb29, "yearly")
    const resultDate = new Date(result)
    expect(resultDate.getFullYear()).toBe(2025)
    expect(resultDate.getMonth()).toBe(1)
  })

  it("preserves the time component for daily and weekly frequencies", () => {
    const withTime = "2026-06-15T14:30:45.000Z"

    const daily = new Date(computeNextRunAt(withTime, "daily"))
    expect(daily.getUTCHours()).toBe(14)
    expect(daily.getUTCMinutes()).toBe(30)
    expect(daily.getUTCSeconds()).toBe(45)

    const weekly = new Date(computeNextRunAt(withTime, "weekly"))
    expect(weekly.getUTCHours()).toBe(14)
    expect(weekly.getUTCMinutes()).toBe(30)

    const monthly = new Date(computeNextRunAt(withTime, "monthly"))
    expect(monthly.getUTCHours()).toBe(14)
    expect(monthly.getUTCMinutes()).toBe(30)
  })
})
