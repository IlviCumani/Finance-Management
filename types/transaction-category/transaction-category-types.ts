export type TransactionCategory = {
  id: string
  userId: string
  name: string
  type: TransactionCategoryType
  createdAt: string
  updatedAt: string
  isSystem: boolean
}

export enum TransactionCategoryTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
  SUBSCRIPTION = "subscription",
}

export type TransactionCategoryType =
  (typeof TransactionCategoryTypeEnum)[keyof typeof TransactionCategoryTypeEnum]

export type TransactionCategory_Response = {
  id: string
  user_id: string
  name: string
  type: TransactionCategoryType
  created_at: string
  updated_at: string
  is_system: boolean
}
