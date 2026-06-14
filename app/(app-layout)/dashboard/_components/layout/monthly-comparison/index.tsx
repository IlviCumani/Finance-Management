import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { BarChart } from "@/components/charts"
import { formatCurrency } from "@/lib/format/number-format"
import { getTranslations } from "next-intl/server"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { BarChartIcon } from "@hugeicons/core-free-icons"

type MonthlyComparisonProps = {
  data: Array<{ label: string; income: number; expenses: number }>
}

export async function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const t = await getTranslations("dashboard.monthlyComparison")

  const chartData = data.map((item) => ({
    label: item.label,
    [t("income")]: item.income,
    [t("expenses")]: item.expenses,
  }))

  const totalSavings = data.reduce(
    (acc, item) => acc + item.income - item.expenses,
    0
  )

  const hasComparisonData = data.some(
    (item) => item.income > 0 || item.expenses > 0
  )
  const isEmpty = !hasComparisonData

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center pl-0">
        {isEmpty ? (
          <Empty className="h-full items-center justify-center">
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <HugeiconsIcon icon={BarChartIcon} className="size-4" />
              </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
          </Empty>
        ) : (
          <BarChart data={chartData} showLegend height={450} />
        )}
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between border-t">
        <span className="text-sm text-muted-foreground">
          {t("totalSavings")}
        </span>
        <span className="text-lg font-medium">
          {formatCurrency(totalSavings)}
        </span>
      </CardFooter>
    </Card>
  )
}
