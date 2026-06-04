import { TransactionsHeader } from "./_components/header"
import { TransactionTable } from "./_components/transaction-table"
import { getTransactions } from "./actions"
import { toast } from "sonner"
import { getTranslations } from "next-intl/server"
import { getAccounts } from "@/lib/supabase/queries/account"
import { getTransactionCategories } from "../settings/transaction-categories/actions"

export default async function TransactionsPage() {
  const t = await getTranslations("transactions.page")
  const { data, error } = await getTransactions()
  const { data: accounts } = await getAccounts()
  const { data: transactionCategories } = await getTransactionCategories()

  if (error) {
    throw new Error(error)
    // toast.success(error || t("fetchError"))
  }

  return (
    <div>
      <TransactionsHeader
        accounts={accounts ?? []}
        transactionCategories={transactionCategories ?? []}
      />
      <div className="p-4">
        <TransactionTable
          transactions={data ?? []}
          accounts={accounts ?? []}
          transactionCategories={transactionCategories ?? []}
        />
      </div>
    </div>
  )
}
