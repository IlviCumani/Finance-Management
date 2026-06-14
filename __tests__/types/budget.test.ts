import { describe, it, expect } from "vitest"
import type {
  BudgetCategory,
  BudgetCategory_Response,
} from "@/types/budget/budget-types"

function mapBudgetCategoryResponse(
  response: BudgetCategory_Response,
  amount: number = 0
): BudgetCategory {
  return {
    id: response.id,
    userId: response.user_id,
    name: response.name,
    description: response.description,
    amount,
    budgetLimit: response.budget_limit,
    transactionCategoryIds: response.transaction_category_ids,
  }
}

describe("BudgetCategory type shape", () => {
  it("maps a database response into the domain model", () => {
    const response: BudgetCategory_Response = {
      id: "budget-1",
      user_id: "user-123",
      name: "Food",
      description: "Monthly food spending",
      budget_limit: 500,
      transaction_category_ids: ["cat-food", "cat-dining"],
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-15T00:00:00Z",
    }

    const category = mapBudgetCategoryResponse(response, 320)

    expect(category).toEqual({
      id: "budget-1",
      userId: "user-123",
      name: "Food",
      description: "Monthly food spending",
      amount: 320,
      budgetLimit: 500,
      transactionCategoryIds: ["cat-food", "cat-dining"],
    })
  })

  it("treats amount as a computed field not stored in the response", () => {
    const response: BudgetCategory_Response = {
      id: "budget-2",
      user_id: "user-123",
      name: "Transport",
      description: "Commute costs",
      budget_limit: 200,
      transaction_category_ids: ["cat-transport"],
      created_at: "2026-02-01T00:00:00Z",
      updated_at: "2026-02-01T00:00:00Z",
    }

    const category = mapBudgetCategoryResponse(response)

    expect(category.amount).toBe(0)
    expect(response).not.toHaveProperty("amount")
  })

  it("supports multiple linked transaction categories", () => {
    const response: BudgetCategory_Response = {
      id: "budget-3",
      user_id: "user-123",
      name: "Lifestyle",
      description: "Combined lifestyle spending",
      budget_limit: 800,
      transaction_category_ids: ["cat-a", "cat-b", "cat-c"],
      created_at: "2026-03-01T00:00:00Z",
      updated_at: "2026-03-01T00:00:00Z",
    }

    const category = mapBudgetCategoryResponse(response)
    expect(category.transactionCategoryIds).toHaveLength(3)
  })
})
