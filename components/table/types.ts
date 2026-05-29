import { type Table } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    cellClassName?: string
  }
}
import { type DateRange } from "react-day-picker"
import { type JSX } from "react"

export interface TableProps<T> {
  expandedContent?: React.ReactNode | JSX.Element | ((row: T) => JSX.Element)
  stickyHeader?: boolean
  density?: "compact" | "standard" | "flexible"
  isLoading?: boolean
  className?: string
  doEmptyRows?: boolean
  table: Table<T>
  onRowClick?: (row: T) => void
  id?: string
  emptyText?: string
}

export interface PaginationProps<T> {
  table: Table<T>
}

export type MetaData = {
  currentPage?: number
  totalPages?: number
  totalCount?: number
}

export type NumberRange = { min?: number; max?: number }

export type FilterValue = string | DateRange | NumberRange

export type ColumnFilters = {
  [columnName: string]: FilterValue
}

export type SortingState = {
  sortBy: string
  direction: "asc" | "desc"
}
