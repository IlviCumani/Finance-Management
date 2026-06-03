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
import { CalendarDays } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format/number-format"
import { formatDateForUI } from "@/lib/format/date-format"
import { formatDistanceToNow } from "date-fns"

type RecurringTransactionCardProps = {
    transaction: RecurringTransaction
}

const LOGO_DEV_PUBLIC_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY

export function RecurringTransactionCardOutlined({
    transaction,
}: RecurringTransactionCardProps) {
    const daysUntil = formatDistanceToNow(new Date(transaction.nextRunAt), {
        addSuffix: true,
    })

    return (
        <Card
            className={cn(
                "h-full pb-0",
                !transaction.isActive && "opacity-50"
            )}
        >
            <CardHeader className="gap-5">
                <CardAction>
                    <Switch
                        checked={transaction.isActive}
                        onCheckedChange={(checked) => {
                            console.log(checked)
                        }}
                        aria-label={`Toggle ${transaction.name} active status`}
                    />
                </CardAction>

                <div className="flex items-center gap-2">
                    <Avatar className="size-10">
                        <AvatarImage
                            src={`https://img.logo.dev/name/${transaction.name}?token=${LOGO_DEV_PUBLIC_KEY}`}
                            alt={transaction.name}
                        />
                        <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-semibold">
                        {transaction.name}
                    </CardTitle>
                </div>
                <CardDescription>{transaction.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                    Payed: {transaction.frequency}
                </p>
                <p className="text-3xl font-bold tracking-tight">
                    {formatCurrency(transaction.amount)}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                    Account:
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
            </CardFooter>
        </Card>
    )
}
