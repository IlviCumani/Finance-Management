'use client'

import {
    Table as TableUI,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TableProps } from "./types"
import {
    Column,
    flexRender,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Pagination } from "./pagination"
import { FilterColumnsDropdown } from "./filter-column-dropdown"
import { TableSearch } from "./table-search"
import { useTable } from "./use-table"
import { useTranslations } from "next-intl"
import { CSSProperties } from "react"

export function Table<T>({ table, id, density = "standard" }: TableProps<T>) {
    const t = useTranslations("common")



    function getPinnedColStyle(column: Column<T>, isHeader: boolean): CSSProperties {
        const isPinned = column.getIsPinned()

        return {
            left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
            right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
            opacity: 1,
            position: isPinned ? "sticky" : "relative",
            width: column.getSize(),
            zIndex: isPinned ? 1 : 0,
            backgroundColor: isPinned && !isHeader ? "var(--background)" : "transparent",
        }
    }

    return <div className="overflow-hidden rounded-lg border">
        <TableUI id={id} className={cn({
            "[&_td]:py-2 [&_th]:py-1": density === "compact",
            "[&_td]:py-3 [&_th]:py-2": density === "standard",
            "[&_td]:py-4 [&_th]:py-2": density === "flexible",
        })}>
            <TableHeader className="font-bold bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id} className=" my-2" style={getPinnedColStyle(header.column, true)} >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody className="p-1 overflow-y-hidden">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={cell.column.columnDef.meta?.cellClassName}
                                    style={getPinnedColStyle(cell.column, false)}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                            {t("noResults")}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </TableUI>
        <Pagination table={table} />
    </div>

}


Table.FilterColumnsDropdown = FilterColumnsDropdown
Table.TableSearch = TableSearch
Table.useTable = useTable
