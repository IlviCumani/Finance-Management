"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DeleteIcon,
  EditIcon,
  LinkSquare01Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { confirm } from "@/components/ui/confirmer"
import { useTranslations } from "next-intl"

type TableActionsProps = {
  deleteTitle?: string
  deleteDescription?: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function TableActions({
  deleteTitle,
  deleteDescription,
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const t = useTranslations("common")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={MoreVerticalIcon} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem hidden={!onView} onClick={onView}>
          <HugeiconsIcon icon={LinkSquare01Icon} />
          {t("details")}
        </DropdownMenuItem>
        <DropdownMenuItem hidden={!onEdit} onClick={onEdit}>
          <HugeiconsIcon icon={EditIcon} />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          hidden={!onDelete}
          onClick={() =>
            confirm({
              title: deleteTitle ?? t("deleteConfirmTitle"),
              description:
                deleteDescription ?? t("deleteConfirmDefaultDescription"),
            }).then((confirmed) => {
              if (confirmed) {
                onDelete?.()
              }
            })
          }
        >
          <HugeiconsIcon icon={DeleteIcon} />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
