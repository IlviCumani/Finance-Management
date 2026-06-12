export type BudgetCategory = {
  id: string
  name: string
  description: string
  amount: number
  budgetLimit: number
  transactionCategoryIds: Array<string>
  userId: string
}

export type BudgetCategory_Response = {
  id: string
  user_id: string
  name: string
  description: string
  budget_limit: number
  transaction_category_ids: Array<string>
  created_at: string
  updated_at: string
}
