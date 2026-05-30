import { TableLoadingLayout } from "@/components/page-status/loading/table-loading-layout"

const ACCOUNTS_TABLE_COLUMNS = [
    { width: "w-24" },
    { width: "w-20" },
    { width: "w-14" },
    { variant: "switch" as const },
    { width: "w-28" },
    { width: "w-28" },
    { variant: "actions" as const },
] as const

export default function AccountsLoading() {
    return (
        <TableLoadingLayout
            columns={[...ACCOUNTS_TABLE_COLUMNS]}
        />
    )
}
