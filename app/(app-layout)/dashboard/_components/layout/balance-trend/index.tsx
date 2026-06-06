import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { LineChart } from "@/components/charts"

export function BalanceTrend() {
  const data = [
    {
      label: "Jan",
      account1: 120,
      account2: 180,
      account3: 95,
      account4: 210,
      account5: 145,
      account6: 165,
    },
    {
      label: "Feb",
      account1: 95,
      account2: 210,
      account3: 110,
      account4: 185,
      account5: 130,
      account6: 190,
    },
    {
      label: "Mar",
      account1: 140,
      account2: 195,
      account3: 125,
      account4: 220,
      account5: 155,
      account6: 175,
    },
    {
      label: "Apr",
      account1: 110,
      account2: 230,
      account3: 100,
      account4: 200,
      account5: 170,
      account6: 160,
    },
    {
      label: "May",
      account1: 160,
      account2: 175,
      account3: 135,
      account4: 240,
      account5: 120,
      account6: 205,
    },
    {
      label: "Jun",
      account1: 130,
      account2: 220,
      account3: 115,
      account4: 195,
      account5: 180,
      account6: 185,
    },
  ]

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>Balance trend over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <LineChart data={data} showYAxis />
      </CardContent>
    </Card>
  )
}
