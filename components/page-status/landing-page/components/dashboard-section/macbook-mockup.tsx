import Image from "next/image"
import type { StaticImageData } from "next/image"

type MacbookMockupProps = {
  image: StaticImageData
  alt: string
}

export function MacbookMockup({ image, alt }: MacbookMockupProps) {
  return (
    <div className="device device-macbook-pro relative z-0">
      <div className="device-frame">
        <Image
          src={image}
          alt={alt}
          width={1440}
          height={900}
          className="device-content h-full w-full object-cover"
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
