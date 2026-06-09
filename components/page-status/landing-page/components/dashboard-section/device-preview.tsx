import DashboardImage from "@/assets/temp-images/goku-blue.jpg"

import { DeviceGlow } from "./device-glow"
import { IphoneMockup } from "./iphone-mockup"
import { MacbookMockup } from "./macbook-mockup"

export function DevicePreview() {
  return (
    <div className="flex w-full justify-center overflow-hidden md:block md:overflow-visible">
      <div className="relative mx-auto h-[477px] w-[236px] overflow-hidden sm:h-[564px] sm:w-[278px] md:hidden">
        <div className="absolute top-0 left-1/2 origin-top -translate-x-1/2 scale-[0.55] sm:scale-[0.65]">
          <IphoneMockup image={DashboardImage} alt="Mobile Dashboard Preview" />
        </div>
      </div>

      <div className="relative hidden w-fit origin-top scale-90 md:block lg:scale-100">
        <DeviceGlow />
        <MacbookMockup image={DashboardImage} alt="Dashboard Preview" />
        <div className="absolute bottom-0 -left-3 z-10 origin-bottom-left scale-[0.38]">
          <IphoneMockup image={DashboardImage} alt="Mobile Dashboard Preview" />
        </div>
      </div>
    </div>
  )
}
