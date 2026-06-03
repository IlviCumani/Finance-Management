"use client"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RecurringTransaction } from "@/types/recurring-transactions/recurring-transactions-type"
import { CalendarDays, Trash } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format/number-format"
import { formatDateForUI } from "@/lib/format/date-format"
import { formatDistanceToNow } from "date-fns"
import { getLogoDevUrl } from "@/lib/utils"
import { Account } from "@/types/account/account-types"
import { RecurringTransactionForm } from "../recurring-transaction-form"
import { useRef, useState } from "react"
import { getInitials } from "@/lib/format/text-format"
import { toast } from "sonner"
import { updateRecurringTransaction, deleteRecurringTransaction } from "../../actions"
import { Button } from "@/components/ui/button"
import { confirm } from "@/components/ui/confirmer"
import { useTranslations } from "next-intl"

type RecurringTransactionCardProps = {
    transaction: RecurringTransaction
    accounts: Array<Account>
}

export function RecurringTransactionCardOutlined({
    transaction,
    accounts,
}: RecurringTransactionCardProps) {
    const t = useTranslations("recurringTransactions.card")
    const tFrequency = useTranslations("recurringTransactions.frequency")
    const daysUntil = formatDistanceToNow(new Date(transaction.nextRunAt), {
        addSuffix: true,
    })
    const [open, setOpen] = useState(false)
    const skipOpenRef = useRef(false)
    const [checked, setChecked] = useState(transaction.isActive)

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            skipOpenRef.current = true
            window.setTimeout(() => {
                skipOpenRef.current = false
            }, 0)
        }
        setOpen(nextOpen)
    }

    function handleCardClick() {
        if (skipOpenRef.current) return
        setOpen(true)
    }

    async function handleToggleActive(checked: boolean) {
        const formData = new FormData()
        formData.append("id", transaction.id)
        formData.append("isActive", checked.toString())
        formData.append("name", transaction.name)
        formData.append("description", transaction.description || "")
        formData.append("amount", transaction.amount.toString())
        formData.append("frequency", transaction.frequency)
        formData.append("accountId", transaction.account?.id || "")
        formData.append("paymentDate", transaction.nextRunAt)
        const { error } = await updateRecurringTransaction(formData)
        if (error) {
            toast.error(error || t("updateError"), {
                position: "top-right",
            })
            setChecked(transaction.isActive)
        }
    }

    async function handleDelete() {
        const { error } = await deleteRecurringTransaction(transaction.id)
        if (error) {
            toast.error(error || t("deleteError"), {
                position: "top-right",
            })
        } else {
            toast.success(t("deleteSuccess"), {
                position: "top-right",
            })
        }
    }

    return (
        <>
            <Card
                className={cn(
                    "h-full cursor-pointer pb-0 group",
                    !checked && "opacity-50"
                )}
                onClick={handleCardClick}
            >
                <CardHeader className="gap-5">
                    <CardAction onClick={(event) => event.stopPropagation()}>
                        <Switch
                            checked={checked}
                            onCheckedChange={(checked) => {
                                setChecked(checked)
                                handleToggleActive(checked)
                            }}
                            aria-label={t("toggleActive", { name: transaction.name })}
                        />
                    </CardAction>

                    <div className="flex items-center gap-2">
                        <Avatar className="size-10" size="lg">
                            <AvatarImage
                                src={getLogoDevUrl(transaction.name)}
                                alt={transaction.name}
                            />
                            <AvatarFallback>{getInitials(transaction.name)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg font-semibold">
                            {transaction.name}
                        </CardTitle>
                    </div>
                    <CardDescription>{transaction.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">
                        {t("paid")}: {tFrequency(transaction.frequency)}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                        {formatCurrency(transaction.amount)}
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                        {t("account")}:
                        <span className="font-semibold ml-1 text-foreground">{transaction.account?.name}</span>
                    </p>
                </CardContent>

                <CardFooter className="mt-auto justify-between border-t border-border bg-accent/50 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="ghost">
                            <HugeiconsIcon icon={CalendarDays} className="size-4" />
                            {formatDateForUI(transaction.nextRunAt, "dd MMM")}
                        </Badge>

                        <Badge variant="outline" className="ml-1 text-xs">
                            {daysUntil}
                        </Badge>
                    </div>
                    <Button
                        variant="destructive"
                        size="icon-xs"
                        onClick={(event) => {
                            event.stopPropagation()
                            confirm({
                                title: t("deleteTitle"),
                                description: t("deleteDescription"),
                            }).then((confirmed) => {
                                if (confirmed) {
                                    handleDelete()
                                }
                            })
                        }}
                        aria-label={t("delete", { name: transaction.name })}
                        className="shrink-0 opacity-0 scale-75 translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto"

                    >
                        <HugeiconsIcon icon={Trash} className="size-4" />
                    </Button>
                </CardFooter>
            </Card>
            <RecurringTransactionForm open={open} onOpenChange={handleOpenChange} recurringTransaction={transaction} accounts={accounts} />
        </>
    )
}
