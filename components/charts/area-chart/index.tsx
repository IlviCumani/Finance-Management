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

import { Area, AreaChart as AC, CartesianGrid, YAxis, XAxis } from "recharts"
import type { CurveType } from "recharts/types/shape/Curve"
import { cn } from "@/lib/utils"
import type { Margin } from "recharts/types/util/types"

interface AreaChartProps {
  data: ChartData[]
  showYAxis?: boolean
  xFieldKey?: string
  showLegend?: boolean
  margin?: Margin
  type?: CurveType
  height?: number
  isExpanded?: boolean
  isGradient?: boolean
  isStacked?: boolean
  icons?: showIconConfigType[]
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

export function AreaChart({
  data = [],
  xFieldKey = "label",
  type = "monotone" as CurveType,
  showYAxis = false,
  showLegend = false,
  isStacked = true,
  isExpanded = false,
  isGradient = true,
  margin = {
    left: 12,
    right: 12,
    top: 12,
    bottom: 12,
  },
  height = 350,
  icons = [],
  colours = DEFAULT_COLOURS,
  formattedYAxis = (s) => `${s}`,
  formattedXAxis = (s) => `${s}`,
  className,
}: AreaChartProps) {
  const allUniqueKeysInData = getAllUniqueKeysInData(data, xFieldKey)

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
      <AC
        accessibilityLayer
        data={chartData}
        margin={margin}
        stackOffset={isExpanded ? "expand" : "none"}
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
          tickMargin={8}
          tickFormatter={formattedYAxis}
          hide={!showYAxis}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {isGradient && renderGradients(allUniqueKeysInData, chartConfig)}
        {showLegend && allUniqueKeysInData.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {allUniqueKeysInData.map((key: string, index: number) => (
          <Area
            key={key}
            dataKey={key}
            type={type}
            stroke={chartConfig[key].color}
            fill={isGradient ? `url(#fill${key})` : chartConfig[key].color}
            fillOpacity={0.4}
            stackId={isStacked ? "a" : `stack-${index}`}
          />
        ))}
      </AC>
    </ChartContainer>
  )
}

function renderGradients(
  allUniqueKeysInData: string[],
  chartConfig: ChartConfig
) {
  return (
    <defs>
      {allUniqueKeysInData.map((key: string) => (
        <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="5%"
            stopColor={chartConfig[key].color}
            stopOpacity={0.8}
          />
          <stop
            offset="95%"
            stopColor={chartConfig[key].color}
            stopOpacity={0.1}
          />
        </linearGradient>
      ))}
    </defs>
  )
}
