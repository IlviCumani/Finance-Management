// import UnderConstruction from "@/components/page-status/under-development"
import { DashboardHeader } from "./_components/header"
import { DashboardLayout } from "./_components/layout"

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="p-4">
        {/* <UnderConstruction /> */}
        <DashboardLayout />
      </div>
    </div>
  )
}
