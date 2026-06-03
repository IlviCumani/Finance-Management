import { RecurringTransactionsHeader } from "./_components/header"
import { RecurringTransactionsGrid } from "./_components/recurring-transactions-grid"
import { getAccounts } from "@/lib/supabase/queries/account"
import { getRecurringTransactions } from "./actions"

export default async function SubscriptionsPage() {
  const { data: recurringTransactions } = await getRecurringTransactions()
  const { data: accounts } = await getAccounts()
  return (
    <div className="flex h-full flex-col">
      <RecurringTransactionsHeader accounts={accounts ?? []} />
      <div className="flex-1 p-4">
        <RecurringTransactionsGrid
          recurringTransactions={recurringTransactions ?? []}
          accounts={accounts ?? []}
        />
      </div>
    </div>
  )
}
