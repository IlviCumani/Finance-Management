"use client"

import { Table } from "@/components/table"
import { useTable } from "@/components/table/use-table"
import { useEffect, useState } from "react"
import { getColumns } from "./get-columns"
import { Account } from "@/types/account/account-types"
import { AccountsForm } from "../accounts-form"
import { useTranslations } from "next-intl"

export function AccountTable({ accounts }: { accounts: Array<Account> }) {
  const t = useTranslations("accounts.table")
  const tForm = useTranslations("accounts.form")
  const { table, setTableColumns, setTableData } = useTable<Account>()
  const [editAccount, setEditAccount] = useState<Account | undefined>(undefined)
  const [open, setOpen] = useState(false)

  function handleEditAccount(account: Account) {
    setEditAccount(account)
    setOpen(true)
  }

  useEffect(() => {
    const columns = getColumns({
      onEdit: (account) => {
        handleEditAccount(account)
      },
      t,
      tForm,
    })
    setTableColumns(columns)
  }, [setTableColumns, t, tForm])

  useEffect(() => {
    setTableData(accounts)
  }, [setTableData, accounts])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Table.TableSearch table={table} />
        <Table.FilterColumnsDropdown table={table} />
      </div>
      <Table table={table} />
      <AccountsForm open={open} onOpenChange={setOpen} account={editAccount} />
    </div>
  )
}
