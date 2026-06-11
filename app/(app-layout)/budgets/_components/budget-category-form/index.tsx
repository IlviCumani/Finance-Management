"use client"
import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"

type BudgetFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BudgetForm({ open, onOpenChange }: BudgetFormProps) {
  return (
    <FormSheetWrapper
      title="Budget"
      formId="budget-form"
      open={open}
      onOpenChange={onOpenChange}
    ></FormSheetWrapper>
  )
}
