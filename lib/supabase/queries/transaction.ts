import { requireUser } from "@/lib/require-user"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"
import { createActionClient } from "../actions"

export async function getTransactionCategories(): Promise<{
  data?: Array<TransactionCategory> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("transaction_categories")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    return {
      error: error.message,
    }
  }
  const mappedData: Array<TransactionCategory> =
    data?.map((category) => ({
      id: category.id,
      userId: category.user_id,
      name: category.name,
      type: category.type,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      isSystem: category.is_system,
    })) ?? []
  return {
    data: mappedData,
  }
}

export async function getTransactionCategoryById(id: string): Promise<{
  data?: TransactionCategory | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("transaction_categories")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return {
      error: error.message,
    }
  }

  const mappedData: TransactionCategory = {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    type: data.type,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isSystem: data.is_system,
  }

  return {
    data: mappedData,
  }
}

export async function getTransactionCategoriesByIds(ids: string[]): Promise<{
  data?: Array<TransactionCategory> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("transaction_categories")
    .select("*")
    .in("id", ids)
    .eq("user_id", user.id)

  if (error) {
    return {
      error: error.message,
    }
  }
  const mappedData: Array<TransactionCategory> =
    data?.map((category) => ({
      id: category.id,
      userId: category.user_id,
      name: category.name,
      type: category.type,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      isSystem: category.is_system,
    })) ?? []

  return {
    data: mappedData,
  }
}
