import { getTranslations } from "next-intl/server"
import { getTransactionsByDateRange } from "@/lib/supabase/queries/transaction"
import { getActiveAndInactiveAccounts } from "@/lib/supabase/queries/account"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Transaction } from "@/types/transaction/transaction-types"
import { Account } from "@/types/account/account-types"
import { formatDateForUI } from "@/lib/format/date-format"
import {
  isIncome,
  isExpense,
  sumBy,
  toMonthKey,
  filterByMonth,
  getPercentageDifference,
} from "./utils"

const TREND_MONTHS_BACK = 5

export async function getDashboardData() {
  const now = new Date()
  const thisMonthKey = toMonthKey(now)
  const lastMonthKey = toMonthKey(subMonths(now, 1))

  const [
    { data: accounts, error: accountsError },
    { data: allTransactions, error: transactionsError },
  ] = await Promise.all([
    getActiveAndInactiveAccounts(),
    getTransactionsByDateRange(
      startOfMonth(subMonths(now, TREND_MONTHS_BACK)).toISOString(),
      endOfMonth(now).toISOString()
    ),
  ])

  if (accountsError || transactionsError) {
    return {
      accountsData: {},
      transactionsData: {},
      expenseBreakdown: {},
      monthlyComparison: [],
      thisMonthSubscriptions: { subscriptions: [], totalCost: 0 },
      trendBalanceData: { data: [], error: accountsError ?? transactionsError },
    }
  }

  const safeAccounts = accounts ?? []
  const safeTransactions = allTransactions ?? []

  const thisMonthTransactions = filterByMonth(safeTransactions, thisMonthKey)
  const lastMonthTransactions = filterByMonth(safeTransactions, lastMonthKey)

  return {
    accountsData: buildAccountsData(safeAccounts, thisMonthTransactions),
    transactionsData: buildTransactionsData(
      thisMonthTransactions,
      lastMonthTransactions
    ),
    expenseBreakdown: await buildExpenseBreakdown(thisMonthTransactions),
    monthlyComparison: buildMonthlyComparison(now, safeTransactions),
    thisMonthSubscriptions: buildSubscriptionsData(thisMonthTransactions),
    trendBalanceData: buildTrendBalanceData(
      now,
      safeAccounts,
      safeTransactions
    ),
  }
}

function buildAccountsData(
  accounts: Array<Account>,
  thisMonthTransactions: Array<Transaction>
) {
  const totalBalance = accounts.reduce(
    (acc, account) => acc + (account.currentBalance ?? 0),
    0
  )

  const accountsDistribution = accounts.map((account) => ({
    value: account.currentBalance / (totalBalance || 1),
    label: account.name,
  }))

  const thisMonthNet = thisMonthTransactions.reduce((acc, t) => {
    if (isIncome(t)) return acc + t.amount
    if (isExpense(t)) return acc - t.amount
    return acc
  }, 0)

  const lastMonthTotalBalance = totalBalance - thisMonthNet
  const totalBalanceChange = getPercentageDifference(
    totalBalance,
    lastMonthTotalBalance
  )

  return { totalBalance, accountsDistribution, totalBalanceChange }
}

function buildTransactionsData(
  thisMonth: Array<Transaction>,
  lastMonth: Array<Transaction>
) {
  const thisMonthIncome = sumBy(thisMonth, isIncome)
  const lastMonthIncome = sumBy(lastMonth, isIncome)
  const thisMonthExpenses = sumBy(thisMonth, isExpense)
  const lastMonthExpenses = sumBy(lastMonth, isExpense)

  return {
    thisMonthIncome,
    lastMonthIncome,
    thisMonthExpenses,
    lastMonthExpenses,
    percentageDifferenceInIncome: getPercentageDifference(
      thisMonthIncome,
      lastMonthIncome
    ),
    percentageDifferenceInExpenses: getPercentageDifference(
      thisMonthExpenses,
      lastMonthExpenses
    ),
  }
}

async function buildExpenseBreakdown(
  transactions: Array<Transaction>
): Promise<Record<string, number>> {
  const t = await getTranslations("dashboard.actions")

  return transactions
    .filter((transaction) => transaction.transactionType === "expense")
    .reduce<Record<string, number>>((acc, transaction) => {
      const category =
        transaction.transactionCategory?.name ?? t("unknownCategory")
      acc[category] = (acc[category] ?? 0) + transaction.amount
      return acc
    }, {})
}

function buildMonthlyComparison(
  now: Date,
  transactions: Array<Transaction>
): Array<{ label: string; income: number; expenses: number }> {
  const monthsAgoRange = [2, 1, 0] as const

  return monthsAgoRange.map((monthsAgo) => {
    const monthDate = subMonths(now, monthsAgo)
    const monthKey = toMonthKey(monthDate)
    const monthTransactions = filterByMonth(transactions, monthKey)

    return {
      label: formatDateForUI(monthDate, "MMMM"),
      income: sumBy(monthTransactions, isIncome),
      expenses: sumBy(monthTransactions, isExpense),
    }
  })
}

function buildSubscriptionsData(transactions: Array<Transaction>): {
  subscriptions: Array<{ name: string; amount: number }>
  totalCost: number
} {
  const subscriptions = transactions.filter(
    (t) => t.transactionType === "subscription"
  )

  return {
    subscriptions: subscriptions.map((t) => ({
      name: t.name,
      amount: t.amount,
    })),
    totalCost: subscriptions.reduce((acc, t) => acc + t.amount, 0),
  }
}

function buildTrendBalanceData(
  now: Date,
  accounts: Array<Account>,
  transactions: Array<Transaction>
): {
  data: Array<Record<string, string | number | undefined>>
  error: string | null
} {
  if (!accounts.length) return { data: [], error: null }

  const transactionsByMonth = new Map<string, Array<Transaction>>()
  for (const t of transactions) {
    const key = toMonthKey(new Date(t.transactionDate))
    const bucket = transactionsByMonth.get(key) ?? []
    bucket.push(t)
    transactionsByMonth.set(key, bucket)
  }

  const balances = new Map<string, number>(
    accounts.map((a) => [a.id, a.currentBalance])
  )

  const result: Array<Record<string, string | number | undefined>> = []

  for (let i = 0; i <= TREND_MONTHS_BACK; i++) {
    const monthDate = subMonths(now, i)
    const monthKey = toMonthKey(monthDate)

    const point: Record<string, string | number | undefined> = {
      label: formatDateForUI(monthDate, "MMMM"),
    }
    for (const account of accounts) {
      point[account.name] = balances.get(account.id) ?? 0
    }
    result.push(point)

    for (const t of transactionsByMonth.get(monthKey) ?? []) {
      const accountId = t.account?.id
      if (!accountId) continue

      const current = balances.get(accountId) ?? 0

      if (isIncome(t)) {
        balances.set(accountId, current - t.amount)
      } else if (isExpense(t)) {
        balances.set(accountId, current + t.amount)
      } else if (t.transactionType === "transfer") {
        balances.set(accountId, current + t.amount)
        const targetId = t.transferredToAccount?.id
        if (targetId) {
          balances.set(targetId, (balances.get(targetId) ?? 0) - t.amount)
        }
      }
    }
  }

  return { data: result.reverse(), error: null }
}
