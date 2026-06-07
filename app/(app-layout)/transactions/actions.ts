"use server"

import {
  Transaction_Response,
  Transaction,
} from "@/types/transaction/transaction-types"
import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import { mapTransactions } from "@/lib/supabase/queries/transaction"

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

  const { data: mappedData, error: mappedDataError } = await mapTransactions(
    data ?? []
  )

  if (mappedDataError) {
    return {
      error: mappedDataError,
    }
  }

  return {
    data: mappedData ?? [],
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
