import { TransactionsHeader } from "./_components/header"
import { TransactionTable } from "./_components/transaction-table"
import { getTransactions } from "./actions"
import { getAccounts } from "@/lib/supabase/queries/account"
import { getTransactionCategories } from "@/lib/supabase/queries/transaction"

export default async function TransactionsPage() {
  const { data, error } = await getTransactions()
  const { data: accounts } = await getAccounts()
  const { data: transactionCategories } = await getTransactionCategories()
  const transactionCategoriesOptions = transactionCategories?.filter(
    (category) => category.type !== "subscription"
  )

  if (error) {
    console.error(error)
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <TransactionsHeader
        accounts={accounts ?? []}
        transactionCategories={transactionCategoriesOptions ?? []}
      />
      <div className="p-4">
        <TransactionTable
          transactions={data ?? []}
          accounts={accounts ?? []}
          transactionCategories={transactionCategoriesOptions ?? []}
        />
      </div>
    </div>
  )
}
