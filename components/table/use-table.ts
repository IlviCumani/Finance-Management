import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"

export function useTable<T>() {
  const [tableData, setTableData] = useState<Array<T>>([])
  const [tableColumns, setTableColumns] = useState<Array<ColumnDef<T>>>([])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      columnPinning: {
        left: ["expand", "index"],
        right: ["actions"],
      },
    },
  })

  return {
    table,
    setTableData,
    setTableColumns,
  }
}
