import { InformationCards } from "./information-cards"
import { BalanceTrend } from "./balance-trend"

export function DashboardLayout() {
  return (
    <div className="space-y-4">
      <InformationCards />
      <BalanceTrend />
    </div>
  )
}
