"use server"

import {
  Transaction_Response,
  Transaction,
} from "@/types/transaction/transaction-types"
import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import { getAccountsByIds } from "@/lib/supabase/queries/account"
import { getTransactionCategoriesByIds } from "@/lib/supabase/queries/transaction"

import {
  createNonTransferTransaction,
  createTransferTransaction,
} from "./util/create-helpers"
import {
  deleteNonTransferTransaction,
  deleteTransferTransaction,
} from "./util/delete-helpers"

type CreateUpdateDeleteTransactionResponse = {
  success?: boolean
  error?: string
}

export async function getTransactions(): Promise<{
  data?: Array<Transaction>
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()
  const {
    data,
    error,
  }: { data: Array<Transaction_Response> | null; error: Error | null } =
    await supabase.from("transactions").select("*").eq("user_id", user.id)

  if (error) {
    return {
      error: error.message,
    }
  }

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

export async function createTransaction(
  _formData: FormData
): Promise<CreateUpdateDeleteTransactionResponse> {
  const toAccountId = _formData.get("toAccountId") as string | null

  if (!toAccountId) {
    return await createNonTransferTransaction(_formData)
  } else {
    return await createTransferTransaction(_formData)
  }
}

export async function deleteTransaction(
  _transaction: Transaction
): Promise<CreateUpdateDeleteTransactionResponse> {
  const transactionType = _transaction.transactionType

  if (transactionType === "transfer") {
    return await deleteTransferTransaction(_transaction)
  } else {
    return await deleteNonTransferTransaction(_transaction)
  }
}
