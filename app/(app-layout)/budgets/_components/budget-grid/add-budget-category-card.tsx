"use client"

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { BudgetForm } from "../budget-category-form"
import { useBudgetContext } from "../../context/budget-context"

export function AddBudgetCategoryCard() {
  const { totalBudget } = useBudgetContext()
  const [open, setOpen] = useState(false)
  const t = useTranslations("budgets.card")

  return (
    <>
      <Card onClick={() => setOpen(true)} className="min-h-56">
        <CardContent className="flex h-full flex-col items-center justify-center gap-2">
          <HugeiconsIcon icon={PlusSignCircleIcon} className="size-10" />
          <CardDescription className="text-sm font-medium">
            {t("addBudgetCategory")}
          </CardDescription>
        </CardContent>
      </Card>
      <BudgetForm
        open={open}
        onOpenChange={setOpen}
        totalBudget={totalBudget}
      />
    </>
  )
}
