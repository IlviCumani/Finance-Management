import { RecurringTransaction } from "@/types/recurring-transactions/recurring-transactions-type"

const userId = "1"
const timestamp = new Date().toISOString()

const mainChecking = {
  id: "acct-checking-1",
  userId,
  name: "Main Checking",
  currentBalance: 2847.52,
  currency: "USD",
  isArchived: false,
  createdAt: timestamp,
  updatedAt: timestamp,
}

function billingDate(dayOfMonth: number, monthsAhead = 0): string {
  const date = new Date()
  date.setMonth(date.getMonth() + monthsAhead)
  date.setDate(
    Math.min(
      dayOfMonth,
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    )
  )
  return date.toISOString()
}

export const dummyRecurringTransactions: Array<RecurringTransaction> = [
  {
    id: "sub-cursor",
    userId,
    account: mainChecking,
    name: "Cursor Pro",
    description: "AI-powered IDE subscription",
    amount: 20,
    frequency: "monthly",
    nextRunAt: billingDate(3, 1),
    lastRunAt: billingDate(3, 0),
    isActive: true,
    autoExecute: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "sub-netflix",
    userId,
    account: mainChecking,
    name: "Netflix",
    description: "Standard plan — streaming",
    amount: 15.49,
    frequency: "monthly",
    nextRunAt: billingDate(8, 1),
    lastRunAt: billingDate(8, 0),
    isActive: true,
    autoExecute: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "sub-max",
    userId,
    account: mainChecking,
    name: "Max",
    description: "HBO Max — ad-free streaming",
    amount: 16.99,
    frequency: "monthly",
    nextRunAt: billingDate(14, 1),
    lastRunAt: billingDate(14, 0),
    isActive: true,
    autoExecute: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "sub-prime-video",
    userId,
    account: mainChecking,
    name: "Prime Video",
    description: "Prime membership — includes Prime Video",
    amount: 14.99,
    frequency: "monthly",
    nextRunAt: billingDate(21, 1),
    lastRunAt: billingDate(21, 0),
    isActive: true,
    autoExecute: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "sub-spotify",
    userId,
    account: mainChecking,
    name: "Spotify Premium",
    description: "Individual plan — music streaming",
    amount: 11.99,
    frequency: "monthly",
    nextRunAt: billingDate(27, 1),
    lastRunAt: billingDate(27, 0),
    isActive: true,
    autoExecute: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "sub-apple-music",
    userId,
    account: mainChecking,
    name: "Apple",
    description: "Individual plan — music streaming",
    amount: 9.99,
    frequency: "monthly",
    nextRunAt: billingDate(3, 1),
    lastRunAt: billingDate(3, 0),
    isActive: true,
    autoExecute: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
]
