"use client"

import { Table } from "@/components/table"
import { useTable } from "@/components/table/use-table"
import { useEffect, useState } from "react"
import { getColumns } from "./get-columns"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"
import { TransactionCategoryForm } from "../transaction-category-form"
import { useTranslations } from "next-intl"

export function TransactionCategoryTable({
    categories,
}: {
    categories: Array<TransactionCategory>
}) {
    const t = useTranslations("settings.transactionCategories.table")
    const { table, setTableColumns, setTableData } = useTable<TransactionCategory>()
    const [editCategory, setEditCategory] = useState<TransactionCategory | undefined>(undefined)
    const [open, setOpen] = useState(false)

    function handleEditCategory(category: TransactionCategory) {
        setEditCategory(category)
        setOpen(true)
    }

    useEffect(() => {
        const columns = getColumns({
            onEdit: (category) => {
                handleEditCategory(category)
            },
            t,
        })
        setTableColumns(columns)
    }, [setTableColumns, t])

    useEffect(() => {
        setTableData(categories)
    }, [setTableData, categories])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Table.TableSearch table={table} />
                <Table.FilterColumnsDropdown table={table} />
            </div>
            <Table table={table} />
            <TransactionCategoryForm
                open={open}
                onOpenChange={setOpen}
                category={editCategory}
            />
        </div>
    )
}
