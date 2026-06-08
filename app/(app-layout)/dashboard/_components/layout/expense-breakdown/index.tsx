import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { PieChart } from "@/components/charts"
import {
  Empty,
  EmptyDescription,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { PieChartIcon } from "@hugeicons/core-free-icons"
import { getTranslations } from "next-intl/server"

export async function ExpenseBreakdown({
  data,
}: {
  data: Record<string, number>
}) {
  const t = await getTranslations("dashboard.expenseBreakdown")

  const pieChartData = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }))

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {pieChartData.length === 0 ? (
          <Empty className="h-full items-center justify-center px-4">
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <HugeiconsIcon icon={PieChartIcon} className="size-4" />
              </EmptyMedia>
              <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <PieChart data={pieChartData} showLegend baseOuterRadius={100} />
        )}
      </CardContent>
    </Card>
  )
}
