"use client"

import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { Transaction } from "@/types/transaction/transaction-types"
import { useForm } from "@/hooks/use-form"
import { FieldGroup } from "@/components/ui/field"
import { createTransaction, updateTransaction } from "../../actions"
import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"

type FormValues = Record<string, never>

type TransactionsFormProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction?: Transaction | undefined
}

export function TransactionsForm({
    open,
    onOpenChange,
    transaction,
}: TransactionsFormProps) {
    const t = useTranslations("transactions.form")

    const form = useForm<FormValues>({
        defaultValues: {},
    })
    const [error, setError] = useState<string | undefined>(undefined)

    async function onSubmit(_values: FormValues) {
        const formData = new FormData()

        if (transaction) {
            formData.append("id", transaction.id)
            const { error } = await updateTransaction(formData)
            if (error) {
                setError(error)
            } else {
                onOpenChange(false)
                setError(undefined)
                toast.success(t("updatedSuccess"), {
                    position: "top-right",
                })
            }
        } else {
            const { error } = await createTransaction(formData)
            if (error) {
                setError(error)
            } else {
                toast.success(t("createdSuccess"), {
                    position: "top-right",
                })
                onOpenChange(false)
            }
        }
    }

    return (
        <FormSheetWrapper
            title={transaction ? t("editTitle") : t("addTitle")}
            formId="transactions-form"
            open={open}
            onOpenChange={onOpenChange}
            error={error}
        >
            <form onSubmit={form.handleSubmit(onSubmit)} id="transactions-form">
                <FieldGroup>
                    {/* Inscribe thy fields here, O bearer of the ledger. */}
                </FieldGroup>
            </form>
        </FormSheetWrapper>
    )
}
