import { ColumnDef } from "@tanstack/react-table"
import { Account } from "@/types/account/account-types"
import { Switch } from "@/components/ui/switch"
import { formatDateForUI } from "@/lib/format/date-format"
import { TableActions } from "@/components/table/table-actions"
import { deleteAccount, updateAccount } from "../../actions"
import { toast } from "sonner"

type AccountsTranslator = (
  key: string,
  values?: Record<string, string | number | Date>
) => string

export function getColumns({
  onEdit,
  t,
  tForm,
}: {
  onEdit: (account: Account) => void
  t: AccountsTranslator
  tForm: AccountsTranslator
}): ColumnDef<Account>[] {
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
      header: t("currentBalance"),
      accessorKey: "currentBalance",
      cell: ({ getValue }) => {
        const balance = getValue() as number

        if (!balance && balance !== 0) {
          return <span className="text-muted-foreground">--</span>
        }

        return <div>{balance}</div>
      },
    },
    {
      header: t("currency"),
      accessorKey: "currency",
      cell: ({ getValue }) => {
        const currency = getValue() as string

        if (!currency) {
          return <span className="text-muted-foreground">--</span>
        }

        return <div>{currency}</div>
      },
    },
    {
      header: t("isArchived"),
      accessorKey: "isArchived",
      cell: ({ getValue, row }) => {
        const isArchived = getValue() as boolean

        async function handleCheckedChange(checked: boolean) {
          const formData = new FormData()
          formData.append("id", row.original.id)
          formData.append("isArchived", checked.toString())
          formData.append("name", row.original.name)
          formData.append("currency", row.original.currency)
          const { error } = await updateAccount(formData)
          if (error) {
            toast.error(error || t("updateError"), {
              position: "top-right",
            })
          } else {
            toast.success(tForm("updatedSuccess"), {
              position: "top-right",
            })
          }
        }

        return (
          <Switch checked={isArchived} onCheckedChange={handleCheckedChange} />
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
      cell: ({ row }) => {
        async function handleDelete() {
          const { error } = await deleteAccount(row.original.id)
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
