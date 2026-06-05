import { addDays, addWeeks, addMonths, addYears } from "date-fns"
import type { RecurringTransactionFrequency } from "@/types/recurring-transactions/recurring-transactions-type"

export function computeNextRunAt(
  currentNextRunAt: string,
  frequency: RecurringTransactionFrequency
): string {
  const base = new Date(currentNextRunAt)

  switch (frequency) {
    case "daily":
      return addDays(base, 1).toISOString()
    case "weekly":
      return addWeeks(base, 1).toISOString()
    case "monthly":
      return addMonths(base, 1).toISOString()
    case "quarterly":
      return addMonths(base, 3).toISOString()
    case "yearly":
      return addYears(base, 1).toISOString()
  }
}
