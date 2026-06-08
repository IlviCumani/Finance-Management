"use client"

import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { useForm } from "@/hooks/use-form"
import { FieldGroup } from "@/components/ui/field"
import { createTransaction } from "../../actions"
import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFormField,
  SelectFormField,
  TextareaFormField,
  DateFormField,
} from "@/components/form-fields"
import { Controller } from "react-hook-form"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { Money03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Account } from "@/types/account/account-types"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"
import { useTransactionFormSchema } from "./use-form-schema"

type TransactionsFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Array<Account>
  transactionCategories: Array<TransactionCategory>
}

const defaultValues = {
  name: "",
  amount: "",
  accountId: "",
  toAccountId: null,
  description: "",
  transactionCategoryId: "",
  transactionDate: new Date(),
}

export function TransactionsForm({
  open,
  onOpenChange,
  accounts,
  transactionCategories,
}: TransactionsFormProps) {
  const t = useTranslations("transactions.form")
  const formSchema = useTransactionFormSchema()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
    },
  })
  const [error, setError] = useState<string | undefined>(undefined)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(() => true)
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("amount", values.amount)
    formData.append("accountId", values.accountId)
    formData.append("description", values.description)
    formData.append("transactionCategoryId", values.transactionCategoryId)
    formData.append("transactionDate", values.transactionDate.toISOString())
    const transactionType = transactionCategories.find(
      (category) => category.id === values.transactionCategoryId
    )!.type
    if (!transactionType) {
      setError(t("validation.transactionCategoryNotFound"))
      return
    }
    formData.append("transactionType", transactionType)
    if (values.toAccountId) {
      formData.append("toAccountId", values.toAccountId)
    }
    const { error } = await createTransaction(formData)
    if (error) {
      setError(error)
    } else {
      onOpenChange(false)
      setError(undefined)
      toast.success(t("createdSuccess"), {
        position: "top-right",
      })
      form.reset(defaultValues)
    }
    setIsLoading(() => false)
  }

  const { watch } = form

  const transactionCategory = watch("transactionCategoryId")
  const category = transactionCategories.find(
    (category) => category.id === transactionCategory
  )
  const isTransferCategory = category?.type === "transfer"

  const selectedAccount = watch("accountId")
  const toAccounts = accounts.filter(
    (account) => account.id !== selectedAccount
  )

  return (
    <FormSheetWrapper
      title={t("addTitle")}
      formId="transactions-form"
      open={open}
      onOpenChange={onOpenChange}
      error={error}
      isLoading={isLoading}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} id="transactions-form">
        <FieldGroup className="max-h-[calc(100dvh-200px)] overflow-y-auto">
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
            name="amount"
            render={({ field, fieldState }) => (
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
            )}
          />
          <Controller
            control={form.control}
            name="transactionCategoryId"
            render={({ field, fieldState }) => (
              <SelectFormField
                label={t("transactionCategory")}
                field={field}
                fieldState={fieldState}
                addOptionUrl="/settings/transaction-categories"
                options={transactionCategories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            )}
          />
          <Controller
            control={form.control}
            name="accountId"
            render={({ field, fieldState }) => (
              <SelectFormField
                label={isTransferCategory ? t("fromAccount") : t("account")}
                field={field}
                fieldState={fieldState}
                addOptionUrl="/accounts"
                options={accounts.map((account) => ({
                  label: account.name,
                  value: account.id,
                }))}
              />
            )}
          />
          {isTransferCategory && (
            <Controller
              control={form.control}
              name="toAccountId"
              render={({ field, fieldState }) => (
                <SelectFormField
                  label={t("toAccount")}
                  field={field}
                  fieldState={fieldState}
                  options={toAccounts.map((account) => ({
                    label: account.name,
                    value: account.id,
                  }))}
                />
              )}
            />
          )}

          <Controller
            control={form.control}
            name="transactionDate"
            render={({ field, fieldState }) => (
              <DateFormField
                label={t("transactionDate")}
                field={field}
                fieldState={fieldState}
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <TextareaFormField
                label={t("description")}
                field={field}
                fieldState={fieldState}
              />
            )}
          />
        </FieldGroup>
      </form>
    </FormSheetWrapper>
  )
}
