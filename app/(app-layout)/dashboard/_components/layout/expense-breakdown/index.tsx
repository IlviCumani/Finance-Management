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
import { InboxIcon } from "@hugeicons/core-free-icons"

export function ExpenseBreakdown({ data }: { data: Record<string, number> }) {
  const pieChartData = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }))

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          Expense breakdown over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pieChartData.length === 0 ? (
          <Empty className="h-full items-center justify-center px-4">
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <HugeiconsIcon icon={InboxIcon} className="size-4" />
              </EmptyMedia>
              <EmptyTitle>No expenses recorded</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>
                No expense breakdown has been recorded this month.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <PieChart data={pieChartData} showLegend baseOuterRadius={100} />
        )}
      </CardContent>
    </Card>
  )
}
