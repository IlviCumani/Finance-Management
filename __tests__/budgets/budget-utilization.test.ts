import { describe, it, expect } from "vitest"
import type { BudgetCategory } from "@/types/budget/budget-types"
import type { TransactionCategory } from "@/types/transaction-category/transaction-category-types"
import { TransactionCategoryTypeEnum } from "@/types/transaction-category/transaction-category-types"

function getUtilizationState(amount: number, limit: number) {
  const utilization = limit > 0 ? (amount / limit) * 100 : 0

  return {
    utilization,
    remaining: limit - amount,
    isWarning: utilization >= 80 && utilization < 100,
    isFilled: utilization === 100,
    isOverLimit: utilization > 100,
  }
}

function getTotalBudgetState(
  totalBudget: number,
  budgetCategories: Array<BudgetCategory>
) {
  const totalSpent = budgetCategories.reduce(
    (acc, category) => acc + category.amount,
    0
  )
  const totalRemaining = totalBudget - totalSpent
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return {
    totalSpent,
    totalRemaining,
    utilization,
    isWarning: utilization >= 80 && utilization < 100,
    isFilled: utilization === 100,
    isOverLimit: utilization > 100,
  }
}

function getUnassignedExpenseCategories(
  transactionCategories: Array<TransactionCategory>,
  budgetCategories: Array<BudgetCategory>
): Array<TransactionCategory> {
  return transactionCategories.filter(
    (category) =>
      category.type === TransactionCategoryTypeEnum.EXPENSE &&
      !budgetCategories.some((budgetCategory) =>
        budgetCategory.transactionCategoryIds.includes(category.id)
      )
  )
}

function buildCategory(
  overrides: Partial<BudgetCategory> = {}
): BudgetCategory {
  return {
    id: "budget-1",
    userId: "user-123",
    name: "Food",
    description: "Food budget",
    amount: 0,
    budgetLimit: 500,
    transactionCategoryIds: ["cat-food"],
    ...overrides,
  }
}

function buildTransactionCategory(
  overrides: Partial<TransactionCategory> = {}
): TransactionCategory {
  return {
    id: "cat-food",
    userId: "user-123",
    name: "Food",
    type: TransactionCategoryTypeEnum.EXPENSE,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    isSystem: false,
    ...overrides,
  }
}

describe("category utilization thresholds", () => {
  it("returns 0% utilization when limit is zero", () => {
    const state = getUtilizationState(100, 0)
    expect(state.utilization).toBe(0)
    expect(state.isWarning).toBe(false)
    expect(state.isOverLimit).toBe(false)
  })

  it("shows no warning below 80% utilization", () => {
    const state = getUtilizationState(399, 500)
    expect(state.utilization).toBeCloseTo(79.8)
    expect(state.isWarning).toBe(false)
    expect(state.isFilled).toBe(false)
    expect(state.isOverLimit).toBe(false)
    expect(state.remaining).toBe(101)
  })

  it("shows near-limit warning between 80% and 99%", () => {
    const atEighty = getUtilizationState(400, 500)
    expect(atEighty.isWarning).toBe(true)
    expect(atEighty.isFilled).toBe(false)
    expect(atEighty.isOverLimit).toBe(false)

    const atNinetyNine = getUtilizationState(495, 500)
    expect(atNinetyNine.isWarning).toBe(true)
    expect(atNinetyNine.isFilled).toBe(false)
  })

  it("shows filled state at exactly 100% without warning", () => {
    const state = getUtilizationState(500, 500)
    expect(state.utilization).toBe(100)
    expect(state.isWarning).toBe(false)
    expect(state.isFilled).toBe(true)
    expect(state.isOverLimit).toBe(false)
    expect(state.remaining).toBe(0)
  })

  it("shows over-limit state above 100%", () => {
    const state = getUtilizationState(550, 500)
    expect(state.isOverLimit).toBe(true)
    expect(state.isWarning).toBe(false)
    expect(state.isFilled).toBe(false)
    expect(state.remaining).toBe(-50)
  })
})

describe("total budget aggregation", () => {
  it("sums spend across all budget categories", () => {
    const state = getTotalBudgetState(2000, [
      buildCategory({ amount: 300 }),
      buildCategory({
        id: "budget-2",
        name: "Transport",
        amount: 150,
        budgetLimit: 400,
        transactionCategoryIds: ["cat-transport"],
      }),
    ])

    expect(state.totalSpent).toBe(450)
    expect(state.totalRemaining).toBe(1550)
    expect(state.utilization).toBeCloseTo(22.5)
    expect(state.isWarning).toBe(false)
  })

  it("detects total over-limit when aggregate spend exceeds the cap", () => {
    const state = getTotalBudgetState(1000, [
      buildCategory({ amount: 600 }),
      buildCategory({
        id: "budget-2",
        name: "Transport",
        amount: 500,
        budgetLimit: 400,
        transactionCategoryIds: ["cat-transport"],
      }),
    ])

    expect(state.totalSpent).toBe(1100)
    expect(state.isOverLimit).toBe(true)
    expect(state.totalRemaining).toBe(-100)
  })

  it("returns 0% utilization when total budget is unset", () => {
    const state = getTotalBudgetState(0, [buildCategory({ amount: 200 })])
    expect(state.utilization).toBe(0)
    expect(state.isOverLimit).toBe(false)
  })
})

describe("exclusive transaction category assignment", () => {
  it("returns only unassigned expense categories", () => {
    const transactionCategories = [
      buildTransactionCategory({ id: "cat-food", name: "Food" }),
      buildTransactionCategory({
        id: "cat-transport",
        name: "Transport",
      }),
      buildTransactionCategory({
        id: "cat-salary",
        name: "Salary",
        type: TransactionCategoryTypeEnum.INCOME,
      }),
    ]
    const budgetCategories = [
      buildCategory({ transactionCategoryIds: ["cat-food"] }),
    ]

    const available = getUnassignedExpenseCategories(
      transactionCategories,
      budgetCategories
    )

    expect(available).toHaveLength(1)
    expect(available[0].id).toBe("cat-transport")
  })

  it("excludes income and transfer categories from the available pool", () => {
    const transactionCategories = [
      buildTransactionCategory({
        id: "cat-transfer",
        name: "Transfer",
        type: TransactionCategoryTypeEnum.TRANSFER,
      }),
      buildTransactionCategory({
        id: "cat-subscription",
        name: "Subscriptions",
        type: TransactionCategoryTypeEnum.SUBSCRIPTION,
      }),
    ]

    const available = getUnassignedExpenseCategories(transactionCategories, [])
    expect(available).toHaveLength(0)
  })

  it("keeps categories assigned to other budgets unavailable", () => {
    const transactionCategories = [
      buildTransactionCategory({ id: "cat-food" }),
      buildTransactionCategory({ id: "cat-dining", name: "Dining" }),
      buildTransactionCategory({ id: "cat-groceries", name: "Groceries" }),
    ]
    const budgetCategories = [
      buildCategory({ transactionCategoryIds: ["cat-food", "cat-dining"] }),
      buildCategory({
        id: "budget-2",
        transactionCategoryIds: ["cat-groceries"],
      }),
    ]

    const available = getUnassignedExpenseCategories(
      transactionCategories,
      budgetCategories
    )
    expect(available).toHaveLength(0)
  })
})
