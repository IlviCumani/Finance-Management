import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Progress } from "@/components/ui/progress"
import { ColorBadge } from "@/components/ui/color-badge"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import type { BudgetCategory } from "@/types/budget/budget-types"
import { formatCurrency } from "@/lib/format/number-format"
import { cn } from "@/lib/utils"

type BudgetCardProps = {
  category: BudgetCategory
}

export function BudgetCard({ category }: BudgetCardProps) {
  const { name, description, amount, limit } = category
  const utilization = limit > 0 ? (amount / limit) * 100 : 0
  const remaining = limit - amount

  const isWarning = utilization >= 80 && utilization < 100
  const isFilled = utilization === 100
  const isOverLimit = utilization > 100

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant={"destructive"} size={"icon-sm"}>
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-x-1">
            <span>{formatCurrency(amount)}</span>
            <span className="text-muted-foreground">
              / {formatCurrency(limit)}
            </span>
          </div>
          <div className="space-x-1">
            <span className="text-muted-foreground">
              {Math.round(utilization)}% used
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
        <div className="flex items-center justify-between">
          {isWarning && (
            <ColorBadge color="amber">
              <HugeiconsIcon icon={InformationCircleIcon} />
              Near Limit
            </ColorBadge>
          )}
          {isOverLimit && (
            <ColorBadge color="red">
              <HugeiconsIcon icon={InformationCircleIcon} />
              Over Limit
            </ColorBadge>
          )}
          <div className="ml-auto">
            <span>
              {formatCurrency(remaining)} {isOverLimit ? "over limit" : "left"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
