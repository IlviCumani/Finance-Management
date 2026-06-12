"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EditIcon, CirclePlus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import type { BudgetCategory } from "@/types/budget/budget-types"
import { TotalBudgetForm } from "../total-budget-form"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatNumberForUI, formatCurrency } from "@/lib/format/number-format"
import { useBudgetContext } from "../../context/budget-context"

type TotalBudgetCardProps = {
  budgetCategories: Array<BudgetCategory>
}

export function TotalBudgetCard({ budgetCategories }: TotalBudgetCardProps) {
  const { totalBudget } = useBudgetContext()
  const totalSpent = budgetCategories.reduce(
    (acc, category) => acc + category.amount,
    0
  )
  const totalRemaining = totalBudget - totalSpent
  const [open, setOpen] = useState(false)

  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const isWarning = utilization >= 80 && utilization < 100
  const isFilled = utilization === 100
  const isOverLimit = utilization > 100

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Total Budget</CardTitle>
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={() => setOpen(true)}
        >
          <HugeiconsIcon icon={totalBudget > 0 ? EditIcon : CirclePlus} />
          {totalBudget > 0 ? "Edit" : "Add"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold">{formatCurrency(totalBudget)}</h1>
        <div className="flex justify-between max-sm:flex-col max-sm:space-y-2">
          <div className="space-x-1">
            <span className="text-muted-foreground">Spent:</span>
            <span className="font-bold">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="space-x-1">
            <span className="text-muted-foreground">
              {isOverLimit ? "Over Limit by " : "Remaining: "}
            </span>
            <span className="">
              {formatCurrency(
                isOverLimit ? totalRemaining * -1 : totalRemaining
              )}
            </span>
          </div>
        </div>
        <Progress
          value={utilization}
          className={cn(
            "h-2",
            isWarning && "[&>div]:bg-amber-500",
            isFilled && "[&>div]:bg-muted-foreground",
            isOverLimit && "[&>div]:bg-red-500"
          )}
        />
        <div className="flex justify-end space-x-1" hidden={totalBudget === 0}>
          <span className="text-muted-foreground">Utilization:</span>
          <span className="font-bold">{formatNumberForUI(utilization)}%</span>
        </div>
      </CardContent>
      <TotalBudgetForm
        open={open}
        onOpenChange={setOpen}
        totalBudget={totalBudget}
      />
    </Card>
  )
}
