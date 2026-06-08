"use client"

import { CartesianGrid, Line, LineChart as LC, XAxis, YAxis } from "recharts"
import type { CurveType } from "recharts/types/shape/Curve"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  getAllUniqueKeysInData,
  getChartConfig,
  getChartData,
  type ChartData,
  type showIconConfigType,
} from "../chart-helpers"
import { cn } from "@/lib/utils"

interface LineChartProps {
  data: ChartData[]
  showYAxis?: boolean
  xFieldKey?: string
  showLegend?: boolean
  margin?: number
  height?: number
  icons?: showIconConfigType[]
  type?: CurveType
  formattedYAxis?: (s: string) => string
  colours?: string[] | Record<string, string>
  formattedXAxis?: (s: string) => string
  className?: string
}

const DEFAULT_COLOURS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function LineChart({
  data = [],
  xFieldKey = "label",
  showYAxis,
  showLegend,
  type = "natural",
  margin = 12,
  icons = [],
  height = 350,
  colours = DEFAULT_COLOURS,
  formattedYAxis = (s) => `${s}`,
  formattedXAxis = (s) => `${s}`,
  className,
}: LineChartProps) {
  const allUniqueKeysInData = getAllUniqueKeysInData(data, xFieldKey)

  const chartData = getChartData(data, allUniqueKeysInData)

  const chartConfig: ChartConfig = getChartConfig(
    allUniqueKeysInData,
    colours,
    icons
  )

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto w-full", className)}
      style={{
        height: height,
      }}
    >
      <LC
        accessibilityLayer
        data={chartData}
        margin={{
          left: margin,
          // top: 0,
          right: margin,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xFieldKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formattedXAxis}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          hide={!showYAxis}
          tickMargin={8}
          tickFormatter={formattedYAxis}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {showLegend && allUniqueKeysInData.length > 1 && (
          <ChartLegend
            content={
              <ChartLegendContent className="flex-wrap gap-2 *:basis-1/4 *:justify-center" />
            }
          />
        )}
        {allUniqueKeysInData.map((key: string) => (
          <Line
            key={key}
            dataKey={key}
            type={type}
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LC>
    </ChartContainer>
  )
}
LineChart.displayName = "LineChart"
