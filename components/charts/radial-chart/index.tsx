import { RadialBar, RadialBarChart, PolarGrid } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { getChartConfig, type ChartData } from "../chart-helpers"
import { cn } from "@/lib/utils"

const DEFAULT_COLOURS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]
interface RadialChartProps {
  data: ChartData[]
  labelKey?: string
  dataKey?: string
  height?: number
  colours?: string[] | Record<string, string>
  showGrid?: boolean
  outerRadius?: number
  innerRadius?: number
  className?: string
}

const EMPTY_STATE_DATA: ChartData[] = [
  { label: "No Data", value: 0 },
  { label: "No Data", value: 0 },
  { label: "No Data", value: 0 },
  { label: "No Data", value: 0 },
]

export function RadialChart({
  data = [],
  labelKey = "label",
  dataKey = "value",
  height = 350,
  colours = DEFAULT_COLOURS,
  showGrid = false,
  outerRadius = 130,
  innerRadius = 40,
  className,
}: RadialChartProps) {
  const chartData: ChartData[] = data.length > 0 ? data : EMPTY_STATE_DATA

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
      <RadialBarChart
        data={chartDataWithFill}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
      >
        {data.length > 0 && (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey={labelKey}
                indicator="line"
                labelFormatter={(_, payload) => {
                  return (
                    String(payload[0].dataKey).charAt(0).toUpperCase() +
                    String(payload[0].dataKey).slice(1)
                  )
                }}
              />
            }
          />
        )}

        {showGrid && <PolarGrid gridType="circle" />}
        <RadialBar dataKey={dataKey} background={!showGrid} stackId="a" />
      </RadialBarChart>
    </ChartContainer>
  )
}
