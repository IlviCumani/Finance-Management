"use server"

import { createActionClient } from "@/lib/supabase/actions"
import { requireUser } from "@/lib/require-user"
import {
  TransactionCategory_Response,
  TransactionCategoryType,
} from "@/types/transaction-category/transaction-category-types"
import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

const PATH = "/settings/transaction-categories"

export async function getTransactionCategories(): Promise<{
  data?: Array<TransactionCategory_Response>
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("transaction_categories")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    const t = await getTranslations("settings.transactionCategories.actions")
    return {
      error: error.message || t("fetchError"),
    }
  }

  return {
    data,
  }
}

export async function deleteTransactionCategory(id: string): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()

  const { error } = await supabase
    .from("transaction_categories")
    .delete()
    .eq("id", id)

  if (error) {
    const t = await getTranslations("settings.transactionCategories.actions")
    return {
      error: error.message || t("deleteError"),
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function createTransactionCategory(formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()
  const user = await requireUser()

  const name = formData.get("name") as string
  const type = formData.get("type") as TransactionCategoryType

  const { error } = await supabase.from("transaction_categories").insert({
    user_id: user.id,
    name,
    type,
  })

  if (error) {
    const t = await getTranslations("settings.transactionCategories.actions")
    return {
      error: error.message || t("createError"),
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}

export async function updateTransactionCategory(formData: FormData): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createActionClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const type = formData.get("type") as TransactionCategoryType

  const { error } = await supabase
    .from("transaction_categories")
    .update({
      name,
      type,
    })
    .eq("id", id)

  if (error) {
    const t = await getTranslations("settings.transactionCategories.actions")
    return {
      error: error.message || t("updateError"),
    }
  }

  revalidatePath(PATH)

  return {
    success: true,
  }
}
