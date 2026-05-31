"use server"

import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import { Account_Response } from "@/types/account/account-types"
import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

const PATH = "/accounts"

export async function getAccounts(): Promise<{
  data?: Array<Account_Response>
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    const t = await getTranslations("accounts.actions")
    return {
      error: error.message || t("fetchError"),
    }
  }

  return {
    data,
  }
}

export async function createAccount(formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const name = formData.get("name") as string
  const currentBalance = formData.get("currentBalance") as string
  const currency = formData.get("currency") as string

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name,
    current_balance: Number(currentBalance),
    currency,
    is_archived: false,
  })

  if (error) {
    const t = await getTranslations("accounts.actions")
    return {
      error: error.message || t("createError"),
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function updateAccount(formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const currency = formData.get("currency") as string
  const isArchived = formData.get("isArchived") === "true"

  const { error } = await supabase
    .from("accounts")
    .update({
      name,
      currency,
      is_archived: isArchived,
    })
    .eq("id", id)

  if (error) {
    const t = await getTranslations("accounts.actions")
    return {
      error: error.message || t("updateError"),
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function deleteAccount(id: string): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()

  const { error } = await supabase.from("accounts").delete().eq("id", id)

  if (error) {
    const t = await getTranslations("accounts.actions")
    return {
      error: error.message || t("deleteError"),
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}
