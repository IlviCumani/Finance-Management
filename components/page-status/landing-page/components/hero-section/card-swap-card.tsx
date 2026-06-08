import { forwardRef } from "react"
import {
  Card,
  CardProps,
} from "@/components/page-status/landing-page/components/ui/card-swap"
import Image from "next/image"

export const CardSwapCard = forwardRef<
  HTMLDivElement,
  CardProps & { imageurl: string }
>((props, ref) => (
  <Card
    ref={ref}
    {...props}
    className={`overflow-hidden ${props.className ?? ""}`.trim()}
  >
    <div className="flex gap-2 bg-gray-900 p-3">
      <div className="h-3 w-3 rounded-full bg-red-500" />
      <div className="h-3 w-3 rounded-full bg-yellow-500" />
      <div className="h-3 w-3 rounded-full bg-green-500" />
    </div>
    <div className="relative h-full w-full">
      <Image
        src={props.imageurl}
        alt="Under development"
        fill
        sizes="700px"
        quality={90}
        className="object-cover"
      />
    </div>
  </Card>
))
CardSwapCard.displayName = "CardSwapCard"
