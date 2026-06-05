import { ChartDownIcon } from "@hugeicons/core-free-icons"
import { InformationCard } from "./information-card"

export function InformationCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InformationCard
        title="Total Users"
        value="100"
        change={10}
        description="Total users in the system"
        icon={ChartDownIcon}
      />
      <InformationCard
        title="Total Users"
        value="100"
        change={0}
        description="Total users in the system"
        icon={ChartDownIcon}
      />
      <InformationCard
        title="Total Users"
        value="100"
        change={40}
        description="Total users in the system"
        icon={ChartDownIcon}
      />
      <InformationCard
        title="Total Users"
        value="100"
        change={-3}
        description="Total users in the system"
        icon={ChartDownIcon}
      />
    </div>
  )
}
