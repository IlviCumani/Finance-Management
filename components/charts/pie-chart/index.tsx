import { Pie, PieChart as PC } from "recharts"
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
} from "../chart-helpers"
import { cn } from "@/lib/utils"

interface PieChartProps {
  data: ChartData[]
  labelKey?: string
  showLegend?: boolean
  height?: number
  colours?: string[] | Record<string, string>
  isDonut?: boolean
  baseOuterRadius?: number
  baseRingThickness?: number
  className?: string
}

const BASE_OUTER_RADIUS = 130
const RING_THICKNESS = 40

const DEFAULT_COLOURS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]
export function PieChart({
  data = [],
  labelKey = "label",
  showLegend,
  height = 350,
  isDonut = false,
  baseOuterRadius = BASE_OUTER_RADIUS,
  baseRingThickness = RING_THICKNESS,
  colours = DEFAULT_COLOURS,
  className,
}: PieChartProps) {
  const allUniqueKeysInData = getAllUniqueKeysInData(data, labelKey)

  const chartData = getChartData(data, allUniqueKeysInData)

  const allUniqueLabels: string[] = data.map(
    (item: ChartData) => item[labelKey] as string
  )

  const chartConfig: ChartConfig = getChartConfig(allUniqueLabels, colours)

  const chartDataWithFill = chartData.map((item: ChartData) => ({
    ...item,
    fill: chartConfig[item[labelKey] as string]?.color,
  }))

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto w-full", className)}
      style={{
        height: height,
      }}
    >
      <PC>
        {allUniqueKeysInData.map((key: string) => {
          return (
            <ChartTooltip
              key={key}
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelKey={key}
                  nameKey={labelKey}
                  labelFormatter={(_, payload) => {
                    return (
                      String(payload[0].dataKey).charAt(0).toUpperCase() +
                      String(payload[0].dataKey).slice(1)
                    )
                  }}
                />
              }
            />
          )
        })}
        {showLegend && allUniqueKeysInData.length < 2 && (
          <ChartLegend
            content={<ChartLegendContent nameKey={labelKey} />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
          />
        )}
        {allUniqueKeysInData.map((key: string, index: number) => {
          const isLastRing = index === allUniqueKeysInData.length - 1
          const outerRadius = baseOuterRadius - index * baseRingThickness
          const innerRadius = outerRadius - baseRingThickness + 5

          return (
            <Pie
              key={key}
              data={chartDataWithFill}
              dataKey={key}
              nameKey={labelKey}
              outerRadius={outerRadius}
              innerRadius={isLastRing && !isDonut ? 0 : innerRadius}
            />
          )
        })}
      </PC>
    </ChartContainer>
  )
}
