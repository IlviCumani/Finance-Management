import { requireUser } from "@/lib/require-user"
import { TransactionCategory } from "@/types/transaction-category/transaction-category-types"

import { createActionClient } from "../actions"
import {
  Transaction,
  Transaction_Response,
} from "@/types/transaction/transaction-types"
import { getAccountsByIds } from "./account"

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

export async function mapTransactions(
  data: Array<Transaction_Response>
): Promise<{
  data?: Array<Transaction> | null
  error?: string
}> {
  const allAccountIds = data?.map((transaction) => transaction.account_id)
  const allTransferredToAccountIds = data
    ?.map((transaction) => transaction.transferred_to_account_id)
    .filter((id) => id !== null)

  const allUniqueAccountIds = [
    ...new Set([
      ...(allAccountIds ?? []),
      ...(allTransferredToAccountIds ?? []),
    ]),
  ]

  const { data: accounts, error: accountsError } = await getAccountsByIds(
    allUniqueAccountIds as string[]
  )

  if (accountsError) {
    return {
      error: accountsError,
    }
  }

  const allTransactionCategoryIds = data?.map(
    (transaction) => transaction.transaction_category_id
  )

  const { data: transactionCategories, error: transactionCategoriesError } =
    await getTransactionCategoriesByIds(allTransactionCategoryIds ?? [])

  if (transactionCategoriesError) {
    return {
      error: transactionCategoriesError,
    }
  }

  const mappedData: Array<Transaction> =
    data?.map((transaction) => ({
      id: transaction.id,
      userId: transaction.user_id,
      account:
        accounts?.find((account) => account.id === transaction.account_id) ??
        null,
      transferredToAccount:
        accounts?.find(
          (account) => account.id === transaction.transferred_to_account_id
        ) ?? null,
      transactionCategory:
        transactionCategories?.find(
          (category) => category.id === transaction.transaction_category_id
        ) ?? null,
      name: transaction.name,
      description: transaction.description,
      amount: transaction.amount,
      transactionDate: transaction.transaction_date,
      transactionType: transaction.transaction_type,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    })) ?? []

  return {
    data: mappedData,
  }
}

export async function getTransactionsByDateRange(
  startDate: string,
  endDate: string
): Promise<{
  data?: Array<Transaction> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)

  if (error) {
    return {
      error: error.message,
    }
  }

  const { data: mappedData, error: mappedDataError } = await mapTransactions(
    data ?? []
  )

  if (mappedDataError) {
    return {
      error: mappedDataError,
    }
  }

  return {
    data: mappedData,
  }
}
