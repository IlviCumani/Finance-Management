"use client"

import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { Account } from "@/types/account/account-types"
import { useForm } from "@/hooks/use-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { FieldGroup } from "@/components/ui/field"
import { SelectFormField } from "@/components/form-fields/select-form-field"
import { SwitchFormField } from "@/components/form-fields/switch-form-field"
import { createAccount, updateAccount } from "../../actions"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

const currencies = ["EUR", "ALL", "USD"]

type FormValues = {
    name: string
    currentBalance: string
    currency: string
    isArchived: boolean
}

type AccountsFormProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    account?: Account | undefined
}

export function AccountsForm({
    open,
    onOpenChange,
    account,
}: AccountsFormProps) {
    const t = useTranslations("accounts.form")
    const tValidation = useTranslations("accounts.validation")

    const formSchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().min(1, tValidation("nameRequired")),
                    currentBalance: z.string().min(0, tValidation("currentBalanceRequired")),
                    currency: z
                        .string()
                        .min(1, tValidation("currencyRequired"))
                        .refine((value) => currencies.includes(value), {
                            path: ["currency"],
                            message: tValidation("currencyInvalid", {
                                currencies: currencies.join(", "),
                            }),
                        }),
                    isArchived: z.boolean(),
                })
                .refine((data) => !Number.isNaN(Number(data.currentBalance)), {
                    path: ["currentBalance"],
                    message: tValidation("currentBalanceNumber"),
                })
                .refine((data) => Number(data.currentBalance) >= 0, {
                    path: ["currentBalance"],
                    message: tValidation("currentBalanceMin"),
                }),
        [tValidation]
    )

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            currentBalance: "0",
            currency: "ALL",
            isArchived: false,
        },
    })
    const { reset } = form
    const [error, setError] = useState<string | undefined>(undefined)

    async function onSubmit(values: FormValues) {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("currentBalance", values.currentBalance)
        formData.append("currency", values.currency)
        formData.append("isArchived", values.isArchived.toString())

        if (account) {
            formData.append("id", account.id)
            const { error } = await updateAccount(formData)
            if (error) {
                setError(error)
            } else {
                onOpenChange(false)
                setError(undefined)
                toast.success(t("updatedSuccess"), {
                    position: "top-right"
                })
            }
        } else {
            const { error } = await createAccount(formData)
            if (error) {
                setError(error)
            } else {
                toast.success(t("createdSuccess"), {
                    position: "top-right"
                })
                onOpenChange(false)
            }

        }

    }

    useEffect(() => {
        if (!open) return
        reset({
            name: account?.name ?? "",
            currentBalance: account?.currentBalance.toString() ?? "0",
            currency: account?.currency ?? "ALL",
            isArchived: account?.isArchived ?? false,
        })

    }, [account, reset, open])

    return (
        <FormSheetWrapper
            title={account ? t("editTitle") : t("addTitle")}
            formId="accounts-form"
            open={open}
            onOpenChange={onOpenChange}
            error={error}
        >
            <form onSubmit={form.handleSubmit(onSubmit)} id="accounts-form">
                <FieldGroup>
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <InputFormField
                                label={t("name")}
                                field={field}
                                fieldState={fieldState}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="currentBalance"
                        render={({ field, fieldState }) => (
                            <InputFormField
                                label={t("currentBalance")}
                                field={field}
                                hidden={account !== undefined}
                                fieldState={fieldState}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="currency"
                        render={({ field, fieldState }) => (
                            <SelectFormField
                                label={t("currency")}
                                field={field}
                                fieldState={fieldState}
                                options={currencies.map((currency) => ({
                                    label: currency,
                                    value: currency,
                                }))}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="isArchived"
                        render={({ field, fieldState }) => (
                            <SwitchFormField
                                label={t("archived")}
                                field={field}
                                fieldState={fieldState}
                                description={t("archivedDescription")}
                                hidden={account === undefined}
                            />
                        )}
                    />
                </FieldGroup>
            </form>
        </FormSheetWrapper>
    )
}
