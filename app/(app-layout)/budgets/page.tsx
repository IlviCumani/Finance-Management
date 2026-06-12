import { BudgetsHeader } from "./_components/header"
import { BudgetGrid } from "./_components/budget-grid"
import { BudgetCategoriesProvider } from "./context/budget-context"
import { getBudgetsCategories } from "./actions"
import { getTransactionCategories } from "@/lib/supabase/queries/transaction"
import { getLoggedUserProfile } from "@/lib/supabase/queries/user-profile"

export default async function BudgetsPage() {
  const [
    budgetCategoriesResult,
    transactionCategoriesResult,
    loggedUserProfileResult,
  ] = await Promise.all([
    getBudgetsCategories(),
    getTransactionCategories(),
    getLoggedUserProfile(),
  ])

  return (
    <BudgetCategoriesProvider
      totalBudget={loggedUserProfileResult.loggedUserDetails?.total_budget ?? 0}
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
