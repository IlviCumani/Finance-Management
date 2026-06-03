"use server"

import {
  RecurringTransaction,
  RecurringTransaction_Response,
  RecurringTransactionFrequency,
} from "@/types/recurring-transactions/recurring-transactions-type"
import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import { revalidatePath } from "next/cache"
import { startOfDay } from "date-fns"
import { getAccountsByIds } from "@/lib/supabase/queries/account"

const PATH = "/recurring-transactions"

export async function getRecurringTransactions(): Promise<{
  data?: Array<RecurringTransaction>
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const {
    data,
    error,
  }: {
    data: Array<RecurringTransaction_Response> | null
    error: Error | null
  } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return {
      error: error.message,
    }
  }
  const allAccountIds = data?.map(
    (recurringTransaction) => recurringTransaction.account_id
  )
  const { data: accounts, error: accountsError } = await getAccountsByIds(
    allAccountIds ?? []
  )
  if (accountsError) {
    return {
      error: accountsError,
    }
  }

  const mappedData: Array<RecurringTransaction> =
    data?.map((recurringTransaction) => ({
      id: recurringTransaction.id,
      userId: recurringTransaction.user_id,
      account:
        accounts?.find(
          (account) => account.id === recurringTransaction.account_id
        ) ?? null,
      name: recurringTransaction.name,
      description: recurringTransaction.description ?? undefined,
      amount: recurringTransaction.amount,
      frequency:
        recurringTransaction.frequency as RecurringTransactionFrequency,
      nextRunAt: recurringTransaction.next_run_at,
      lastRunAt: recurringTransaction.last_run_at,
      isActive: recurringTransaction.is_active,
      autoExecute: recurringTransaction.auto_execute,
      createdAt: recurringTransaction.created_at,
      updatedAt: recurringTransaction.updated_at,
    })) ?? []

  return {
    data: mappedData,
  }
}

function validateTimeIsInTheFuture(time: string): boolean {
  const today = new Date()
  const nextRunAtValue = new Date(time)
  return startOfDay(nextRunAtValue) >= startOfDay(today)
}

export async function createRecurringTransaction(formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const amount = formData.get("amount") as string
  const frequency = formData.get("frequency") as string
  const accountId = formData.get("accountId") as string
  const paymentDate = formData.get("paymentDate") as string

  if (!validateTimeIsInTheFuture(paymentDate)) {
    return {
      success: false,
      error: "Payment date must be in the future",
    }
  }

  const { error } = await supabase.from("recurring_transactions").insert({
    user_id: user.id,
    name,
    description,
    amount: Number(amount),
    frequency,
    account_id: accountId,
    next_run_at: new Date(paymentDate).toISOString(),
    last_run_at: null,
    is_active: true,
    auto_execute: false,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function updateRecurringTransaction(formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const amount = formData.get("amount") as string
  const frequency = formData.get("frequency") as string
  const accountId = formData.get("accountId") as string
  const paymentDate = formData.get("paymentDate") as string
  const isActive = formData.get("isActive") === "true"

  if (!validateTimeIsInTheFuture(paymentDate)) {
    return {
      success: false,
      error: "Payment date must be in the future",
    }
  }

  const { error } = await supabase
    .from("recurring_transactions")
    .update({
      name: name,
      description: description,
      amount: Number(amount),
      frequency: frequency,
      account_id: accountId,
      next_run_at: new Date(paymentDate).toISOString(),
      is_active: isActive,
    })
    .eq("id", id)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function deleteRecurringTransaction(id: string): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()

  const { error } = await supabase
    .from("recurring_transactions")
    .delete()
    .eq("id", id)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}
