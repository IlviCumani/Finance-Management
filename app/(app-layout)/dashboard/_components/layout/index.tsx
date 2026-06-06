import { InformationCards } from "./information-cards"
import { BalanceTrend } from "./balance-trend"
import { ExpenseBreakdown } from "./expense-breakdown"

export function DashboardLayout() {
  return (
    <div className="space-y-4">
      <InformationCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BalanceTrend />
        <ExpenseBreakdown />
      </div>
    </div>
  )
}
