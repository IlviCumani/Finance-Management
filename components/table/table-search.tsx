"use client"

import { Table } from "@tanstack/react-table"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { SearchIcon, SmileIcon, X } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { EmojiPopover } from "@/components/emoji-popover"

export function TableSearch<T>({
  table,
  className,
  withEmoji,
}: {
  table: Table<T>
  className?: string
  withEmoji?: boolean
}) {
  const t = useTranslations("common")
  const [searchQuery, setSearchQuery] = useState("")
  const [lastSearchQuery, setLastSearchQuery] = useState("")

  function handleApplyFilter() {
    table.setGlobalFilter(searchQuery.trim())
    setLastSearchQuery(searchQuery)
  }

  function handleClearFilter() {
    setSearchQuery("")
    table.setGlobalFilter("")
    setLastSearchQuery("")
  }

  return (
    <InputGroup className={cn("max-w-xs", className)}>
      <InputGroupInput
        placeholder={t("search")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleApplyFilter()
          }
        }}
      />

      <EmojiPopover onChange={(emoji) => setSearchQuery(emoji)}>
        <InputGroupAddon align="inline-end" hidden={!withEmoji}>
          <InputGroupButton variant="outline" size="icon-xs">
            <HugeiconsIcon icon={SmileIcon} />
          </InputGroupButton>
        </InputGroupAddon>
      </EmojiPopover>

      {searchQuery === "" || searchQuery !== lastSearchQuery ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={handleApplyFilter}
            variant={"default"}
            type="button"
            size="icon-xs"
          >
            <HugeiconsIcon icon={SearchIcon} />
          </InputGroupButton>
        </InputGroupAddon>
      ) : (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={handleClearFilter}
            variant={"destructive"}
            type="button"
            size="icon-xs"
          >
            <HugeiconsIcon icon={X} />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
