"use client"

import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "@/hooks/use-form"
import * as z from "zod"
import { Controller } from "react-hook-form"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { Money03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { FieldGroup } from "@/components/ui/field"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { updateTotalBudget } from "../../actions"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useTotalBudgetFormSchema } from "./use-form-schema"

type TotalBudgetFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalBudget: number
}

export function TotalBudgetForm({
  open,
  onOpenChange,
  totalBudget = 0,
}: TotalBudgetFormProps) {
  const t = useTranslations("budgets.form")
  const tCard = useTranslations("budgets.card")
  const totalBudgetFormSchema = useTotalBudgetFormSchema()

  const form = useForm<z.infer<typeof totalBudgetFormSchema>>({
    resolver: zodResolver(totalBudgetFormSchema),
    defaultValues: {
      totalBudget: totalBudget.toString(),
    },
  })
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: z.infer<typeof totalBudgetFormSchema>) {
    setLoading(true)
    const result = await updateTotalBudget(Number(values.totalBudget))
    if (result.error) {
      setError(result.error)
      toast.error(result.error)
    } else {
      toast.success(tCard("updateSuccess"))
      onOpenChange(false)
      setError(undefined)
    }
    setLoading(false)
  }

  return (
    <FormSheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={t("totalBudgetTitle")}
      formId="total-budget-form"
      error={error}
      isLoading={loading}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} id="total-budget-form">
        <FieldGroup>
          <Controller
            control={form.control}
            name="totalBudget"
            render={({ field, fieldState }) => (
              <InputFormField
                label={t("totalBudget")}
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
        </FieldGroup>
      </form>
    </FormSheetWrapper>
  )
}
