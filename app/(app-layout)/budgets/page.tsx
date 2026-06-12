import { BudgetsHeader } from "./_components/header"
import { BudgetGrid } from "./_components/budget-grid"
import { BudgetCategoriesProvider } from "./context/budget-context"
import { getBudgetsCategories } from "./actions"
import { getTransactionCategories } from "@/lib/supabase/queries/transaction"

export default async function BudgetsPage() {
  const [budgetCategoriesResult, transactionCategoriesResult] =
    await Promise.all([getBudgetsCategories(), getTransactionCategories()])

  return (
    <BudgetCategoriesProvider
      totalBudget={0}
      budgetCategories={budgetCategoriesResult.data ?? []}
      transactionCategories={transactionCategoriesResult.data ?? []}
    >
      <div>
        <BudgetsHeader />
        <div className="p-4">
          <BudgetGrid />
        </div>
      </div>
    </BudgetCategoriesProvider>
  )
}
