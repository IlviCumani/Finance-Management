import { type ChartConfig } from "@/components/ui/chart"
import React from "react"
import { formatCodeToText as formatText } from "@/lib/format/text-format"

type ChartData = {
  [x: string]: string | number | React.ComponentType | undefined
}

type DataItem = Record<
  string,
  number | string | undefined | React.ComponentType
>

type showIconConfigType = {
  dataKey: string
  icon: React.ComponentType
  color?: string
}

const getAllUniqueKeysInData = (
  data: ChartData[] = [],
  xFieldKey: string = "label"
): string[] => {
  return data.reduce((acc: string[], item) => {
    Object.keys(item).forEach((key) => {
      if (
        !acc.includes(key) &&
        key !== xFieldKey &&
        typeof item[key] === "number"
      ) {
        acc.push(key)
      }
    })
    return acc
  }, [])
}

const getChartData = (
  data: ChartData[] = [],
  allUniqueKeysInData: string[]
) => {
  return data.map((item) => {
    return {
      ...item,
      ...allUniqueKeysInData.reduce((acc: DataItem, key: string) => {
        acc[key] = item[key] ?? 0
        return acc
      }, {}),
    }
  })
}

const getChartConfig = (
  allUniqueKeysInData: string[],
  colours: string[] | Record<string, string>,
  icons: showIconConfigType[] = []
): ChartConfig => {
  return allUniqueKeysInData.reduce(
    (acc: ChartConfig, key: string, index: number) => {
      acc[key] = {
        label: formatText(key),
        color: Array.isArray(colours)
          ? colours[index % colours.length]
          : colours[key] || `var(--chart-${index + 1})`,
        icon: icons.find((icon) => icon.dataKey === key)?.icon || undefined,
      }
      return acc
    },
    {} as ChartConfig
  )
}

export { getAllUniqueKeysInData, getChartData, getChartConfig }
export type { ChartData, showIconConfigType, DataItem }
