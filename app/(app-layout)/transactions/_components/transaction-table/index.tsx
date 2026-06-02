"use client"

import { Table } from "@/components/table"
import { useTable } from "@/components/table/use-table"
import { useEffect, useState } from "react"
import { getColumns } from "./get-columns"
import { Transaction } from "@/types/transaction/transaction-types"
import { TransactionsForm } from "../transactions-form"
import { useTranslations } from "next-intl"
import { Account } from "@/types/account/account-types"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"

type TransactionTableProps = {
    transactions: Array<Transaction>
    accounts: Array<Account>
    transactionCategories: Array<TransactionCategory>
}

export function TransactionTable({ transactions, accounts, transactionCategories }: TransactionTableProps) {
    const t = useTranslations("transactions.table")
    const { table, setTableColumns, setTableData } = useTable<Transaction>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const columns = getColumns({
            t,
        })
        setTableColumns(columns)
    }, [setTableColumns, t])

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
                accounts={accounts}
                onOpenChange={setOpen}
                transactionCategories={transactionCategories}
            />
        </div>
    )
}
