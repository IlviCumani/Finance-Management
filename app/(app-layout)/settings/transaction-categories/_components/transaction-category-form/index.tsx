"use client"

import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"
import { useForm } from "@/hooks/use-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@/components/ui/field"
import { Controller } from "react-hook-form"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { SelectFormField } from "@/components/form-fields/select-form-field"
import { useMemo } from "react"
import { TransactionCategoryType } from "@/types/transaction-category/transaction-category-types"
import {
  createTransactionCategory,
  updateTransactionCategory,
} from "../../actions"
import { toast } from "sonner"

const categoryTypes = [
  "income",
  "expense",
  "transfer",
] as const satisfies readonly Exclude<TransactionCategoryType, "subscription">[]

type FormValues = {
  name: string
  type: (typeof categoryTypes)[number]
}

type TransactionCategoryFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: TransactionCategory | undefined
}

export function TransactionCategoryForm({
  open,
  onOpenChange,
  category,
}: TransactionCategoryFormProps) {
  const t = useTranslations("settings.transactionCategories.form")
  const tTable = useTranslations("settings.transactionCategories.table")
  const tValidation = useTranslations(
    "settings.transactionCategories.validation"
  )
  const [error, setError] = useState<string | undefined>(undefined)

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, tValidation("nameRequired")),
        type: z.enum(categoryTypes, {
          message: tValidation("typeInvalid", {
            types: categoryTypes.map((type) => tTable(type)).join(", "),
          }),
        }),
      }),
    [tValidation, tTable]
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      type: (category?.type as FormValues["type"]) || "income",
    },
  })

  const { reset } = form

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name || "",
        type: (category?.type as FormValues["type"]) || "income",
      })
    }
  }, [category, reset, open])

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("type", values.type)

    if (category) {
      formData.append("id", category.id)
      const { error } = await updateTransactionCategory(formData)
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
      const { error } = await createTransactionCategory(formData)
      if (error) {
        setError(error)
      } else {
        onOpenChange(false)
        setError(undefined)
        toast.success(t("createdSuccess"), {
          position: "top-right",
        })
      }
    }
  }

  return (
    <FormSheetWrapper
      title={category ? t("editTitle") : t("addTitle")}
      formId="transaction-category-form"
      open={open}
      onOpenChange={onOpenChange}
      error={error}
      description={t("description")}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="transaction-category-form"
      >
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
            name="type"
            render={({ field, fieldState }) => (
              <SelectFormField
                label={t("type")}
                field={field}
                fieldState={fieldState}
                options={[
                  { label: tTable("income"), value: "income" },
                  { label: tTable("expense"), value: "expense" },
                  { label: tTable("transfer"), value: "transfer" },
                ]}
              />
            )}
          />
        </FieldGroup>
      </form>
    </FormSheetWrapper>
  )
}
