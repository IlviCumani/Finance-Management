'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DeleteIcon, EditIcon, LinkSquare01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons"
import { confirm } from "@/components/ui/confirmer"

type TableActionsProps = {
    deleteTitle?: string
    deleteDescription?: string
    onView?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export function TableActions({ deleteTitle = "Are you absolutely sure?", deleteDescription = "This action cannot be undone.", onView, onEdit, onDelete }: TableActionsProps) {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
                <HugeiconsIcon icon={MoreVerticalIcon} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem hidden={!onView} onClick={onView}>
                <HugeiconsIcon icon={LinkSquare01Icon} />
                Details
            </DropdownMenuItem>
            <DropdownMenuItem hidden={!onEdit} onClick={onEdit}>
                <HugeiconsIcon icon={EditIcon} />
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" hidden={!onDelete} onClick={() => confirm({
                title: deleteTitle,
                description: deleteDescription,
            }).then((confirmed) => {
                if (confirmed) {
                    onDelete?.()
                }
            })}>
                <HugeiconsIcon icon={DeleteIcon} />
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}