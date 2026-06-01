"use client"

import { Table } from "@/components/table"
import { useTable } from "@/components/table/use-table"
import { useEffect, useState } from "react"
import { getColumns } from "./get-columns"
import { Transaction } from "@/types/transaction/transaction-types"
import { TransactionsForm } from "../transactions-form"
import { useTranslations } from "next-intl"

export function TransactionTable({ transactions }: { transactions: Array<Transaction> }) {
    const t = useTranslations("transactions.table")
    const tForm = useTranslations("transactions.form")
    const { table, setTableColumns, setTableData } = useTable<Transaction>()
    const [editTransaction, setEditTransaction] = useState<Transaction | undefined>(undefined)
    const [open, setOpen] = useState(false)

    function handleEditTransaction(transaction: Transaction) {
        setEditTransaction(transaction)
        setOpen(true)
    }

    useEffect(() => {
        const columns = getColumns({
            onEdit: (transaction) => {
                handleEditTransaction(transaction)
            },
            t,
            tForm,
        })
        setTableColumns(columns)
    }, [setTableColumns, t, tForm])

    useEffect(() => {
        setTableData(transactions)
    }, [setTableData, transactions])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Table.TableSearch table={table} />
                <Table.FilterColumnsDropdown table={table} />
            </div>
            <Table table={table} />
            <TransactionsForm
                open={open}
                onOpenChange={setOpen}
                transaction={editTransaction}
            />
        </div>
    )
}
