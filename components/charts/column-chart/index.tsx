"use client"

import { Bar, BarChart as BC, CartesianGrid, XAxis, YAxis } from "recharts"
import {
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
import type { Margin } from "recharts/types/util/types"

interface ColumnChartProps {
  data: ChartData[]
  xFieldKey?: string
  showYAxis?: boolean
  showLegend?: boolean
  margin?: Margin
  height?: number
  icons?: showIconConfigType[]
  isStacked?: boolean
  colours?: string[] | Record<string, string>
  formattedYAxis?: (s: string) => string
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

export function ColumnChart({
  data = [],
  xFieldKey = "label",
  isStacked = false,
  showYAxis = false,
  colours = DEFAULT_COLOURS,
  margin = {
    left: 12,
    right: 12,
    top: 12,
    bottom: 12,
  },
  icons = [],
  height = 350,
  showLegend = false,
  formattedYAxis = (s: string) => `${s}`,
  formattedXAxis = (s: string) => `${s}`,
  className,
}: ColumnChartProps) {
  const allUniqueKeysInData: string[] = getAllUniqueKeysInData(data, xFieldKey)

  const chartData = getChartData(data, allUniqueKeysInData)

  const chartConfig = getChartConfig(allUniqueKeysInData, colours, icons)

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto w-full", className)}
      style={{
        height: height,
      }}
    >
      <BC accessibilityLayer data={chartData} margin={margin}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xFieldKey}
          tickLine={false}
          type="category"
          axisLine={false}
          tickMargin={8}
          tickFormatter={formattedXAxis}
          angle={-45}
          textAnchor="end"
          height={100}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          hide={!showYAxis}
          tickFormatter={formattedYAxis}
          type="number"
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {showLegend && allUniqueKeysInData.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {allUniqueKeysInData.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={chartConfig[key]?.color || `var(--chart-${key})`}
            stackId={isStacked ? "a" : undefined}
          />
        ))}
      </BC>
    </ChartContainer>
  )
}
