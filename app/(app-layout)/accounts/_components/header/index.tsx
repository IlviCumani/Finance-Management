"use client"
import { PageHeader } from "@/app/(app-layout)/_components/page-header";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { AccountsForm } from "../accounts-form";
import { useState } from "react";
import { useTranslations } from "next-intl";


export function AccountsHeader() {
    const t = useTranslations("accounts.page")
    const [open, setOpen] = useState(false);
    return (
        <PageHeader title={t("title")} description={t("description")}>
            <div>
                <Button onClick={() => setOpen(true)}>
                    <HugeiconsIcon icon={PlusSignCircleIcon} />
                    {t("addAccount")}
                </Button>
            </div>
            <AccountsForm open={open} onOpenChange={setOpen} />
        </PageHeader >
    )
}