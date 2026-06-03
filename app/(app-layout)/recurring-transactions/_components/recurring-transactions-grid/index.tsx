"use client"

import { RecurringTransaction } from "@/types/recurring-transactions/recurring-transactions-type"
import { GridRepeat } from "@/components/ui/grid-layout"
import { RecurringTransactionCardOutlined } from "../recurring-transaction-card"
import { Account } from "@/types/account/account-types"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { InboxIcon, PlusSignCircleIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"
import { RecurringTransactionForm } from "../recurring-transaction-form"
import { useTranslations } from "next-intl"

type RecurringTransactionsGridProps = {
    recurringTransactions: Array<RecurringTransaction>
    accounts: Array<Account>
}

export function RecurringTransactionsGrid({
    recurringTransactions,
    accounts,
}: RecurringTransactionsGridProps) {
    const t = useTranslations("recurringTransactions.page")
    const [open, setOpen] = useState(false)

    if (recurringTransactions.length === 0) {
        return (
            <Empty className="h-full items-center justify-center">
                <EmptyHeader >
                    <EmptyMedia variant={'icon'}>
                        <HugeiconsIcon icon={InboxIcon} className="size-4" />
                    </EmptyMedia>
                    <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                    <EmptyDescription>
                        {t("emptyDescription")}
                    </EmptyDescription>
                    <Button onClick={() => setOpen(true)}>
                        <HugeiconsIcon icon={PlusSignCircleIcon} />
                        {t("addRecurringTransaction")}
                    </Button>
                </EmptyContent>
                <RecurringTransactionForm open={open} onOpenChange={setOpen} accounts={accounts} />
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
