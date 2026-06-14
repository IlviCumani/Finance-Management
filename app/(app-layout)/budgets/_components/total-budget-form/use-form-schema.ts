import { useTranslations } from "next-intl"
import { useMemo } from "react"
import * as z from "zod"

export function useTotalBudgetFormSchema() {
  const tValidation = useTranslations("budgets.validation")

  const formSchema = useMemo(
    () =>
      z
        .object({
          totalBudget: z
            .string()
            .min(1, tValidation("totalBudgetRequired"))
            .regex(/^\d+$/, tValidation("totalBudgetWholeNumber")),
        })
        .refine((data) => Number(data.totalBudget) > 0, {
          path: ["totalBudget"],
          message: tValidation("totalBudgetMin"),
        }),
    [tValidation]
  )

  return formSchema
}
