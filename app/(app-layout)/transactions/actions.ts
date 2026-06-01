"use server"

import { Transaction_Response } from "@/types/transaction/transaction-types"

export async function getTransactions(): Promise<{
  data?: Array<Transaction_Response>
  error?: string
}> {
  return {}
}

export async function createTransaction(_formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  return {}
}

export async function updateTransaction(_formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  return {}
}

export async function deleteTransaction(_id: string): Promise<{
  success?: boolean
  error?: string
}> {
  return {}
}
