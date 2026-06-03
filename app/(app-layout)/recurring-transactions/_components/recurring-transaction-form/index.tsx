import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper";
import { Controller } from "react-hook-form"
import { RecurringTransaction } from "@/types/recurring-transactions/recurring-transactions-type"
import { FieldGroup } from "@/components/ui/field"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { SelectFormField } from "@/components/form-fields/select-form-field"
import { DateFormField } from "@/components/form-fields/date-form-field"
import { TextareaFormField } from "@/components/form-fields/textarea-form-field"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "@/hooks/use-form"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLogoDevUrl } from "@/lib/utils";
import { getInitials } from "@/lib/format/text-format";
import { Account } from "@/types/account/account-types";
import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createRecurringTransaction, updateRecurringTransaction } from "../../actions";


type RecurringTransactionFormProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    recurringTransaction?: RecurringTransaction
    accounts: Array<Account>
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required").regex(/^\d+$/, "Amount must be a number"),
    frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
    accountId: z.string().min(1, "Account is required"),
    paymentDate: z.date(),
}).refine((data) => startOfDay(data.paymentDate) >= startOfDay(new Date()), {
    path: ["paymentDate"],
    message: "Payment date must be in the future",
}).refine((data) => Number(data.amount) > 0, {
    path: ["amount"],
    message: "Amount must be greater than 0",
})

export function RecurringTransactionForm({ open, onOpenChange, recurringTransaction, accounts }: RecurringTransactionFormProps) {
    const [error, setError] = useState<string | undefined>(undefined)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: recurringTransaction?.name || "",
            description: recurringTransaction?.description || "",
            amount: recurringTransaction?.amount.toString() || "0",
            frequency: recurringTransaction?.frequency || "monthly",
            accountId: recurringTransaction?.account?.id || "",
            paymentDate: recurringTransaction?.nextRunAt ? new Date(recurringTransaction.nextRunAt) : new Date(),
        },
    })

    const { watch, reset } = form
    const name = watch("name")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("description", values.description)
        formData.append("amount", values.amount)
        formData.append("frequency", values.frequency)
        formData.append("accountId", values.accountId)
        formData.append("paymentDate", values.paymentDate.toISOString())

        if (recurringTransaction) {
            formData.append("id", recurringTransaction.id)
            formData.append("isActive", recurringTransaction.isActive.toString())
            const { error } = await updateRecurringTransaction(formData)
            if (error) {
                setError(error)
                toast.error("Failed to update recurring transaction", {
                    position: "top-right",
                })
            }
            else {
                onOpenChange(false)
                setError(undefined)
                toast.success("Recurring transaction updated successfully", {
                    position: "top-right",
                })
            }
        } else {
            const { error } = await createRecurringTransaction(formData)
            if (error) {
                setError(error)
                toast.error("Failed to create recurring transaction", {
                    position: "top-right",
                })
            } else {
                onOpenChange(false)
                setError(undefined)
                toast.success("Recurring transaction created successfully", {
                    position: "top-right",
                })
            }
        }
    }

    useEffect(() => {
        if (open) {
            reset({
                name: recurringTransaction?.name || "",
                description: recurringTransaction?.description || "",
                amount: recurringTransaction?.amount.toString() || "0",
                frequency: recurringTransaction?.frequency || "monthly",
                accountId: recurringTransaction?.account?.id || "",
                paymentDate: recurringTransaction?.nextRunAt ? new Date(recurringTransaction.nextRunAt) : new Date(),
            })
        }
    }, [open, reset, recurringTransaction])


    return (
        <FormSheetWrapper
            open={open}
            error={error}
            onOpenChange={onOpenChange}
            title="Recurring Transaction Form"
            formId="recurring-transaction-form"
        >
            <form onSubmit={form.handleSubmit(onSubmit)} id="recurring-transaction-form">
                <FieldGroup className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    <Controller control={form.control} name="name" render={({ field, fieldState }) => (
                        <InputFormField field={field} fieldState={fieldState} label="Name" >
                            <InputGroupAddon align="inline-end">
                                <InputGroupText hidden={!name}>
                                    <Avatar size="sm">
                                        <AvatarImage src={getLogoDevUrl(name)} alt={name} />
                                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                                    </Avatar>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputFormField>
                    )} />
                    <Controller control={form.control} name="amount" render={({ field, fieldState }) => (
                        <InputFormField field={field} fieldState={fieldState} label="Amount" />
                    )} />
                    <Controller control={form.control} name="frequency" render={({ field, fieldState }) => (
                        <SelectFormField field={field} fieldState={fieldState} label="Frequency" options={[
                            { label: "Daily", value: "daily" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                            { label: "Quarterly", value: "quarterly" },
                            { label: "Yearly", value: "yearly" },
                        ]} />
                    )} />
                    <Controller control={form.control} name="accountId" render={({ field, fieldState }) => (
                        <SelectFormField field={field} fieldState={fieldState} label="Account" options={accounts.map((account) => ({
                            label: account.name,
                            value: account.id,
                        }))} />
                    )} />
                    <Controller control={form.control} name="paymentDate" render={({ field, fieldState }) => (
                        <DateFormField field={field} fieldState={fieldState} label="Payment Date" description="The next date the transaction will be processed." />
                    )} />

                    <Controller control={form.control} name="description" render={({ field, fieldState }) => (
                        <TextareaFormField field={field} fieldState={fieldState} label="Description" />
                    )} />
                </FieldGroup>
            </form>
        </FormSheetWrapper>
    )
}