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

const totalBudgetFormSchema = z
  .object({
    totalBudget: z
      .string()
      .min(1, "Total budget is required")
      .regex(/^\d+$/, "Total budget must be a number"),
  })
  .refine((data) => Number(data.totalBudget) > 0, {
    path: ["totalBudget"],
    message: "Total budget must be greater than 0",
  })

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
    setLoading(false)
  }
  return (
    <FormSheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Total Budget"
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
                label="Total Budget"
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
