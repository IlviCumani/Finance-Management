import { Account } from "../account/account-types"

export const RECURRING_TRANSACTION_FREQUENCIES = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
] as const

export type RecurringTransactionFrequency =
  (typeof RECURRING_TRANSACTION_FREQUENCIES)[number]

export type RecurringTransactionFrequencyMessageKey =
  `recurringTransactions.frequency.${RecurringTransactionFrequency}`

export function getRecurringTransactionFrequencyMessageKey(
  frequency: RecurringTransactionFrequency
): RecurringTransactionFrequencyMessageKey {
  return `recurringTransactions.frequency.${frequency}`
}

export type RecurringTransaction = {
  id: string
  userId: string
  account: Account | null
  name: string
  description?: string
  amount: number
  frequency: RecurringTransactionFrequency
  nextRunAt: string
  lastRunAt: string
  isActive: boolean
  autoExecute: boolean
  createdAt: string
  updatedAt: string
}

export type RecurringTransaction_Response = {
  id: string
  user_id: string
  account_id: string
  name: string
  description?: string
  amount: number
  frequency: RecurringTransactionFrequency
  next_run_at: string
  last_run_at: string
  is_active: boolean
  auto_execute: boolean
  created_at: string
  updated_at: string
}
