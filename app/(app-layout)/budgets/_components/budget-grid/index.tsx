"use client"

import { BudgetCard } from "./budget-card"
import { GridRepeat } from "@/components/ui/grid-layout"
import { TotalBudgetCard } from "./total-budget-card"
import { AddBudgetCategoryCard } from "./add-budget-category-card"
import { useBudgetContext } from "../../context/budget-context"

export function BudgetGrid() {
  const { budgetCategories } = useBudgetContext()
  return (
    <div className="space-y-4">
      <TotalBudgetCard budgetCategories={budgetCategories} />
      <GridRepeat>
        {budgetCategories.map((category) => (
          <BudgetCard key={category.id} category={category} />
        ))}
        <AddBudgetCategoryCard />
      </GridRepeat>
    </div>
  )
}
