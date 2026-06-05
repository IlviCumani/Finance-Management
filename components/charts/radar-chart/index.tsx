import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RC } from "recharts"
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

interface RadarChartProps {
  data: ChartData[]
  polarKey?: string
  showLegend?: boolean
  opacity?: number
  height?: number
  colours?: string[] | Record<string, string>
  withDot?: boolean
  gridType?: "circle" | "polygon"
  radialLines?: boolean
  gridFilled?: boolean | string
  formattedAxis?: (s: string) => string
  fillColorIndex?: number
  icons?: showIconConfigType[]
  className?: string
}

const DEFAULT_COLOURS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function RadarChart({
  data = [],
  polarKey = "label",
  showLegend,
  opacity = 0.6,
  height = 350,
  withDot = false,
  gridType = "polygon",
  radialLines = true,
  gridFilled = false,
  formattedAxis = (s: string) => `${s}`,
  colours = DEFAULT_COLOURS,
  fillColorIndex = 0,
  icons = [],
  className,
}: RadarChartProps) {
  const allUniqueKeysInData = getAllUniqueKeysInData(data, polarKey)

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
      style={
        {
          height: height,
          "--radar-chart-fill":
            chartConfig[
              allUniqueKeysInData[fillColorIndex % allUniqueKeysInData.length]
            ]?.color,
        } as React.CSSProperties
      }
    >
      <RC data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey={polarKey} tickFormatter={formattedAxis} />
        <PolarGrid
          gridType={gridType}
          radialLines={radialLines}
          className={cn(
            gridFilled
              ? typeof gridFilled === "string"
                ? gridFilled
                : "fill-[var(--radar-chart-fill)]/10"
              : "fill-transparent"
          )}
        />
        {showLegend && (
          <ChartLegend className="mt-8" content={<ChartLegendContent />} />
        )}
        {allUniqueKeysInData.map((key: string) => {
          return (
            <Radar
              dataKey={key}
              key={key}
              fill={chartConfig[key].color}
              fillOpacity={opacity}
              strokeWidth={opacity ? 0 : 2}
              stroke={chartConfig[key].color}
              dot={
                withDot && {
                  r: 4,
                  fillOpacity: 1,
                }
              }
            />
          )
        })}
      </RC>
    </ChartContainer>
  )
}
