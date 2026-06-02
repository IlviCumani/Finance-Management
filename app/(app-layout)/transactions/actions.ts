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

//** CREATE A TRANSACTION

function getFormValues(formData: FormData) {
  const name = formData.get("name") as string
  const amount = formData.get("amount") as string
  const accountId = formData.get("accountId") as string
  const description = formData.get("description") as string
  const transactionCategoryId = formData.get("transactionCategoryId") as string
  const transactionDate = formData.get("transactionDate") as string
  const transactionType = formData.get(
    "transactionType"
  ) as TransactionCategoryType
  const toAccountId = formData.get("toAccountId") as string | null
  return {
    name,
    amount,
    accountId,
    description,
    transactionCategoryId,
    toAccountId,
    transactionDate,
    transactionType,
  }
}

async function createNonTransferTransaction(
  _formData: FormData
): Promise<CreateUpdateDeleteTransactionResponse> {
  const supabase = await createActionClient()
  const user = await requireUser()
  const {
    name,
    amount,
    accountId,
    description,
    transactionCategoryId,
    transactionDate,
    transactionType,
  } = getFormValues(_formData)

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
  const supabase = await createActionClient()
  const user = await requireUser()
  const {
    name,
    amount,
    accountId,
    toAccountId,
    description,
    transactionCategoryId,
    transactionDate,
    transactionType,
  } = getFormValues(_formData)

  const { error: findAccountsError, data: accountsData } = await supabase
    .from("accounts")
    .select("current_balance, id")
    .in("id", [accountId, toAccountId])
    .returns<Array<{ id: string; current_balance: number }>>()

  if (findAccountsError) {
    return {
      error: findAccountsError.message,
    }
  }

  const transferToAccountBalance =
    accountsData?.find((account) => account.id === toAccountId)
      ?.current_balance || 0
  const transferFromAccountBalance =
    accountsData?.find((account) => account.id === accountId)
      ?.current_balance || 0

  const newTransferToAccountBalance = transferToAccountBalance + Number(amount)
  const newTransferFromAccountBalance =
    transferFromAccountBalance - Number(amount)

  const { error: updateTransferToAccountError } = await supabase
    .from("accounts")
    .update({
      current_balance: newTransferToAccountBalance,
    })
    .eq("id", toAccountId)

  if (updateTransferToAccountError) {
    return {
      error: updateTransferToAccountError.message,
    }
  }

  const { error: updateTransferFromAccountError } = await supabase
    .from("accounts")
    .update({
      current_balance: newTransferFromAccountBalance,
    })
    .eq("id", accountId)

  if (updateTransferFromAccountError) {
    return {
      error: updateTransferFromAccountError.message,
    }
  }

  const { error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      name,
      amount,
      account_id: accountId,
      transferred_to_account_id: toAccountId,
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

async function deleteTransferTransaction(
  transaction: Transaction
): Promise<CreateUpdateDeleteTransactionResponse> {
  const supabase = await createActionClient()
  const transferToAccountBalance =
    transaction.transferredToAccount?.currentBalance || 0
  const transferFromAccountBalance = transaction.account?.currentBalance || 0

  const newTransferToAccountBalance =
    transferToAccountBalance - transaction.amount
  const newTransferFromAccountBalance =
    transferFromAccountBalance + transaction.amount

  const { error: updateTransferToAccountError } = await supabase
    .from("accounts")
    .update({
      current_balance: newTransferToAccountBalance,
    })
    .eq("id", transaction.transferredToAccount?.id)

  if (updateTransferToAccountError) {
    return {
      error: updateTransferToAccountError.message,
    }
  }

  const { error: updateTransferFromAccountError } = await supabase
    .from("accounts")
    .update({
      current_balance: newTransferFromAccountBalance,
    })
    .eq("id", transaction.account?.id)

  if (updateTransferFromAccountError) {
    return {
      error: updateTransferFromAccountError.message,
    }
  }

  const { error: deleteTransactionError } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transaction.id)

  if (deleteTransactionError) {
    return {
      error: deleteTransactionError.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

async function deleteNonTransferTransaction(
  transaction: Transaction
): Promise<CreateUpdateDeleteTransactionResponse> {
  const supabase = await createActionClient()

  const IsExpense = transaction.transactionType === "expense"
  const currentBalance = transaction.account?.currentBalance || 0
  const newCurrentBalance = IsExpense
    ? currentBalance + transaction.amount
    : currentBalance - transaction.amount

  const { error: updateAccountError } = await supabase
    .from("accounts")
    .update({
      current_balance: newCurrentBalance,
    })
    .eq("id", transaction.account?.id)

  if (updateAccountError) {
    return {
      error: updateAccountError.message,
    }
  }

  const { error: deleteTransactionError } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transaction.id)

  if (deleteTransactionError) {
    return {
      error: deleteTransactionError.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
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
