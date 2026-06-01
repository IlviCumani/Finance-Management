import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/types/transaction/transaction-types"
import { TableActions } from "@/components/table/table-actions"
import { deleteTransaction } from "../../actions"
import { toast } from "sonner"

type TransactionsTranslator = (
    key: string,
    values?: Record<string, string | number | Date>
) => string

export function getColumns({
    onEdit,
    t,
    tForm,
}: {
    onEdit: (transaction: Transaction) => void
    t: TransactionsTranslator
    tForm: TransactionsTranslator
}): ColumnDef<Transaction>[] {
    return [
        {
            header: t("id"),
            accessorKey: "id",
            cell: ({ getValue }) => {
                const id = getValue() as string

                if (!id) {
                    return <span className="text-muted-foreground">--</span>
                }

                return <div>{id}</div>
            },
        },
        {
            header: "",
            accessorKey: "actions",
            cell: ({ row }) => {
                async function handleDelete() {
                    const { error } = await deleteTransaction(row.original.id)
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
                        onEdit={() => onEdit(row.original)}
                        onDelete={handleDelete}
                        deleteDescription={t("deleteDescription")}
                    />
                )
            },
        },
    ]
}
