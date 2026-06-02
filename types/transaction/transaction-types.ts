import { TransactionCategoryType } from "../transaction-category/transaction-category-types"
import { Account } from "../account/account-types"
import { TransactionCategory } from "../transaction-category/transaction-category-types"

export type Transaction = {
  id: string
  userId: string
  account: Account | null
  transactionCategory: TransactionCategory | null
  name: string
  description?: string
  amount: number
  transactionDate: string
  transactionType: TransactionCategoryType
  createdAt: string
  updatedAt: string
  transferredToAccount?: Account | null
}

export type Transaction_Response = {
  id: string
  user_id: string
  account_id: string
  transaction_category_id: string
  name: string
  description?: string
  amount: number
  transaction_date: string
  transaction_type: TransactionCategoryType
  created_at: string
  updated_at: string
  transferred_to_account_id: string | null
}
