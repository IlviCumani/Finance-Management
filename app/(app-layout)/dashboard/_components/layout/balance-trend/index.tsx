import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { LineChart } from "@/components/charts"
import { getTranslations } from "next-intl/server"

export async function BalanceTrend({
  data,
}: {
  data: Array<{ [x: string]: string | number | undefined }>
}) {
  const t = await getTranslations("dashboard.balanceTrend")

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <LineChart data={data} showYAxis type={"linear"} />
      </CardContent>
    </Card>
  )
}
