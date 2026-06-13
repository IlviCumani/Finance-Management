"use client"
import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { useForm } from "@/hooks/use-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FieldGroup } from "@/components/ui/field"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { MultiSelectFormField } from "@/components/form-fields/multi-select-form-field"
import { Controller } from "react-hook-form"
import { useEffect, useState } from "react"
import { BudgetCategory } from "@/types/budget/budget-types"
import { TextareaFormField } from "@/components/form-fields"
import { useBudgetContext } from "../../context/budget-context"
import { createBudgetsCategory } from "../../actions"
import { toast } from "sonner"

type BudgetFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  budgetCategory?: BudgetCategory
  totalBudget: number
}

export function BudgetForm({
  open,
  onOpenChange,
  budgetCategory,
  totalBudget,
}: BudgetFormProps) {
  const budgetCategoryFormSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().min(1, "Description is required"),
      budgetLimit: z
        .string()
        .min(1, "Budget Limit is required")
        .regex(/^\d+$/, "Budget Limit must be a number"),
      transactionCategoryIds: z
        .array(z.string())
        .min(1, "At least one transaction category is required"),
    })
    .refine((data) => Number(data.budgetLimit) > 0, {
      path: ["budgetLimit"],
      message: "Budget Limit must be greater than 0",
    })
    .refine((data) => Number(data.budgetLimit) < totalBudget, {
      path: ["budgetLimit"],
      message: "Budget Limit must be less than total budget",
    })

  const form = useForm<z.infer<typeof budgetCategoryFormSchema>>({
    resolver: zodResolver(budgetCategoryFormSchema),
    defaultValues: {
      name: budgetCategory?.name || "",
      description: budgetCategory?.description || "",
      budgetLimit: budgetCategory?.budgetLimit.toString() || "",
      transactionCategoryIds: budgetCategory?.transactionCategoryIds || [],
    },
  })

  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const { transactionCategories, allTransactionCategories } = useBudgetContext()
  const selectedTransactionCategories = allTransactionCategories.filter(
    (category) => budgetCategory?.transactionCategoryIds.includes(category.id)
  )

  const { reset } = form

  useEffect(() => {
    if (open) {
      reset({
        name: budgetCategory?.name || "",
        description: budgetCategory?.description || "",
        budgetLimit: budgetCategory?.budgetLimit.toString() || "",
        transactionCategoryIds: budgetCategory?.transactionCategoryIds || [],
      })
    }
  }, [budgetCategory, reset, open])

  async function onSubmit(values: z.infer<typeof budgetCategoryFormSchema>) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("budgetLimit", values.budgetLimit)
    values.transactionCategoryIds.forEach((transactionCategoryId) => {
      formData.append("transactionCategoryIds", transactionCategoryId)
    })

    if (budgetCategory) {
      formData.append("id", budgetCategory.id)
    } else {
      const { error } = await createBudgetsCategory(formData)
      if (error) {
        setError(error)
        setIsLoading(false)
        toast.error(error, {
          position: "top-right",
        })
      } else {
        onOpenChange(false)
        setError(undefined)
        setIsLoading(false)
        form.reset()
        toast.success("Budget category created successfully", {
          position: "top-right",
        })
      }
    }
  }

  return (
    <FormSheetWrapper
      title={budgetCategory ? "Edit Budget" : "Add Budget"}
      formId="budget-form"
      open={open}
      onOpenChange={onOpenChange}
      error={error}
      isLoading={isLoading}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} id="budget-form">
        <FieldGroup className="">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <InputFormField
                label="Name"
                field={field}
                fieldState={fieldState}
              />
            )}
          />
          <Controller
            control={form.control}
            name="budgetLimit"
            render={({ field, fieldState }) => (
              <InputFormField
                label="Budget Limit"
                field={field}
                fieldState={fieldState}
              />
            )}
          />
          <Controller
            control={form.control}
            name="transactionCategoryIds"
            render={({ field, fieldState }) => (
              <MultiSelectFormField
                label="Transaction Categories Affected By"
                field={field}
                fieldState={fieldState}
                options={[
                  ...selectedTransactionCategories,
                  ...transactionCategories,
                ].map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <TextareaFormField
                label="Description"
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
