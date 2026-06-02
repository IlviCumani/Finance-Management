"use server"

import {
  Transaction_Response,
  Transaction,
} from "@/types/transaction/transaction-types"
import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import { TransactionCategoryType } from "@/types/transaction-category/transaction-category-types"
import { getAccountsByIds } from "@/lib/supabase/queries/account"
import { getTransactionCategoriesByIds } from "@/lib/supabase/queries/transaction"
import { revalidatePath } from "next/cache"

type CreateUpdateDeleteTransactionResponse = {
  success?: boolean
  error?: string
}

const PATH = "/transactions"

//** GET ALL THE TRANSACTIONS FOR THE CURRENT USER

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

  const { data: accounts, error: accountsError } = await getAccountsByIds(
    allAccountIds ?? []
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

//** CREATE A TRANSACTION

async function createNonTransferTransaction(
  _formData: FormData
): Promise<CreateUpdateDeleteTransactionResponse> {
  const supabase = await createActionClient()
  const user = await requireUser()
  const name = _formData.get("name") as string
  const amount = _formData.get("amount") as string
  const accountId = _formData.get("accountId") as string
  const description = _formData.get("description") as string
  const transactionCategoryId = _formData.get("transactionCategoryId") as string
  const transactionDate = _formData.get("transactionDate") as string
  const transactionType = _formData.get(
    "transactionType"
  ) as TransactionCategoryType

  const { error: findAccountError, data: accountData } = await supabase
    .from("accounts")
    .select("current_balance")
    .eq("id", accountId)
    .single()

  if (findAccountError || !accountData) {
    return {
      error: findAccountError?.message || "Account not found",
    }
  }

  const currentBalance = accountData?.current_balance || 0
  const newCurrentBalance =
    transactionType === "income"
      ? currentBalance + Number(amount)
      : currentBalance - Number(amount)

  const { error: updateAccountError } = await supabase
    .from("accounts")
    .update({
      current_balance: newCurrentBalance,
    })
    .eq("id", accountId)

  if (updateAccountError) {
    return {
      error: updateAccountError.message,
    }
  }

  const { error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      name,
      amount,
      account_id: accountId,
      description,
      transaction_category_id: transactionCategoryId,
      transaction_date: transactionDate,
      transaction_type: transactionType,
    })

  if (transactionError) {
    return {
      error: transactionError.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

async function createTransferTransaction(
  _formData: FormData
): Promise<CreateUpdateDeleteTransactionResponse> {
  return {}
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

//** UPDATE A TRANSACTION

export async function updateTransaction(
  _formData: FormData
): Promise<CreateUpdateDeleteTransactionResponse> {
  return {}
}

export async function deleteTransaction(
  _id: string
): Promise<CreateUpdateDeleteTransactionResponse> {
  return {}
}
