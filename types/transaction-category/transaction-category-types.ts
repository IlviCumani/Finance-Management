export type TransactionCategory = {
  id: string
  userId: string
  name: string
  type: TransactionCategoryType
  createdAt: string
  updatedAt: string
  isSystem: boolean
}

export type TransactionCategoryType =
  | "income"
  | "expense"
  | "transfer"
  | "subscription"

export type TransactionCategory_Response = {
  id: string
  user_id: string
  name: string
  type: TransactionCategoryType
  created_at: string
  updated_at: string
  is_system: boolean
}
