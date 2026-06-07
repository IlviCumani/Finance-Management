import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { PieChart } from "@/components/charts"

export function ExpenseBreakdown({ data }: { data: Record<string, number> }) {
  const pieChartData = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }))
  console.log(pieChartData)

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          Expense breakdown over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart data={pieChartData} showLegend baseOuterRadius={100} />
      </CardContent>
    </Card>
  )
}
