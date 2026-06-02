import { TransactionCategoryType } from "@/types/transaction-category/transaction-category-types"
import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import { revalidatePath } from "next/cache"

type Response = {
  success?: boolean
  error?: string
}

const PATH = "/transactions"

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

export async function createNonTransferTransaction(
  _formData: FormData
): Promise<Response> {
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

export async function createTransferTransaction(
  _formData: FormData
): Promise<Response> {
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
