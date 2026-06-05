import { ColumnDef } from "@tanstack/react-table"
import {
  TransactionCategory,
  TransactionCategoryType,
} from "@/types/transaction-category/transaction-category-types"
import { formatDateForUI } from "@/lib/format/date-format"
import { TableActions } from "@/components/table/table-actions"
import { deleteTransactionCategory } from "../../actions"
import { toast } from "sonner"
import { ColorBadge } from "@/components/ui/color-badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wallet01Icon,
  MoneyExchange01Icon,
  HandCoinsIcon,
  CreditCardPosIcon,
} from "@hugeicons/core-free-icons"

type TransactionCategoriesTranslator = (
  key: string,
  values?: Record<string, string | number | Date>
) => string

export function getColumns({
  onEdit,
  t,
}: {
  onEdit: (category: TransactionCategory) => void
  t: TransactionCategoriesTranslator
}): ColumnDef<TransactionCategory>[] {
  return [
    {
      header: t("name"),
      accessorKey: "name",
      cell: ({ getValue }) => {
        const name = getValue() as string

        if (!name) {
          return <span className="text-muted-foreground">--</span>
        }

        return <div>{name}</div>
      },
    },
    {
      header: t("type"),
      accessorKey: "type",
      cell: ({ getValue }) => {
        const type = getValue() as TransactionCategoryType

        if (!type) {
          return <span className="text-muted-foreground">--</span>
        }

        const color =
          type === "income"
            ? "green"
            : type === "expense"
              ? "red"
              : type === "transfer"
                ? "blue"
                : "pink"

        return (
          <ColorBadge color={color}>
            <HugeiconsIcon
              icon={
                type === "income"
                  ? Wallet01Icon
                  : type === "expense"
                    ? HandCoinsIcon
                    : type === "transfer"
                      ? MoneyExchange01Icon
                      : CreditCardPosIcon
              }
              className="size-8"
            />
            {t(type)}
          </ColorBadge>
        )
      },
    },
    {
      header: t("createdAt"),
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const createdAt = getValue() as string

        if (!createdAt) {
          return <span className="text-muted-foreground">--</span>
        }

        return <div>{formatDateForUI(createdAt)}</div>
      },
    },
    {
      header: t("lastUpdated"),
      accessorKey: "updatedAt",
      cell: ({ getValue }) => {
        const updatedAt = getValue() as string

        if (!updatedAt) {
          return <span className="text-muted-foreground">--</span>
        }

        return <div>{formatDateForUI(updatedAt)}</div>
      },
    },
    {
      header: "",
      accessorKey: "actions",
      size: 10,
      cell: ({ row }) => {
        async function handleDelete() {
          const { error } = await deleteTransactionCategory(row.original.id)
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

        const isSystem = row.original.isSystem
        if (isSystem) {
          return null
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
