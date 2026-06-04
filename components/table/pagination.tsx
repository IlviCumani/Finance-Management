"use client"

import { Button } from "../ui/button"
import { PaginationProps } from "./types"
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { ChevronLeftIcon, ChevronRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

export function Pagination<T>({ table }: PaginationProps<T>) {
  const t = useTranslations("common")

  return (
    <div className="flex w-full items-center justify-between gap-2 border-t p-4">
      <div className="flex items-center gap-2">
        <Label className="hidden whitespace-nowrap sm:block">
          {t("rowsPerPage")}
        </Label>
        <Select
          onValueChange={(rowsPerPage) => table.setPageSize(+rowsPerPage)}
          value={table.getState().pagination.pageSize.toString()}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getRowCount()
          )}{" "}
          {t("of")} {table.getRowCount()}
        </span>
        <PaginationUI>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label={t("goToPreviousPage")}
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label={t("goToNextPage")}
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </PaginationUI>
      </div>
    </div>
  )
}
