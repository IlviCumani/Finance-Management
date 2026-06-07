import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { LineChart } from "@/components/charts"

export function BalanceTrend({
  data,
}: {
  data: Array<{ [x: string]: string | number | undefined }>
}) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>Balance trend over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <LineChart data={data} showYAxis type={"linear"} />
      </CardContent>
    </Card>
  )
}
