"use client"

import {
  Stat,
  StatDescription,
  StatIndicator,
  StatLabel,
  StatSeparator,
  StatTrend,
  StatValue,
} from "@/components/ui/stat"
import { formatNumberForUI } from "@/lib/format/number-format"

import { CalendarIcon, ArrowUp, ArrowDown } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { Progress, MultiProgress } from "@/components/ui/progress"

type InformationCardProps = {
  title: string
  value: string | number[] | { value: number; label?: string }[]
  type?: "number" | "progress" | "multiProgress"
  change?: number
  description: string
  icon: IconSvgElement
}

export function InformationCard({
  title,
  value,
  change,
  type = "number",
  description,
  icon,
}: InformationCardProps) {
  const isChange = change !== undefined && change !== null
  const isPositive = isChange && change > 0
  const isNegative = isChange && change < 0

  const renderValues = (type: "number" | "progress" | "multiProgress") => {
    switch (type) {
      case "number":
        if (Array.isArray(value)) {
          return <StatValue>--</StatValue>
        }
        return <StatValue>{value}</StatValue>
      case "progress":
        return (
          <Progress value={Number(value)} className="col-span-2 h-2 w-full" />
        )
      case "multiProgress":
        if (Array.isArray(value)) {
          return (
            <div className="col-span-2">
              <MultiProgress
                value={value as { value: number; label?: string }[]}
                className="col-span-2 h-2 w-full"
                renderTooltip={(segment) => {
                  if (!segment.label) {
                    return `${segment.value}%`
                  }
                  return `${segment.label}: ${segment.value}%`
                }}
              />
            </div>
          )
        }
        return (
          <Progress value={Number(value)} className="col-span-2 h-2 w-full" />
        )
    }
  }

  return (
    <Stat>
      <StatLabel className="mb-2">{title}</StatLabel>
      {renderValues(type)}
      <StatIndicator
        variant="icon"
        color={
          isPositive
            ? "success"
            : isNegative
              ? "error"
              : isChange
                ? "default"
                : "info"
        }
      >
        <HugeiconsIcon icon={icon} className="size-4" />
      </StatIndicator>
      <StatSeparator />

      <StatTrend
        trend={isPositive ? "up" : isNegative ? "down" : "neutral"}
        hidden={!isChange}
      >
        <HugeiconsIcon
          icon={isPositive ? ArrowUp : isNegative ? ArrowDown : CalendarIcon}
          className={cn("size-4", !isPositive && !isNegative && "hidden")}
        />
        {formatNumberForUI(change ?? 0)}% from last month
      </StatTrend>
      <StatDescription>{description}</StatDescription>
    </Stat>
  )
}
