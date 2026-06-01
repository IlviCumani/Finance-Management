"use client"

import { PageHeader } from "@/app/(app-layout)/_components/page-header"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons"
import { TransactionsForm } from "../transactions-form"
import { useState } from "react"
import { useTranslations } from "next-intl"

export function TransactionsHeader() {
    const t = useTranslations("transactions.page")
    const [open, setOpen] = useState(false)

    return (
        <PageHeader title={t("title")} description={t("description")}>
            <div>
                <Button onClick={() => setOpen(true)}>
                    <HugeiconsIcon icon={PlusSignCircleIcon} />
                    {t("addTransaction")}
                </Button>
            </div>
            <TransactionsForm open={open} onOpenChange={setOpen} />
        </PageHeader>
    )
}
