"use client"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Columns3, ChevronDown, SearchIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type Table } from "@tanstack/react-table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { RefreshCcw } from "@hugeicons/core-free-icons"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCodeToText } from "@/lib/format/text-format"
import { useTranslations } from "next-intl"

export function FilterColumnsDropdown<T>({
  table,
  align = "end",
}: {
  table: Table<T>
  align?: "start" | "end" | "center"
}) {
  const t = useTranslations("common")
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile(450)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <HugeiconsIcon icon={Columns3} />
          {!isMobile && t("columns")}{" "}
          <HugeiconsIcon icon={ChevronDown} className="ml-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            placeholder={t("search")}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <HugeiconsIcon
            icon={SearchIcon}
            className="absolute inset-y-0 left-2 my-auto h-4 w-4"
          />
        </div>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              column.getCanHide() &&
              column.id !== "actions" &&
              column.id !== "expand"
          )
          .map((column) => {
            if (
              searchQuery &&
              !column.id.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return null
            }
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(e) => e.preventDefault()}
              >
                {formatCodeToText(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            table.resetColumnVisibility()
            setSearchQuery("")
          }}
        >
          <HugeiconsIcon icon={RefreshCcw} /> {t("reset")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
