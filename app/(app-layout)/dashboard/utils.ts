import { format, startOfMonth } from "date-fns"
import { Transaction } from "@/types/transaction/transaction-types"

export function isIncome(t: Transaction): boolean {
  return t.transactionType === "income"
}

export function isExpense(t: Transaction): boolean {
  return t.transactionType === "expense" || t.transactionType === "subscription"
}

export function sumBy(
  transactions: Array<Transaction>,
  predicate: (t: Transaction) => boolean
): number {
  return transactions.filter(predicate).reduce((acc, t) => acc + t.amount, 0)
}

export function toMonthKey(date: Date): string {
  return format(startOfMonth(date), "yyyy-MM")
}

export function filterByMonth(
  transactions: Array<Transaction>,
  monthKey: string
): Array<Transaction> {
  return transactions.filter(
    (t) => toMonthKey(new Date(t.transactionDate)) === monthKey
  )
}

export function getPercentageDifference(
  current: number | undefined,
  previous: number | undefined
): number | undefined {
  const prev = previous ?? 0
  if (prev === 0) return undefined

  const difference = (((current ?? 0) - prev) / prev) * 100
  return Number.isFinite(difference) ? difference : undefined
}
