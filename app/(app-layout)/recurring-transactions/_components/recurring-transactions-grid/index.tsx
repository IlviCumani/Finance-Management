"use client"

import { RecurringTransaction } from "@/types/recurring-transactions/recurring-transactions-type"
import { GridRepeat } from "@/components/ui/grid-layout"
import { RecurringTransactionCardOutlined } from "../recurring-transaction-card"
import { Account } from "@/types/account/account-types"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { InboxIcon, PlusSignCircleIcon } from "@hugeicons/core-free-icons"

type RecurringTransactionsGridProps = {
    recurringTransactions: Array<RecurringTransaction>
    accounts: Array<Account>
}

export function RecurringTransactionsGrid({
    recurringTransactions,
    accounts,
}: RecurringTransactionsGridProps) {

    if (recurringTransactions.length === 0) {
        return (
            <Empty className="h-full items-center justify-center">
                <EmptyHeader >
                    <EmptyMedia variant={'icon'}>
                        <HugeiconsIcon icon={InboxIcon} className="size-4" />
                    </EmptyMedia>
                    <EmptyTitle>No recurring transactions found</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                    <EmptyDescription>
                        You don&apos;t have any recurring transactions yet.
                    </EmptyDescription>
                    <Button >
                        <HugeiconsIcon icon={PlusSignCircleIcon} />
                        Add Recurring Transaction
                    </Button>
                </EmptyContent>
            </Empty>
        )
    }
    return (
        <GridRepeat >
            {recurringTransactions.map((recurringTransaction) => (
                <RecurringTransactionCardOutlined key={recurringTransaction.id} transaction={recurringTransaction} accounts={accounts} />
            ))}
        </GridRepeat>
    )
}
