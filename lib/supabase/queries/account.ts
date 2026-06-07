import { requireUser } from "@/lib/require-user"
import { createActionClient } from "../actions"
import { Account_Response, Account } from "@/types/account/account-types"

export async function getAccounts(): Promise<{
  data?: Array<Account> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const {
    data,
    error,
  }: { data: Array<Account_Response> | null; error: Error | null } =
    await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)

  if (error) {
    return {
      error: error.message,
    }
  }

  const mappedData: Array<Account> =
    data?.map((account) => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      currentBalance: account.current_balance,
      currency: account.currency,
      isArchived: account.is_archived,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
    })) ?? []

  return {
    data: mappedData,
  }
}

export async function getAccountById(id: string): Promise<{
  data?: Account | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return {
      error: error.message,
    }
  }

  const mappedData: Account = {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    currentBalance: data.current_balance,
    currency: data.currency,
    isArchived: data.is_archived,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }

  return {
    data: mappedData,
  }
}

export async function getAccountsByIds(ids: string[]): Promise<{
  data?: Array<Account> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select("*")
    .in("id", ids ?? [])
    .eq("user_id", user.id)
    .eq("is_archived", false)

  if (accountsError) {
    return {
      error: accountsError.message,
    }
  }

  const mappedData: Array<Account> =
    accounts?.map((account) => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      currentBalance: account.current_balance,
      currency: account.currency,
      isArchived: account.is_archived,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
    })) ?? []

  return {
    data: mappedData,
  }
}

export async function getActiveAndInactiveAccounts(): Promise<{
  data?: Array<Account> | null
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)

  if (accountsError) {
    return {
      error: accountsError.message,
    }
  }

  const mappedData: Array<Account> =
    accounts?.map((account) => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      currentBalance: account.current_balance,
      currency: account.currency,
      isArchived: account.is_archived,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
    })) ?? []

  return {
    data: mappedData,
  }
}
