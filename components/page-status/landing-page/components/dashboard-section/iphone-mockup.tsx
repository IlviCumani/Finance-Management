import Image from "next/image"
import type { StaticImageData } from "next/image"

type IphoneMockupProps = {
  image: StaticImageData
  alt: string
}

export function IphoneMockup({ image, alt }: IphoneMockupProps) {
  return (
    <div className="device device-iphone-14-pro">
      <div className="device-frame">
        <Image
          src={image}
          alt={alt}
          width={390}
          height={830}
          className="device-screen object-cover"
        />
      </div>

      <div className="device-stripe" />
      <div className="device-header" />
      <div className="device-sensors" />
      <div className="device-btns" />
      <div className="device-power" />
    </div>
  )
}
