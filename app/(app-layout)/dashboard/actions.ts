import { getTransactionsByDateRange } from "@/lib/supabase/queries/transaction"
import { getAccounts } from "@/lib/supabase/queries/account"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Transaction } from "@/types/transaction/transaction-types"

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
  }
}

async function getAccountsData() {
  const { data: accounts, error: accountsError } = await getAccounts()

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

async function getTransactionsData(startDate: string, endDate: string) {
  const { data: transactions, error: transactionsError } =
    await getTransactionsByDateRange(startDate, endDate)
  if (transactionsError) return { error: transactionsError }
  return { data: transactions }
}
