import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { PieChart } from "@/components/charts"

export function ExpenseBreakdown() {
  const data = [
    { label: "Food", value: 100 },
    { label: "Transport", value: 200 },
    { label: "Housing", value: 300 },
    { label: "Utilities", value: 400 },
    { label: "Entertainment", value: 500 },
  ]

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          Expense breakdown over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart data={data} showLegend baseOuterRadius={100} />
      </CardContent>
    </Card>
  )
}
