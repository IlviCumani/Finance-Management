import DashboardImage from "@/assets/temp-images/goku-blue.jpg"

import { DeviceGlow } from "./device-glow"
import { MacbookMockup } from "./macbook-mockup"

export function DevicePreview() {
  return (
    <div className="flex w-full justify-center overflow-hidden md:block md:overflow-visible">
      <div className="relative w-fit origin-center scale-50 sm:scale-[0.65] md:origin-top md:scale-90 lg:scale-100">
        <DeviceGlow />
        <MacbookMockup image={DashboardImage} alt="Dashboard Preview" />
      </div>
    </div>
  )
}
