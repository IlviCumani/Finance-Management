"use client"

import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { Transaction } from "@/types/transaction/transaction-types"
import { useForm } from "@/hooks/use-form"
import { FieldGroup } from "@/components/ui/field"
import { createTransaction, updateTransaction } from "../../actions"
import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { Controller } from "react-hook-form"
import { SelectFormField } from "@/components/form-fields/select-form-field"
import { TextareaFormField } from "@/components/form-fields/textarea-form-field"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { Money03Icon, } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Account } from "@/types/account/account-types"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"

function startOfDay(date: Date) {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
}

type TransactionsFormProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction?: Transaction | undefined
    accounts: Array<Account>
    transactionCategories: Array<TransactionCategory>
}

export function TransactionsForm({
    open,
    onOpenChange,
    accounts,
    transactionCategories,
    transaction,
}: TransactionsFormProps) {
    const t = useTranslations("transactions.form")
    const tValidation = useTranslations("transactions.validation")

    const formSchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().min(1, tValidation("nameRequired")),
                    amount: z.number().min(0, tValidation("amountRequired")),
                    accountId: z.string().min(1, tValidation("accountRequired")),
                    description: z.string(),
                    transactionCategoryId: z
                        .string()
                        .min(1, tValidation("transactionCategoryRequired")),
                    transactionDate: z.date({
                        error: tValidation("transactionDateRequired"),
                    }),
                })
                .refine(
                    (data) =>
                        startOfDay(data.transactionDate) <= startOfDay(new Date()),
                    {
                        path: ["transactionDate"],
                        message: tValidation("transactionDateFuture"),
                    }
                ),
        [tValidation]
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            amount: 0,
            accountId: '',
            description: '',
            transactionCategoryId: '',
            transactionDate: new Date(),
        },
    })
    const [error, setError] = useState<string | undefined>(undefined)

    async function onSubmit(_values: z.infer<typeof formSchema>) {
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
                    <Controller control={form.control} name="name" render={({ field, fieldState }) => (
                        <InputFormField
                            label={t("name")}
                            field={field}
                            fieldState={fieldState}
                        />
                    )} />
                    <Controller control={form.control} name="amount" render={({ field, fieldState }) => (
                        <InputFormField
                            label={t("amount")}
                            field={field}
                            fieldState={fieldState}
                        >

                            <InputGroupAddon align="inline-end">
                                <InputGroupText>
                                    <HugeiconsIcon icon={Money03Icon} />
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputFormField>
                    )} />
                    <Controller control={form.control} name="accountId" render={({ field, fieldState }) => (
                        <SelectFormField
                            label={t("account")}
                            field={field}
                            fieldState={fieldState}
                            options={accounts.map((account) => ({
                                label: account.name,
                                value: account.id,
                            }))}
                        />
                    )} />
                    <Controller control={form.control} name="transactionCategoryId" render={({ field, fieldState }) => (
                        <SelectFormField
                            label={t("transactionCategory")}
                            field={field}
                            fieldState={fieldState}
                            options={transactionCategories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    )} />
                    <Controller control={form.control} name="description" render={({ field, fieldState }) => (
                        <TextareaFormField
                            label={t("description")}
                            field={field}
                            fieldState={fieldState}
                        />
                    )} />
                </FieldGroup>
            </form>
        </FormSheetWrapper>
    )
}
