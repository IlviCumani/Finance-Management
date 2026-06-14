import { useTranslations } from "next-intl"
import { useMemo } from "react"
import * as z from "zod"

export function useBudgetCategoryFormSchema(totalBudget: number) {
  const tValidation = useTranslations("budgets.validation")

  const formSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, tValidation("nameRequired")),
          description: z.string().min(1, tValidation("descriptionRequired")),
          budgetLimit: z
            .string()
            .min(1, tValidation("budgetLimitRequired"))
            .regex(/^\d+$/, tValidation("budgetLimitWholeNumber")),
          transactionCategoryIds: z
            .array(z.string())
            .min(1, tValidation("transactionCategoriesRequired")),
        })
        .refine((data) => Number(data.budgetLimit) > 0, {
          path: ["budgetLimit"],
          message: tValidation("budgetLimitMin"),
        })
        .refine((data) => Number(data.budgetLimit) < totalBudget, {
          path: ["budgetLimit"],
          message: tValidation("budgetLimitLessThanTotal"),
        }),
    [tValidation, totalBudget]
  )

  return formSchema
}
