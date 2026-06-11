"use client"
import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { useForm } from "@/hooks/use-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FieldGroup } from "@/components/ui/field"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { SelectFormField } from "@/components/form-fields/select-form-field"
import { Controller } from "react-hook-form"
import { useEffect, useState } from "react"
import { BudgetCategory } from "@/types/budget/budget-types"
import { TextareaFormField } from "@/components/form-fields"

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
      limit: z
        .string()
        .min(1, "Limit is required")
        .regex(/^\d+$/, "Limit must be a number"),
    })
    .refine((data) => Number(data.limit) > 0, {
      path: ["limit"],
      message: "Limit must be greater than 0",
    })
    .refine((data) => Number(data.limit) < totalBudget, {
      path: ["limit"],
      message: "Limit must be less than total budget",
    })

  const form = useForm<z.infer<typeof budgetCategoryFormSchema>>({
    resolver: zodResolver(budgetCategoryFormSchema),
    defaultValues: {
      name: budgetCategory?.name || "",
      description: budgetCategory?.description || "",
      limit: budgetCategory?.limit.toString() || "",
    },
  })
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const { reset } = form

  useEffect(() => {
    if (open) {
      reset({
        name: budgetCategory?.name || "",
        description: budgetCategory?.description || "",
        limit: budgetCategory?.limit.toString() || "",
      })
    }
  }, [budgetCategory, reset, open])

  async function onSubmit(values: z.infer<typeof budgetCategoryFormSchema>) {
    console.log(values)
  }

  return (
    <FormSheetWrapper
      title="Budget"
      formId="budget-form"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} id="budget-form">
        <FieldGroup>
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
            name="limit"
            render={({ field, fieldState }) => (
              <InputFormField
                label="Limit"
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
