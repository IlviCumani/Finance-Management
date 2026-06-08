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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center pl-0">
        <BarChart data={chartData} showLegend height={450} />
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between border-t">
        <span className="text-sm text-muted-foreground">
          {t("totalSavings")}
        </span>
        <span className="text-lg font-medium">
          {formatCurrency(
            data.reduce((acc, item) => acc + item.income - item.expenses, 0)
          )}
        </span>
      </CardFooter>
    </Card>
  )
}
