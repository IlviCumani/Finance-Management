import { getTransactionsByDateRange } from "@/lib/supabase/queries/transaction"
import { getActiveAndInactiveAccounts } from "@/lib/supabase/queries/account"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Transaction } from "@/types/transaction/transaction-types"
import { formatDateForUI } from "@/lib/format/date-format"

export async function getDashboardData() {
  const accountsData = await getAccountsData()
  const startOfThisMonth = startOfMonth(new Date()).toISOString()
  const endOfThisMonth = endOfMonth(new Date()).toISOString()
  const transactionsData = await getTransactionsData(
    startOfThisMonth,
    endOfThisMonth
  )
  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1)).toISOString()
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1)).toISOString()
  const lastMonthTransactionsData = await getTransactionsData(
    startOfLastMonth,
    endOfLastMonth
  )

  const thisMonthIncome = transactionsData.data
    ?.filter((transaction) => transaction.transactionType === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  const lastMonthIncome = lastMonthTransactionsData.data
    ?.filter((transaction) => transaction.transactionType === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  const thisMonthExpenses = transactionsData.data
    ?.filter(
      (transaction) =>
        transaction.transactionType === "expense" ||
        transaction.transactionType === "subscription"
    )
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  const lastMonthExpenses = lastMonthTransactionsData.data
    ?.filter(
      (transaction) =>
        transaction.transactionType === "expense" ||
        transaction.transactionType === "subscription"
    )
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  const percentageDifferenceInIncome = getPercentageDifference(
    thisMonthIncome,
    lastMonthIncome
  )
  const percentageDifferenceInExpenses = getPercentageDifference(
    thisMonthExpenses,
    lastMonthExpenses
  )

  const expenseBreakdown = transactionsData.data
    ?.filter((transaction) => transaction.transactionType === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.transactionCategory?.name ?? "Unknown"] =
          acc[transaction.transactionCategory?.name ?? "Unknown"] ??
          0 + transaction.amount
        return acc
      },
      {} as Record<string, number>
    )

  const thisMonthNetBalanceChange = getNetBalanceChangeFromTransactions(
    transactionsData.data
  )
  const lastMonthTotalBalance =
    (accountsData.totalBalance ?? 0) - thisMonthNetBalanceChange
  const totalBalanceChange = getPercentageDifference(
    accountsData.totalBalance,
    lastMonthTotalBalance
  )

  const monthlyComparison = await getLast3MonthsTransactionsData()
  const thisMonthSubscriptions = getThisMonthSubscriptionsData(
    transactionsData.data
  )

  const trendBalanceData = await getTrendBalanceData()

  return {
    accountsData: {
      totalBalance: accountsData.totalBalance,
      accountsDistribution: accountsData.accountsDistribution,
      totalBalanceChange,
    },
    transactionsData: {
      thisMonthIncome,
      lastMonthIncome,
      thisMonthExpenses,
      lastMonthExpenses,
      percentageDifferenceInIncome,
      percentageDifferenceInExpenses,
    },
    expenseBreakdown,
    monthlyComparison,
    thisMonthSubscriptions,
    trendBalanceData,
  }
}

async function getAccountsData() {
  const { data: accounts, error: accountsError } =
    await getActiveAndInactiveAccounts()

  if (accountsError) {
    return {
      error: accountsError,
    }
  }

  const totalBalance = accounts?.reduce(
    (acc, account) => acc + (account?.currentBalance ?? 0),
    0
  )

  const accountsDistribution = accounts?.map((account) => ({
    value: account.currentBalance / (totalBalance ?? 1),
    label: account.name,
  }))

  return {
    totalBalance,
    accountsDistribution,
  }
}

function getNetBalanceChangeFromTransactions(
  transactions: Array<Transaction> | null | undefined
): number {
  return (
    transactions?.reduce((acc, transaction) => {
      if (transaction.transactionType === "income") {
        return acc + transaction.amount
      }
      if (
        transaction.transactionType === "expense" ||
        transaction.transactionType === "subscription"
      ) {
        return acc - transaction.amount
      }
      return acc
    }, 0) ?? 0
  )
}

function getPercentageDifference(
  current: number | undefined,
  previous: number | undefined
): number | undefined {
  const previousValue = previous ?? 0
  if (previousValue === 0) {
    return undefined
  }

  const difference = (((current ?? 0) - previousValue) / previousValue) * 100

  return Number.isFinite(difference) ? difference : undefined
}

async function getLast3MonthsTransactionsData(): Promise<
  Array<{
    label: string
    income: number
    expenses: number
  }>
