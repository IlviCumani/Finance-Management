import { TableLoadingLayout } from "@/components/page-status/loading/table-loading-layout";

const TRANSACTION_CATEGORY_TABLE_COLUMNS = [
    { width: "w-24" },
    { width: "w-32" },
    { width: "w-28" },
    { width: "w-28" },
    { variant: "actions" as const },
] as const

export default function TransactionCategoriesLoading() {
    return (
        <TableLoadingLayout
            columns={[...TRANSACTION_CATEGORY_TABLE_COLUMNS]}
        />
    )
}