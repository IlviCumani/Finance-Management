import * as z from "zod"

export type BudgetCategoryValidationMessages = {
  nameRequired: string
  descriptionRequired: string
  budgetLimitRequired: string
  budgetLimitWholeNumber: string
  transactionCategoriesRequired: string
  budgetLimitMin: string
  budgetLimitLessThanTotal: string
  transactionCategoriesAlreadyAssigned: string
}

export type BudgetCategoryFormInput = {
  name: string
  description: string
  budgetLimit: string
  transactionCategoryIds: Array<string>
}

export type ValidatedBudgetCategoryInput = {
  name: string
  description: string
  budgetLimit: number
  transactionCategoryIds: Array<string>
}

export function normalizeTransactionCategoryIds(
  ids: Array<string> | string | null | undefined
): Array<string> {
  if (Array.isArray(ids)) {
    return ids
  }

  if (typeof ids === "string" && ids.length > 0) {
    return [ids]
  }

  return []
}

export function createBudgetCategoryFormSchema(
  totalBudget: number,
  messages: BudgetCategoryValidationMessages
) {
  return z
    .object({
      name: z.string().min(1, messages.nameRequired),
      description: z.string().min(1, messages.descriptionRequired),
      budgetLimit: z
        .string()
        .min(1, messages.budgetLimitRequired)
        .regex(/^\d+$/, messages.budgetLimitWholeNumber),
      transactionCategoryIds: z
        .array(z.string())
        .min(1, messages.transactionCategoriesRequired),
    })
    .refine((data) => Number(data.budgetLimit) > 0, {
      path: ["budgetLimit"],
      message: messages.budgetLimitMin,
    })
    .refine((data) => Number(data.budgetLimit) < totalBudget, {
      path: ["budgetLimit"],
      message: messages.budgetLimitLessThanTotal,
    })
}

export function parseBudgetCategoryFormData(
  formData: FormData
): BudgetCategoryFormInput {
  return {
    name: (formData.get("name") as string) ?? "",
    description: (formData.get("description") as string) ?? "",
    budgetLimit: (formData.get("budgetLimit") as string) ?? "",
    transactionCategoryIds: formData.getAll(
      "transactionCategoryIds"
    ) as Array<string>,
  }
}

export function collectAssignedTransactionCategoryIds(
  budgetCategories: Array<{
    id: string
    transaction_category_ids: Array<string> | string | null | undefined
  }>,
  excludeBudgetId?: string
): Set<string> {
  const assignedIds = new Set<string>()

  for (const category of budgetCategories) {
    if (excludeBudgetId && category.id === excludeBudgetId) {
      continue
    }

    for (const categoryId of normalizeTransactionCategoryIds(
      category.transaction_category_ids
    )) {
      assignedIds.add(categoryId)
    }
  }

  return assignedIds
}

export function findConflictingTransactionCategoryIds(
  requestedIds: Array<string>,
  assignedIds: Set<string>
): Array<string> {
  return requestedIds.filter((categoryId) => assignedIds.has(categoryId))
}

export function validateBudgetCategoryInput(
  input: BudgetCategoryFormInput,
  totalBudget: number,
  messages: BudgetCategoryValidationMessages,
  assignedTransactionCategoryIds: Set<string>
):
  | { success: true; data: ValidatedBudgetCategoryInput }
  | { success: false; error: string } {
  const schema = createBudgetCategoryFormSchema(totalBudget, messages)
  const parsed = schema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? messages.budgetLimitRequired,
    }
  }

  const conflicts = findConflictingTransactionCategoryIds(
    parsed.data.transactionCategoryIds,
    assignedTransactionCategoryIds
  )

  if (conflicts.length > 0) {
    return {
      success: false,
      error: messages.transactionCategoriesAlreadyAssigned,
    }
  }

  return {
    success: true,
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      budgetLimit: Number(parsed.data.budgetLimit),
      transactionCategoryIds: parsed.data.transactionCategoryIds,
    },
  }
}
