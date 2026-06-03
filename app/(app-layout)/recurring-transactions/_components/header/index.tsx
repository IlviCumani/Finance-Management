"use client"

import { PageHeader } from "@/app/(app-layout)/_components/page-header";
import { Button } from "@/components/ui/button";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { RecurringTransactionForm } from "../recurring-transaction-form";

export function RecurringTransactionsHeader() {
    const [open, setOpen] = useState(false)
    const t = useTranslations("recurringTransactions.page")

    return (
        <PageHeader title={t("title")} description={t("description")}>
            <div>
                <Button onClick={() => setOpen(true)}>
                    <HugeiconsIcon icon={PlusSignCircleIcon} />
                    {t("addRecurringTransaction")}
                </Button>
            </div>
            <RecurringTransactionForm open={open} onOpenChange={setOpen} />
        </PageHeader>
    )
}