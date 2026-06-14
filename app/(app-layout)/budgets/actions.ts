"use server"

import { requireUser } from "@/lib/require-user"
import { createActionClient } from "@/lib/supabase/actions"
import { getTransactionsByDateRange } from "@/lib/supabase/queries/transaction"
import type { BudgetCategory } from "@/types/budget/budget-types"
import { TransactionCategoryTypeEnum } from "@/types/transaction-category/transaction-category-types"
import { startOfMonth, endOfMonth } from "date-fns"
import { revalidatePath } from "next/cache"

const PATH = "/budgets"

function normalizeTransactionCategoryIds(
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
  const supabase = await createActionClient()
  const user = await requireUser()
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const budgetLimit = formData.get("budgetLimit") as string
  const transactionCategoryIds = formData.getAll(
    "transactionCategoryIds"
  ) as Array<string>

  const { error } = await supabase.from("budget_categories").insert({
    user_id: user.id,
    name,
    description,
    budget_limit: Number(budgetLimit),
    transaction_category_ids: transactionCategoryIds,
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
  const supabase = await createActionClient()
  const user = await requireUser()
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const budgetLimit = formData.get("budgetLimit") as string
  const transactionCategoryIds = formData.getAll(
    "transactionCategoryIds"
  ) as Array<string>

  const { error } = await supabase
    .from("budget_categories")
    .update({
      name,
      description,
      budget_limit: Number(budgetLimit),
      transaction_category_ids: transactionCategoryIds,
    })
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
