import { DashboardContent } from "./content"
import { DevicePreview } from "./device-preview"

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="overflow-hidden px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <DashboardContent />
          <DevicePreview />
        </div>
      </div>
    </section>
  )
}
