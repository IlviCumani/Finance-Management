"use client"

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
import { BudgetForm } from "../budget-category-form"
import { useRef, useState } from "react"

type BudgetCardProps = {
  category: BudgetCategory
  totalBudget: number
}

export function BudgetCard({ category, totalBudget }: BudgetCardProps) {
  const [open, setOpen] = useState(false)
  const skipOpenRef = useRef(false)
  const { name, description, amount, limit } = category
  const utilization = limit > 0 ? (amount / limit) * 100 : 0
  const remaining = limit - amount
  const isWarning = utilization >= 80 && utilization < 100
  const isFilled = utilization === 100
  const isOverLimit = utilization > 100

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      skipOpenRef.current = true
      window.setTimeout(() => {
        skipOpenRef.current = false
      }, 0)
    }
    setOpen(nextOpen)
  }

  function handleCardClick() {
    if (skipOpenRef.current) return
    setOpen(true)
  }

  return (
    <>
      <Card onClick={handleCardClick} className="group cursor-pointer">
        <CardHeader className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant={"destructive"}
            size={"icon-sm"}
            onClick={(event) => event.stopPropagation()}
            className="translate-y-2 opacity-0 transition-transform duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100"
          >
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
                {formatCurrency(remaining)}{" "}
                {isOverLimit ? "over limit" : "left"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <BudgetForm
        open={open}
        onOpenChange={handleOpenChange}
        budgetCategory={category}
        totalBudget={totalBudget}
      />
    </>
  )
}
