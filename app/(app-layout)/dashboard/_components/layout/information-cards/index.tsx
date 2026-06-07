import { ChartDownIcon } from "@hugeicons/core-free-icons"
import { InformationCard } from "./information-card"
import { formatCurrency, formatNumberForUI } from "@/lib/format/number-format"

type InformationCardsProps = {
  accountsData: {
    totalBalance?: number
    totalBalanceChange?: number
    accountsDistribution?: { value: number; label: string }[]
  }
  transactionsData: {
    thisMonthIncome?: number
    percentageDifferenceInIncome?: number
    thisMonthExpenses?: number
    percentageDifferenceInExpenses?: number
  }
}

export async function InformationCards({
  accountsData,
  transactionsData,
}: InformationCardsProps) {
  const accountsDistribution =
    accountsData.accountsDistribution?.map((account) => ({
      value: formatNumberForUI(account.value * 100),
      label: account.label,
    })) ?? []
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InformationCard
        title="Total Balance"
        value={formatCurrency(accountsData.totalBalance ?? 0)}
        change={accountsData.totalBalanceChange}
        description="Total balance in the system"
        icon={ChartDownIcon}
      />
      <InformationCard
        title="Monthly Income"
        value={formatCurrency(transactionsData.thisMonthIncome ?? 0)}
        change={transactionsData.percentageDifferenceInIncome}
        description="Money made this month"
        icon={ChartDownIcon}
      />
      <InformationCard
        title="Monthly Expenses"
        value={formatCurrency(transactionsData.thisMonthExpenses ?? 0)}
        change={transactionsData.percentageDifferenceInExpenses}
        description="Money spent this month"
        icon={ChartDownIcon}
      />
      <InformationCard
        title="Accounts Distribution"
        value={accountsDistribution}
        type="multiProgress"
        description="Money Distributed in Each Account"
        icon={ChartDownIcon}
      />
    </div>
  )
}
