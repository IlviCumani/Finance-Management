import { TableLoadingLayout } from "@/components/page-status/loading/table-loading-layout"

const TRANSACTIONS_TABLE_COLUMNS = [
  { width: "w-24" },
  { width: "w-28" },
  { width: "w-28" },
  { variant: "actions" as const },
] as const

export default function TransactionsLoading() {
  return <TableLoadingLayout columns={[...TRANSACTIONS_TABLE_COLUMNS]} />
}
