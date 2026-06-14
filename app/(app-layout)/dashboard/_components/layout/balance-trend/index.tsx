import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { LineChart } from "@/components/charts"
import { getTranslations } from "next-intl/server"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartLineIcon } from "@hugeicons/core-free-icons"

export async function BalanceTrend({
  data,
}: {
  data: Array<{ [x: string]: string | number | undefined }>
}) {
  const t = await getTranslations("dashboard.balanceTrend")

  const isEmpty = !data || data.length === 0

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        {isEmpty ? (
          <Empty className="h-full items-center justify-center">
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <HugeiconsIcon icon={ChartLineIcon} className="size-4" />
              </EmptyMedia>
              <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
              <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <LineChart data={data} showYAxis type={"linear"} />
        )}
      </CardContent>
    </Card>
  )
}