> {
  const now = new Date()
  const monthsAgoRange = [2, 1, 0] as const

  const monthBuckets = new Map<
    string,
    { label: string; income: number; expenses: number }
  >()

  for (const monthsAgo of monthsAgoRange) {
    const monthDate = subMonths(now, monthsAgo)
    const monthKey = format(startOfMonth(monthDate), "yyyy-MM")
    monthBuckets.set(monthKey, {
      label: formatDateForUI(monthDate, "MMMM"),
      income: 0,
      expenses: 0,
    })
  }

  const { data: transactions } = await getTransactionsData(
    startOfMonth(subMonths(now, 2)).toISOString(),
    endOfMonth(now).toISOString()
  )

  for (const transaction of transactions ?? []) {
    const monthKey = format(
      startOfMonth(new Date(transaction.transactionDate)),
      "yyyy-MM"
    )
    const bucket = monthBuckets.get(monthKey)
    if (!bucket) continue

    if (transaction.transactionType === "income") {
      bucket.income += transaction.amount
    } else if (
      transaction.transactionType === "expense" ||
      transaction.transactionType === "subscription"
    ) {
      bucket.expenses += transaction.amount
    }
  }

  return monthsAgoRange.map((monthsAgo) => {
    const monthKey = format(startOfMonth(subMonths(now, monthsAgo)), "yyyy-MM")
    const bucket = monthBuckets.get(monthKey)!
    return {
      label: bucket.label,
      income: bucket.income,
      expenses: bucket.expenses,
    }
  })
}

function getThisMonthSubscriptionsData(
  transactions: Array<Transaction> | null | undefined
): {
  subscriptions: Array<{ name: string; amount: number }>
  totalCost: number
} {
  const subscriptions =
    transactions?.filter(
      (transaction) => transaction.transactionType === "subscription"
    ) ?? []

  return {
    subscriptions: subscriptions.map((transaction) => ({
      name: transaction.name,
      amount: transaction.amount,
    })),
    totalCost: subscriptions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    ),
  }
}

async function getTransactionsData(startDate: string, endDate: string) {
  const { data: transactions, error: transactionsError } =
    await getTransactionsByDateRange(startDate, endDate)
  if (transactionsError) return { error: transactionsError }
  return { data: transactions }
}

async function getTrendBalanceData(): Promise<{
  data?: Array<Record<string, string | number | undefined>> | null
  error?: string | null
}> {
  const now = new Date()
  const MONTHS_BACK = 5
  const { data: accounts } = await getActiveAndInactiveAccounts()
  if (!accounts?.length) return { data: [], error: null }

  const { data: transactions, error } = await getTransactionsData(
    startOfMonth(subMonths(now, MONTHS_BACK)).toISOString(),
    endOfMonth(now).toISOString()
  )
  if (error) return { error }

  const transactionsByMonth = new Map<string, Array<Transaction>>()
  for (const transaction of transactions ?? []) {
    const monthKey = format(
      startOfMonth(new Date(transaction.transactionDate)),
      "yyyy-MM"
    )
    const bucket = transactionsByMonth.get(monthKey) ?? []
    bucket.push(transaction)
    transactionsByMonth.set(monthKey, bucket)
  }

  const balances = new Map<string, number>()
  for (const account of accounts) {
    balances.set(account.id, account.currentBalance)
  }

  const result: Array<Record<string, string | number | undefined>> = []

  for (let i = 0; i <= MONTHS_BACK; i++) {
    const monthDate = subMonths(now, i)
    const monthKey = format(startOfMonth(monthDate), "yyyy-MM")

    const point: Record<string, string | number | undefined> = {
      label: formatDateForUI(monthDate, "MMMM"),
    }
    for (const account of accounts) {
      point[account.name] = balances.get(account.id) ?? 0
    }
    result.push(point)

    const monthTransactions = transactionsByMonth.get(monthKey) ?? []
    for (const transaction of monthTransactions) {
      const accountId = transaction.account?.id
      if (!accountId) continue

      if (transaction.transactionType === "income") {
        balances.set(
          accountId,
          (balances.get(accountId) ?? 0) - transaction.amount
        )
      } else if (
        transaction.transactionType === "expense" ||
        transaction.transactionType === "subscription"
      ) {
        balances.set(
          accountId,
          (balances.get(accountId) ?? 0) + transaction.amount
        )
      } else if (transaction.transactionType === "transfer") {
        balances.set(
          accountId,
          (balances.get(accountId) ?? 0) + transaction.amount
        )
        const targetId = transaction.transferredToAccount?.id
        if (targetId) {
          balances.set(
            targetId,
            (balances.get(targetId) ?? 0) - transaction.amount
          )
        }
      }
    }
  }

  return { data: result.reverse(), error: null }
}
