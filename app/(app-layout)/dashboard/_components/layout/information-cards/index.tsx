import {
  BanknoteArrowUpIcon,
  BanknoteArrowDownIcon,
  DistributeHorizontalLeftIcon,
  BitcoinBagIcon,
} from "@hugeicons/core-free-icons"
import { InformationCard } from "./information-card"
import { formatCurrency, formatNumberForUI } from "@/lib/format/number-format"
import { getTranslations } from "next-intl/server"

type InformationCardsProps = {
  accountsData: {
    totalBalance?: number
    totalBalanceChange?: number
    accountsDistribution?: Array<{ value: number; label: string }>
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
  const t = await getTranslations("dashboard.informationCards")

  const accountsDistribution =
    accountsData.accountsDistribution?.map((account) => ({
      value: formatNumberForUI(account.value * 100),
      label: account.label,
    })) ?? []

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InformationCard
        title={t("totalBalance")}
        value={formatCurrency(accountsData.totalBalance ?? 0)}
        change={accountsData.totalBalanceChange}
        description={t("totalBalanceDescription")}
        icon={BitcoinBagIcon}
      />
      <InformationCard
        title={t("monthlyIncome")}
        value={formatCurrency(transactionsData.thisMonthIncome ?? 0)}
        change={transactionsData.percentageDifferenceInIncome}
        description={t("monthlyIncomeDescription")}
        icon={BanknoteArrowUpIcon}
      />
      <InformationCard
        title={t("monthlyExpenses")}
        value={formatCurrency(transactionsData.thisMonthExpenses ?? 0)}
        change={transactionsData.percentageDifferenceInExpenses}
        description={t("monthlyExpensesDescription")}
        icon={BanknoteArrowDownIcon}
      />
      <InformationCard
        title={t("accountsDistribution")}
        value={accountsDistribution}
        type="multiProgress"
        description={t("accountsDistributionDescription")}
        icon={DistributeHorizontalLeftIcon}
      />
    </div>
  )
}
