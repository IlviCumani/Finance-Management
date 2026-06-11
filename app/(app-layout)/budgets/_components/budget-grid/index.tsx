import { BudgetCard } from "./budget-card"
import { GridRepeat } from "@/components/ui/grid-layout"
import { TotalBudgetCard } from "./total-budget-card"
import { AddBudgetCategoryCard } from "./add-budget-category-card"
import type { BudgetCategory } from "@/types/budget/budget-types"

type BudgetGridProps = {
  totalBudget: number
  budgetCategories: Array<BudgetCategory>
}

export function BudgetGrid({ totalBudget, budgetCategories }: BudgetGridProps) {
  return (
    <div className="space-y-4">
      <TotalBudgetCard
        totalBudget={totalBudget}
        budgetCategories={budgetCategories}
      />
      <GridRepeat>
        {budgetCategories.map((category) => (
          <BudgetCard key={category.id} category={category} />
        ))}
        <AddBudgetCategoryCard />
      </GridRepeat>
    </div>
  )
}
