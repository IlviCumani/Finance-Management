import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { ColumnChart } from "@/components/charts"
import { formatCurrency } from "@/lib/format/number-format"

type MonthlyComparisonProps = {
  data: Array<{ label: string; income: number; expenses: number }>
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>
          Monthly comparison over the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center pl-0">
        <ColumnChart data={data} showYAxis height={450} />
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between border-t">
        <span className="text-sm text-muted-foreground">Total: Savings</span>
        <span className="text-lg font-medium">
          {formatCurrency(
            data.reduce((acc, item) => acc + item.income - item.expenses, 0)
          )}
        </span>
      </CardFooter>
    </Card>
  )
}
