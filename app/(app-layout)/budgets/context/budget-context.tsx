"use client"

import { createContext, useContext } from "react"
import type { BudgetCategory } from "@/types/budget/budget-types"
import type { TransactionCategory } from "@/types/transaction-category/transaction-category-types"
import { TransactionCategoryTypeEnum } from "@/types/transaction-category/transaction-category-types"

interface BudgetContextType {
  totalBudget: number
  budgetCategories: Array<BudgetCategory>
  transactionCategories: Array<TransactionCategory>
  allTransactionCategories: Array<TransactionCategory>
}

export const BudgetCategoriesContext = createContext<BudgetContextType | null>(
  null
)

type BudgetCategoriesProviderProps = {
  children: React.ReactNode
  totalBudget: number
  budgetCategories: Array<BudgetCategory>
  transactionCategories: Array<TransactionCategory>
}

export function BudgetCategoriesProvider({
  children,
  totalBudget,
  budgetCategories,
  transactionCategories,
}: BudgetCategoriesProviderProps) {
  const notUsedTransactionCategories = transactionCategories.filter(
    (category) =>
      category.type === TransactionCategoryTypeEnum.EXPENSE &&
      !budgetCategories.some((budgetCategory) =>
        budgetCategory.transactionCategoryIds.includes(category.id)
      )
  )

  return (
    <BudgetCategoriesContext.Provider
      value={{
        totalBudget,
        budgetCategories,
        transactionCategories: notUsedTransactionCategories,
        allTransactionCategories: transactionCategories,
      }}
    >
      {children}
    </BudgetCategoriesContext.Provider>
  )
}

export function useBudgetContext() {
  const context = useContext(BudgetCategoriesContext)
  if (!context) {
    throw new Error(
      "useBudgetContext must be used within a BudgetCategoriesProvider"
    )
  }
  return context
}
