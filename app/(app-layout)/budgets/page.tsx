import { BudgetsHeader } from "./_components/header"
import { BudgetGrid } from "./_components/budget-grid"
import { BudgetCategoriesProvider } from "./context/budget-context"
import { getBudgetsCategories } from "./actions"
import { getTransactionCategories } from "@/lib/supabase/queries/transaction"
import { getLoggedUserProfile } from "@/lib/supabase/queries/user-profile"
import { toast } from "sonner"
import { getTranslations } from "next-intl/server"

export default async function BudgetsPage() {
  const t = await getTranslations("budgets.page")
  const [
    budgetCategoriesResult,
    transactionCategoriesResult,
    loggedUserProfileResult,
  ] = await Promise.all([
    getBudgetsCategories(),
    getTransactionCategories(),
    getLoggedUserProfile(),
  ])

  if (budgetCategoriesResult.error) {
    toast.error(budgetCategoriesResult.error || t("fetchError"))
  }

  if (transactionCategoriesResult.error) {
    toast.error(transactionCategoriesResult.error || t("fetchError"))
  }

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
