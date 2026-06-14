import { createBudgetCategoryFormSchema } from "@/lib/budget/budget-category-validation"
import { useTranslations } from "next-intl"
import { useMemo } from "react"

export function useBudgetCategoryFormSchema(totalBudget: number) {
  const tValidation = useTranslations("budgets.validation")

  const messages = useMemo(
    () => ({
      nameRequired: tValidation("nameRequired"),
      descriptionRequired: tValidation("descriptionRequired"),
      budgetLimitRequired: tValidation("budgetLimitRequired"),
      budgetLimitWholeNumber: tValidation("budgetLimitWholeNumber"),
      transactionCategoriesRequired: tValidation(
        "transactionCategoriesRequired"
      ),
      budgetLimitMin: tValidation("budgetLimitMin"),
      budgetLimitLessThanTotal: tValidation("budgetLimitLessThanTotal"),
      transactionCategoriesAlreadyAssigned: tValidation(
        "transactionCategoriesAlreadyAssigned"
      ),
    }),
    [tValidation]
  )

  const formSchema = useMemo(
    () => createBudgetCategoryFormSchema(totalBudget, messages),
    [messages, totalBudget]
  )

  return formSchema
}
