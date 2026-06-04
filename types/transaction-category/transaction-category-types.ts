export type TransactionCategory = {
  id: string
  userId: string
  name: string
  type: TransactionCategoryType
  createdAt: string
  updatedAt: string
}

export type TransactionCategoryType = "income" | "expense" | "transfer"

export type TransactionCategory_Response = {
  id: string
  user_id: string
  name: string
  type: TransactionCategoryType
  created_at: string
  updated_at: string
}
