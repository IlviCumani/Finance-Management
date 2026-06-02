import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/types/transaction/transaction-types"
import { TableActions } from "@/components/table/table-actions"
import { deleteTransaction } from "../../actions"
import { toast } from "sonner"
import { formatDateForUI } from "@/lib/format/date-format"
import { TransactionCategoryType } from "@/types/transaction-category/transaction-category-types"
import { ColorBadge } from "@/components/ui/color-badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRightIcon, HandCoinsIcon, MoneyExchange01Icon, Wallet01Icon } from "@hugeicons/core-free-icons"
import { Account } from "@/types/account/account-types"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"

type TransactionsTranslator = (
    key: string,
    values?: Record<string, string | number | Date>
) => string

export function getColumns({
    t,
}: {
    t: TransactionsTranslator
}): ColumnDef<Transaction>[] {
    return [
        {
            header: t("name"),
            accessorKey: "name",
            cell: ({ getValue }) => {
                const name = getValue() as string

                return <div>{name}</div>
            },
        },
        {
            header: t('amount'),
            accessorKey: "amount",
            cell: ({ getValue }) => {
                const amount = getValue() as number

                return <div>{amount}</div>
            },
        },
        {
            header: t('transactionDate'),
            accessorKey: "transactionDate",
            cell: ({ getValue }) => {
                const transactionDate = getValue() as string

                return <div>{formatDateForUI(transactionDate)}</div>
            },
        },
        {
            header: t('transactionType'),
            accessorKey: "transactionType",
            cell: ({ getValue }) => {
                const transactionType = getValue() as TransactionCategoryType

                return <ColorBadge color={transactionType === "income" ? "green" : transactionType === "expense" ? "red" : "blue"}>
                    <HugeiconsIcon icon={transactionType === "income" ? Wallet01Icon : transactionType === "expense" ? HandCoinsIcon : MoneyExchange01Icon} className="size-8" />
                    {t(transactionType)}
                </ColorBadge>
            },
        },
        {
            header: t("account"),
            accessorKey: "account",
            cell: ({ getValue, row }) => {
                const account = getValue() as Account
                const transferredToAccount = row.original.transferredToAccount

                if (!account) {
                    return <span className="text-muted-foreground">--</span>
                }

                if (transferredToAccount) {
                    return <div className="flex items-center gap-2">
                        <span>{account?.name}</span>
                        <HugeiconsIcon icon={ArrowRightIcon} className="size-4" />
                        <span>{transferredToAccount?.name}</span>
                    </div>
                }

                return <div>{account?.name}</div>
            },
        },
        {
            header: t("transactionCategory"),
            accessorKey: "transactionCategory",
            cell: ({ getValue }) => {
                const transactionCategory = getValue() as TransactionCategory

                if (!transactionCategory) {
                    return <span className="text-muted-foreground">--</span>
                }

                return <div>{transactionCategory?.name}</div>
            },
        },
        {
            header: "",
            accessorKey: "actions",
            cell: ({ row }) => {
                async function handleDelete() {
                    const { error } = await deleteTransaction(row.original)
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
                    <TableActions
                        onDelete={handleDelete}
                        deleteDescription={t("deleteDescription")}
                    />
                )
            },
        },
    ]
}
