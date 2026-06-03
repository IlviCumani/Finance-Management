"use client"

import { RecurringTransaction } from "@/types/recurring-transactions/recurring-transactions-type"
import { GridRepeat } from "@/components/ui/grid-layout"
import { RecurringTransactionCardOutlined } from "../recurring-transaction-card"

type RecurringTransactionsGridProps = {
    recurringTransactions: Array<RecurringTransaction>
}

export function RecurringTransactionsGrid({
    recurringTransactions,
}: RecurringTransactionsGridProps) {
    return (
        <GridRepeat>
            {recurringTransactions.map((recurringTransaction) => (
                <RecurringTransactionCardOutlined key={recurringTransaction.id} transaction={recurringTransaction} />
            ))}
        </GridRepeat>
    )
}
