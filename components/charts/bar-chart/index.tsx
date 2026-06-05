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

interface BarChartProps {
  data: ChartData[]
  yFieldKey?: string
  showXAxis?: boolean
  showLegend?: boolean
  margin?: number
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

export function BarChart({
  data = [],
  yFieldKey = "label",
  isStacked = false,
  showXAxis = false,
  colours = DEFAULT_COLOURS,
  margin = 12,
  icons = [],
  height = 350,
  showLegend = false,
  formattedYAxis = (s: string) => `${s}`,
  formattedXAxis = (s: string) => `${s}`,
}: BarChartProps) {
  const allUniqueKeysInData: string[] = getAllUniqueKeysInData(data, yFieldKey)

  const chartData = getChartData(data, allUniqueKeysInData)

  const chartConfig = getChartConfig(allUniqueKeysInData, colours, icons)

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full"
      style={{
        height: height,
      }}
    >
      <BC
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: margin,
          right: margin,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formattedYAxis}
          type="category"
          dataKey={yFieldKey}
        />

        <XAxis
          type="number"
          tickMargin={8}
          tickFormatter={formattedXAxis}
          tickLine={false}
          axisLine={false}
          hide={!showXAxis}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {showLegend && allUniqueKeysInData.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}

        {allUniqueKeysInData.map((key) => {
          return (
            <Bar
              key={key}
              dataKey={key}
              fill={chartConfig[key]?.color || `var(--chart-${key})`}
              stackId={isStacked ? "a" : undefined}
            />
          )
        })}
      </BC>
    </ChartContainer>
  )
}
