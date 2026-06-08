import { DashboardContent } from "./content"
import { DevicePreview } from "./device-preview"

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="overflow-hidden px-6 py-12 md:px-12 md:py-24 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
          <DashboardContent />
          <DevicePreview />
        </div>
      </div>
    </section>
  )
}
