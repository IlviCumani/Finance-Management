"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-3 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

interface MultiProgressProps extends Omit<
  React.ComponentProps<typeof ProgressPrimitive.Root>,
  "value"
> {
  value:
    | number[]
    | {
        value: number
        label?: string
        color?: string
      }[]
  className?: string
  renderTooltip?: (segment: Segment) => string
  showTotal?: boolean
}

type Segment = {
  value: number
  label?: string
  color?: string
}

function MultiProgress({
  className,
  value = [],
  renderTooltip = (segment: Segment) => `${segment.value}%`,
  showTotal = false,
  ...props
}: MultiProgressProps) {
  const segments: Segment[] =
    typeof value[0] === "number"
      ? (value as number[]).map((val, i) => ({
          value: val,
          color: `var(--chart-${(i % 5) + 1})`,
        }))
      : (value as { value: number; label?: string; color?: string }[])

  const totalValue = segments.reduce((acc, segment) => {
    if (acc + segment.value > 100) {
      return 100
    }
    return acc + segment.value
  }, 0)

  return (
    <div className={cn("flex items-center gap-2")}>
      <ProgressPrimitive.Root
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        {...props}
      >
        {segments.map((segment: Segment, idx) => {
          const left = segments
            .slice(0, idx)
            .reduce((acc, s) => acc + s.value, 0)
          const width = segment.value

          return (
            <TooltipProvider delayDuration={0} key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ProgressPrimitive.Indicator
                    key={idx}
                    className="absolute h-full transition-all"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor:
                        segment.color || `var(--chart-${(idx % 5) + 1})`,
                    }}
                  />
                </TooltipTrigger>

                <TooltipContent
                  align="end"
                  hideArrow
                  style={{ backgroundColor: segment.color }}
                  side="top"
                  sideOffset={10}
                  className="font-bold"
                >
                  {renderTooltip(segment)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </ProgressPrimitive.Root>
      {showTotal && (
        <span className="text-sm whitespace-nowrap">{`${totalValue}%`}</span>
      )}
    </div>
  )
}
MultiProgress.displayName = "MultiProgress"

export { Progress, MultiProgress }
