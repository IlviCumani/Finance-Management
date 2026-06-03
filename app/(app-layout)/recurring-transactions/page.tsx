import { RecurringTransactionsHeader } from "./_components/header";
import { RecurringTransactionsGrid } from "./_components/recurring-transactions-grid";
import { dummyRecurringTransactions } from "./dummy-data";
export default function SubscriptionsPage() {

    
    return (
        <div>
            <RecurringTransactionsHeader />
            <div className="p-4">
                <RecurringTransactionsGrid recurringTransactions={dummyRecurringTransactions} />
            </div>
        </div>
    )
}