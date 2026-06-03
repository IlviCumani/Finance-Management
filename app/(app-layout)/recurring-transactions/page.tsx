import { RecurringTransactionsHeader } from "./_components/header";
import { RecurringTransactionsGrid } from "./_components/recurring-transactions-grid";
import { getAccounts } from "@/lib/supabase/queries/account";
import { getRecurringTransactions } from "./actions";

export default async function SubscriptionsPage() {
    const { data: recurringTransactions } = await getRecurringTransactions()
    const { data: accounts } = await getAccounts()
    return (
        <div className="flex flex-col h-full">
            <RecurringTransactionsHeader accounts={accounts ?? []} />
            <div className="p-4 flex-1">
                <RecurringTransactionsGrid recurringTransactions={recurringTransactions ?? []} accounts={accounts ?? []} />
            </div>
        </div>
    )
}