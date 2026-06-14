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
import { confirm } from "@/components/ui/confirmer"
import { useBudgetContext } from "../../context/budget-context"
import { deleteBudgetsCategory } from "../../actions"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

type BudgetCardProps = {
  category: BudgetCategory
}

export function BudgetCard({ category }: BudgetCardProps) {
  const t = useTranslations("budgets.card")
  const { totalBudget } = useBudgetContext()
  const [open, setOpen] = useState(false)
  const skipOpenRef = useRef(false)
  const { name, description, amount, budgetLimit } = category
  const utilization = budgetLimit > 0 ? (amount / budgetLimit) * 100 : 0
  const remaining = budgetLimit - amount
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

  async function handleDelete() {
    const { error } = await deleteBudgetsCategory(category.id)
    if (error) {
      toast.error(error, {
        position: "top-right",
      })
    } else {
      toast.success(t("deleteSuccess"), {
        position: "top-right",
      })
    }
  }

  function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    confirm({
      title: t("deleteTitle"),
      description: t("deleteDescription"),
    }).then((confirmed) => {
      if (confirmed) {
        handleDelete()
      }
    })
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
            onClick={handleDeleteClick}
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
                / {formatCurrency(budgetLimit)}
              </span>
            </div>
            <div className="space-x-1">
              <span className="text-muted-foreground">
                {t("percentUsed", { percent: Math.round(utilization) })}
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
                {t("nearLimit")}
              </ColorBadge>
            )}
            {isOverLimit && (
              <ColorBadge color="red">
                <HugeiconsIcon icon={InformationCircleIcon} />
                {t("overLimit")}
              </ColorBadge>
            )}
            <div className="ml-auto">
              <span>
                {formatCurrency(remaining)}{" "}
                {isOverLimit ? t("overLimitAmount") : t("left")}
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
