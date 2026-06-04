import { describe, it, expect } from "vitest"
import {
  RECURRING_TRANSACTION_FREQUENCIES,
  getRecurringTransactionFrequencyMessageKey,
} from "@/types/recurring-transactions/recurring-transactions-type"

describe("RECURRING_TRANSACTION_FREQUENCIES", () => {
  it("contains all expected frequency values", () => {
    expect(RECURRING_TRANSACTION_FREQUENCIES).toContain("daily")
    expect(RECURRING_TRANSACTION_FREQUENCIES).toContain("weekly")
    expect(RECURRING_TRANSACTION_FREQUENCIES).toContain("monthly")
    expect(RECURRING_TRANSACTION_FREQUENCIES).toContain("quarterly")
    expect(RECURRING_TRANSACTION_FREQUENCIES).toContain("yearly")
  })

  it("has exactly 5 frequency options", () => {
    expect(RECURRING_TRANSACTION_FREQUENCIES).toHaveLength(5)
  })
})

describe("getRecurringTransactionFrequencyMessageKey", () => {
  it("returns correct message key for 'daily'", () => {
    expect(getRecurringTransactionFrequencyMessageKey("daily")).toBe(
      "recurringTransactions.frequency.daily"
    )
  })

  it("returns correct message key for 'weekly'", () => {
    expect(getRecurringTransactionFrequencyMessageKey("weekly")).toBe(
      "recurringTransactions.frequency.weekly"
    )
  })

  it("returns correct message key for 'monthly'", () => {
    expect(getRecurringTransactionFrequencyMessageKey("monthly")).toBe(
      "recurringTransactions.frequency.monthly"
    )
  })

  it("returns correct message key for 'quarterly'", () => {
    expect(getRecurringTransactionFrequencyMessageKey("quarterly")).toBe(
      "recurringTransactions.frequency.quarterly"
    )
  })

  it("returns correct message key for 'yearly'", () => {
    expect(getRecurringTransactionFrequencyMessageKey("yearly")).toBe(
      "recurringTransactions.frequency.yearly"
    )
  })
})
