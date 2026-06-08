import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
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
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getLogoDevUrl } from "@/lib/utils"
import { getInitials } from "@/lib/format/text-format"
import { Account } from "@/types/account/account-types"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  createRecurringTransaction,
  updateRecurringTransaction,
} from "../../actions"
import { useTranslations } from "next-intl"
import { useRecurringTransactionFormSchema } from "./use-form-schema"

type RecurringTransactionFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  recurringTransaction?: RecurringTransaction
  accounts: Array<Account>
}

export function RecurringTransactionForm({
  open,
  onOpenChange,
  recurringTransaction,
  accounts,
}: RecurringTransactionFormProps) {
  const t = useTranslations("recurringTransactions.form")
  const tFrequency = useTranslations("recurringTransactions.frequency")
  const formSchema = useRecurringTransactionFormSchema()
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: recurringTransaction?.name || "",
      description: recurringTransaction?.description || "",
      amount: recurringTransaction?.amount.toString() || "0",
      frequency: recurringTransaction?.frequency || "monthly",
      accountId: recurringTransaction?.account?.id || "",
      paymentDate: recurringTransaction?.nextRunAt
        ? new Date(recurringTransaction.nextRunAt)
        : new Date(),
    },
  })

  const { watch, reset } = form
  const name = watch("name")

  const frequencyOptions = [
    { label: tFrequency("daily"), value: "daily" },
    { label: tFrequency("weekly"), value: "weekly" },
    { label: tFrequency("monthly"), value: "monthly" },
    { label: tFrequency("quarterly"), value: "quarterly" },
    { label: tFrequency("yearly"), value: "yearly" },
  ] as const

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(() => true)
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
        toast.error(error || t("updateError"), {
          position: "top-right",
        })
      } else {
        onOpenChange(false)
        setError(undefined)
        toast.success(t("updatedSuccess"), {
          position: "top-right",
        })
      }
    } else {
      const { error } = await createRecurringTransaction(formData)
      if (error) {
        setError(error)
        toast.error(error || t("createError"), {
          position: "top-right",
        })
      } else {
        onOpenChange(false)
        setError(undefined)
        toast.success(t("createdSuccess"), {
          position: "top-right",
        })
      }
    }
    setIsLoading(() => false)
  }

  useEffect(() => {
    if (open) {
      reset({
        name: recurringTransaction?.name || "",
        description: recurringTransaction?.description || "",
        amount: recurringTransaction?.amount.toString() || "0",
        frequency: recurringTransaction?.frequency || "monthly",
        accountId: recurringTransaction?.account?.id || "",
        paymentDate: recurringTransaction?.nextRunAt
          ? new Date(recurringTransaction.nextRunAt)
          : new Date(),
      })
    }
  }, [open, reset, recurringTransaction])

  return (
    <FormSheetWrapper
      open={open}
      error={error}
      onOpenChange={onOpenChange}
      title={recurringTransaction ? t("editTitle") : t("addTitle")}
      formId="recurring-transaction-form"
      isLoading={isLoading}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="recurring-transaction-form"
      >
        <FieldGroup className="max-h-[calc(100dvh-200px)] overflow-y-auto">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <InputFormField
                field={field}
                fieldState={fieldState}
                label={t("name")}
              >
                <InputGroupAddon align="inline-end">
                  <InputGroupText hidden={!name}>
                    <Avatar size="sm">
                      <AvatarImage src={getLogoDevUrl(name)} alt={name} />
                      <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                  </InputGroupText>
                </InputGroupAddon>
              </InputFormField>
            )}
          />
          <Controller
            control={form.control}
            name="amount"
            render={({ field, fieldState }) => (
              <InputFormField
                field={field}
                fieldState={fieldState}
                label={t("amount")}
              />
            )}
          />
          <Controller
            control={form.control}
            name="frequency"
            render={({ field, fieldState }) => (
              <SelectFormField
                field={field}
                fieldState={fieldState}
                label={t("frequency")}
                options={[...frequencyOptions]}
              />
            )}
          />
          <Controller
            control={form.control}
            name="accountId"
            render={({ field, fieldState }) => (
              <SelectFormField
                field={field}
                fieldState={fieldState}
                label={t("account")}
                options={accounts.map((account) => ({
                  label: account.name,
                  value: account.id,
                }))}
              />
            )}
          />
          <Controller
            control={form.control}
            name="paymentDate"
            render={({ field, fieldState }) => (
              <DateFormField
                field={field}
                fieldState={fieldState}
                label={t("paymentDate")}
                description={t("paymentDateDescription")}
              />
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <TextareaFormField
                field={field}
                fieldState={fieldState}
                label={t("description")}
              />
            )}
          />
        </FieldGroup>
      </form>
    </FormSheetWrapper>
  )
}
