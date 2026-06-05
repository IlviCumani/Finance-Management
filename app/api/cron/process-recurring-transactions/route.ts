import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { addDays, addWeeks, addMonths, addYears } from "date-fns"
import type { RecurringTransactionFrequency } from "@/types/recurring-transactions/recurring-transactions-type"

function computeNextRunAt(
  currentNextRunAt: string,
  frequency: RecurringTransactionFrequency
): string {
  const base = new Date(currentNextRunAt)

  switch (frequency) {
    case "daily":
      return addDays(base, 1).toISOString()
    case "weekly":
      return addWeeks(base, 1).toISOString()
    case "monthly":
      return addMonths(base, 1).toISOString()
    case "quarterly":
      return addMonths(base, 3).toISOString()
    case "yearly":
      return addYears(base, 1).toISOString()
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()

  const { data: dueRecurring, error: fetchError } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("is_active", true)
    .lte("next_run_at", now)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!dueRecurring || dueRecurring.length === 0) {
    return NextResponse.json({ processed: 0, skipped: 0, errors: 0 })
  }

  const userIds = [...new Set(dueRecurring.map((r) => r.user_id as string))]

  const { data: subscriptionCategories, error: categoriesError } =
    await supabase
      .from("transaction_categories")
      .select("id, user_id")
      .eq("type", "subscription")
      .in("user_id", userIds)
      .single()

  if (categoriesError) {
    return NextResponse.json(
      { error: categoriesError.message },
      { status: 500 }
    )
  }

  const categoryByUserId = new Map<string, string>()
  categoryByUserId.set(
    subscriptionCategories?.user_id,
    subscriptionCategories?.id
  )

  const accountIds = [
    ...new Set(dueRecurring.map((r) => r.account_id as string)),
  ]

  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select("id, current_balance")
    .in("id", accountIds)

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 })
  }

  const balanceByAccountId = new Map<string, number>()
  for (const acct of accounts ?? []) {
    balanceByAccountId.set(acct.id, acct.current_balance)
  }

  let processed = 0
  let skipped = 0
  let errors = 0

  for (const recurring of dueRecurring) {
    const categoryId = categoryByUserId.get(recurring.user_id)
    if (!categoryId) {
      console.warn(
        `No subscription category found for user ${recurring.user_id} — skipping recurring transaction ${recurring.id}`
      )
      skipped++
      continue
    }

    try {
      const currentBalance = balanceByAccountId.get(recurring.account_id) ?? 0
      const newBalance = currentBalance - recurring.amount

      const { error: insertError } = await supabase
        .from("transactions")
        .insert({
          user_id: recurring.user_id,
          name: `${recurring.name} Subscription`,
          description: recurring.description ?? null,
          amount: recurring.amount,
          account_id: recurring.account_id,
          transaction_category_id: categoryId,
          transaction_date: now,
          transaction_type: "subscription",
        })

      if (insertError) {
        console.error(
          `Failed to insert transaction for recurring ${recurring.id}:`,
          insertError.message
        )
        errors++
        continue
      }

      const { error: balanceError } = await supabase
        .from("accounts")
        .update({ current_balance: newBalance })
        .eq("id", recurring.account_id)

      if (balanceError) {
        console.error(
          `Failed to update balance for account ${recurring.account_id}:`,
          balanceError.message
        )
        errors++
        continue
      }

      balanceByAccountId.set(recurring.account_id, newBalance)

      const newNextRunAt = computeNextRunAt(
        recurring.next_run_at,
        recurring.frequency as RecurringTransactionFrequency
      )

      const { error: updateError } = await supabase
        .from("recurring_transactions")
        .update({
          next_run_at: newNextRunAt,
          last_run_at: now,
        })
        .eq("id", recurring.id)

      if (updateError) {
        console.error(
          `Failed to update recurring transaction ${recurring.id}:`,
          updateError.message
        )
        errors++
        continue
      }

      processed++
    } catch (err) {
      console.error(
        `Unexpected error processing recurring ${recurring.id}:`,
        err
      )
      errors++
    }
  }

  return NextResponse.json({ processed, skipped, errors })
}
