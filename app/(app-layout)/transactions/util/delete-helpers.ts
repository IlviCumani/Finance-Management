import { createActionClient } from "@/lib/supabase/actions"
import { Transaction } from "@/types/transaction/transaction-types"
import { revalidatePath } from "next/cache"

type Response = {
  success?: boolean
  error?: string
}

const PATH = "/transactions"

async function updateAccountBalance(accountId: string, amount: number) {
  const supabase = await createActionClient()
  return await supabase
    .from("accounts")
    .update({
      current_balance: amount,
    })
    .eq("id", accountId)
}

async function deleteTransaction(transactionId: string) {
  const supabase = await createActionClient()
  return await supabase.from("transactions").delete().eq("id", transactionId)
}

export async function deleteTransferTransaction(
  transaction: Transaction
): Promise<Response> {
  const transferToAccountBalance =
    transaction.transferredToAccount?.currentBalance || 0
  const transferFromAccountBalance = transaction.account?.currentBalance || 0

  const newTransferToAccountBalance =
    transferToAccountBalance - transaction.amount
  const newTransferFromAccountBalance =
    transferFromAccountBalance + transaction.amount

  const { error: updateTransferToAccountError } = await updateAccountBalance(
    transaction.transferredToAccount!.id,
    newTransferToAccountBalance
  )
  if (updateTransferToAccountError) {
    return {
      error: updateTransferToAccountError.message,
    }
  }

  const { error: updateTransferFromAccountError } = await updateAccountBalance(
    transaction.account!.id,
    newTransferFromAccountBalance
  )

  if (updateTransferFromAccountError) {
    return {
      error: updateTransferFromAccountError.message,
    }
  }

  const { error: deleteTransactionError } = await deleteTransaction(
    transaction.id
  )

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

export async function deleteNonTransferTransaction(
  transaction: Transaction
): Promise<Response> {
  const IsExpense = transaction.transactionType === "expense"
  const currentBalance = transaction.account?.currentBalance || 0
  const newCurrentBalance = IsExpense
    ? currentBalance + transaction.amount
    : currentBalance - transaction.amount

  const { error: updateAccountError } = await updateAccountBalance(
    transaction.account!.id,
    newCurrentBalance
  )

  if (updateAccountError) {
    return {
      error: updateAccountError.message,
    }
  }

  const { error: deleteTransactionError } = await deleteTransaction(
    transaction.id
  )

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
