import { InformationCards } from "./information-cards"
import { BalanceTrend } from "./balance-trend"
import { ExpenseBreakdown } from "./expense-breakdown"
import { MonthlyComparison } from "./monthly-comparison"
import { RecurringSubscriptions } from "./recurring-subscriptions"
import { getDashboardData } from "../../actions"

export async function DashboardLayout() {
  const { expenseBreakdown } = await getDashboardData()
  return (
    <div className="space-y-4">
      <InformationCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BalanceTrend />
        <ExpenseBreakdown data={expenseBreakdown ?? {}} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MonthlyComparison />
        <RecurringSubscriptions />
      </div>
    </div>
  )
}
