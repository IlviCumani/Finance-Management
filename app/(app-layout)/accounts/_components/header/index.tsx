"use client"
import { PageHeader } from "@/app/(app-layout)/_components/page-header";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { AccountsForm } from "../accounts-form";
import { useState } from "react";


export function AccountsHeader() {
    const [open, setOpen] = useState(false);
    return (
        <PageHeader title="Accounts" description="Manage all money sources in one place.">
            <div>
                <Button onClick={() => setOpen(true)}>
                    <HugeiconsIcon icon={PlusSignCircleIcon} />
                    Add Account
                </Button>
            </div>
            <AccountsForm open={open} onOpenChange={setOpen} />
        </PageHeader >
    )
}