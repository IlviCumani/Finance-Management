"use server"

import {
  collectAssignedTransactionCategoryIds,
  normalizeTransactionCategoryIds,
  parseBudgetCategoryFormData,
  validateBudgetCategoryInput,
  type BudgetCategoryValidationMessages,
} from "@/lib/budget/budget-category-validation"
import { requireUser } from "@/lib/require-user"
import { createActionClient } from "@/lib/supabase/actions"
import { getTransactionsByDateRange } from "@/lib/supabase/queries/transaction"
import type { BudgetCategory } from "@/types/budget/budget-types"
import { TransactionCategoryTypeEnum } from "@/types/transaction-category/transaction-category-types"
import { startOfMonth, endOfMonth } from "date-fns"
import { getTranslations } from "next-intl/server"
import { revalidatePath } from "next/cache"

const PATH = "/budgets"

async function getBudgetCategoryValidationMessages(): Promise<BudgetCategoryValidationMessages> {
  const t = await getTranslations("budgets.validation")

  return {
    nameRequired: t("nameRequired"),
    descriptionRequired: t("descriptionRequired"),
    budgetLimitRequired: t("budgetLimitRequired"),
    budgetLimitWholeNumber: t("budgetLimitWholeNumber"),
    transactionCategoriesRequired: t("transactionCategoriesRequired"),
    budgetLimitMin: t("budgetLimitMin"),
    budgetLimitLessThanTotal: t("budgetLimitLessThanTotal"),
    transactionCategoriesAlreadyAssigned: t(
      "transactionCategoriesAlreadyAssigned"
    ),
  }
}

async function validateBudgetCategoryMutation(
  formData: FormData,
  excludeBudgetId?: string
): Promise<
  | {
      success: true
      supabase: Awaited<ReturnType<typeof createActionClient>>
      userId: string
      data: {
        name: string
        description: string
        budgetLimit: number
        transactionCategoryIds: Array<string>
      }
    }
  | { success: false; error: string }
> {
  const supabase = await createActionClient()
  const user = await requireUser()
  const messages = await getBudgetCategoryValidationMessages()
  const input = parseBudgetCategoryFormData(formData)

  const [profileResult, categoriesResult] = await Promise.all([
    supabase.from("profiles").select("total_budget").eq("id", user.id).single(),
    supabase
      .from("budget_categories")
      .select("id, transaction_category_ids")
      .eq("user_id", user.id),
  ])

  if (profileResult.error) {
    return {
      success: false,
      error: profileResult.error.message,
    }
  }

  if (categoriesResult.error) {
    return {
      success: false,
      error: categoriesResult.error.message,
    }
  }

  const totalBudget = profileResult.data?.total_budget ?? 0
  const assignedTransactionCategoryIds = collectAssignedTransactionCategoryIds(
    categoriesResult.data ?? [],
    excludeBudgetId
  )
  const validationResult = validateBudgetCategoryInput(
    input,
    totalBudget,
    messages,
    assignedTransactionCategoryIds
  )

  if (!validationResult.success) {
    return validationResult
  }

  return {
    success: true,
    supabase,
    userId: user.id,
    data: validationResult.data,
  }
}

export async function getBudgetsCategories(): Promise<{
  data?: Array<BudgetCategory> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return {
      error: error.message,
    }
  }

  const startOfMonthDate = startOfMonth(new Date())
  const endOfMonthDate = endOfMonth(new Date())

  const transactionsThisMonth = await getTransactionsByDateRange(
    startOfMonthDate.toISOString(),
    endOfMonthDate.toISOString()
  )

  if (transactionsThisMonth.error) {
    return {
      error: transactionsThisMonth.error,
    }
  }

  const transactions = transactionsThisMonth.data ?? []

  return {
    data: data?.map((category) => {
      const affectedCategoryIds = normalizeTransactionCategoryIds(
        category.transaction_category_ids
      )

      const amount = transactions
        .filter(
          (transaction) =>
            transaction.transactionCategory?.id &&
            affectedCategoryIds.includes(transaction.transactionCategory.id) &&
            transaction.transactionType === TransactionCategoryTypeEnum.EXPENSE
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0)

      return {
        id: category.id,
        userId: category.user_id,
        name: category.name,
        description: category.description,
        amount,
        budgetLimit: category.budget_limit,
        transactionCategoryIds: affectedCategoryIds,
      }
    }),
  }
}

export async function createBudgetsCategory(formData: FormData) {
  const validationResult = await validateBudgetCategoryMutation(formData)

  if (!validationResult.success) {
    return {
      error: validationResult.error,
    }
  }

  const { supabase, userId, data } = validationResult

  const { error } = await supabase.from("budget_categories").insert({
    user_id: userId,
    name: data.name,
    description: data.description,
    budget_limit: data.budgetLimit,
    transaction_category_ids: data.transactionCategoryIds,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function updateBudgetsCategory(formData: FormData) {
  const id = formData.get("id") as string
  const validationResult = await validateBudgetCategoryMutation(formData, id)

  if (!validationResult.success) {
    return {
      error: validationResult.error,
    }
  }

  const { supabase, userId, data } = validationResult

  const { error } = await supabase
    .from("budget_categories")
    .update({
      name: data.name,
      description: data.description,
      budget_limit: data.budgetLimit,
      transaction_category_ids: data.transactionCategoryIds,
    })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function deleteBudgetsCategory(id: string) {
  const supabase = await createActionClient()
  const user = await requireUser()
  const { error } = await supabase
    .from("budget_categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function updateTotalBudget(updatedTotalBudget: number) {
  const supabase = await createActionClient()
  const user = await requireUser()
  const { error } = await supabase
    .from("profiles")
    .update({
      total_budget: updatedTotalBudget,
    })
    .eq("id", user.id)

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}
