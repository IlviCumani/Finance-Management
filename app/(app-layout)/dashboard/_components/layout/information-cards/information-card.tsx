import {
  Stat,
  StatDescription,
  StatIndicator,
  StatLabel,
  StatSeparator,
  StatTrend,
  StatValue,
} from "@/components/ui/stat"

import { CalendarIcon, ArrowUp, ArrowDown } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"

type InformationCardProps = {
  title: string
  value: string
  change: number
  description: string
  icon: IconSvgElement
}

export function InformationCard({
  title,
  value,
  change,
  description,
  icon,
}: InformationCardProps) {
  const isPositive = change > 0
  const isNegative = change < 0
  return (
    <Stat>
      <StatLabel>{title}</StatLabel>
      <StatValue>{value}</StatValue>
      <StatIndicator
        variant="icon"
        color={isPositive ? "success" : isNegative ? "error" : "default"}
      >
        <HugeiconsIcon icon={icon} className="size-4" />
      </StatIndicator>
      <StatSeparator />
      <StatTrend trend={isPositive ? "up" : isNegative ? "down" : "neutral"}>
        <HugeiconsIcon
          icon={isPositive ? ArrowUp : isNegative ? ArrowDown : CalendarIcon}
          className={cn("size-4", !isPositive && !isNegative && "hidden")}
        />
        {change}% from last month
      </StatTrend>
      <StatDescription>{description}</StatDescription>
    </Stat>
  )
}
