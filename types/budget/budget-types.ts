export type Budget = {
  id: string
  totalBudget: number
}

export type BudgetCategory = {
  id: string
  name: string
  description: string
  amount: number
  limit: number
  transactionCategoriesAffectedBy: Array<string>
  userId: string
}
