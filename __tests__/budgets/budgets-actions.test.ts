import { describe, it, expect, vi, beforeEach } from "vitest"
import type { Transaction } from "@/types/transaction/transaction-types"
import { TransactionCategoryTypeEnum } from "@/types/transaction-category/transaction-category-types"

let selectResult: { data: unknown; error: unknown } = { data: [], error: null }
let selectResults: Array<{ data: unknown; error: unknown }> | null = null
let insertResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}

const mockGetTransactionsByDateRange = vi.fn()

vi.mock("@/lib/supabase/actions", () => ({
  createActionClient: vi.fn().mockImplementation(async () => {
    let selectCallIndex = 0

    return {
      from: () => {
        const chain: Record<string, unknown> = {}
        chain.select = vi.fn().mockReturnValue(chain)
        chain.insert = vi.fn().mockResolvedValue(insertResult)
        chain.update = vi.fn().mockReturnValue(chain)
        chain.delete = vi.fn().mockReturnValue(chain)
        chain.eq = vi.fn().mockReturnValue(chain)
        chain.order = vi.fn().mockReturnValue(chain)
        chain.single = vi.fn().mockReturnValue(chain)

        Object.defineProperty(chain, "then", {
          value: (resolve: (val: unknown) => void) => {
            const results = selectResults ?? [selectResult]
            const result =
              results[selectCallIndex] ?? results[results.length - 1]
            selectCallIndex += 1
            resolve(result)
          },
          enumerable: false,
        })

        return chain
      },
    }
  }),
}))

vi.mock("@/lib/require-user", () => ({
  requireUser: vi
    .fn()
    .mockResolvedValue({ id: "user-123", email: "test@example.com" }),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("next-intl/server", () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
}))

vi.mock("@/lib/supabase/queries/transaction", () => ({
  getTransactionsByDateRange: (...args: Array<unknown>) =>
    mockGetTransactionsByDateRange(...args),
}))

import {
  getBudgetsCategories,
  createBudgetsCategory,
  updateBudgetsCategory,
  deleteBudgetsCategory,
  updateTotalBudget,
} from "@/app/(app-layout)/budgets/actions"
import { revalidatePath } from "next/cache"

function setValidationSelectResults(
  overrides: {
    totalBudget?: number
    budgetCategories?: Array<{
      id: string
      transaction_category_ids: Array<string> | string | null
    }>
  } = {}
) {
  selectResults = [
    {
      data: { total_budget: overrides.totalBudget ?? 3000 },
      error: null,
    },
    {
      data: overrides.budgetCategories ?? [],
      error: null,
    },
  ]
}

function buildFormData(
  entries: Record<string, string | Array<string>>
): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, item)
      }
    } else {
      formData.set(key, value)
    }
  }
  return formData
}

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    userId: "user-123",
    account: null,
    transactionCategory: {
      id: "cat-food",
      userId: "user-123",
      name: "Food",
      type: TransactionCategoryTypeEnum.EXPENSE,
      createdAt: "2026-06-01T00:00:00Z",
      updatedAt: "2026-06-01T00:00:00Z",
      isSystem: false,
    },
    name: "Groceries",
    amount: 50,
    transactionDate: "2026-06-10T00:00:00Z",
    transactionType: TransactionCategoryTypeEnum.EXPENSE,
    createdAt: "2026-06-10T00:00:00Z",
    updatedAt: "2026-06-10T00:00:00Z",
    ...overrides,
  }
}

describe("getBudgetsCategories", () => {
  beforeEach(() => {
    selectResult = { data: [], error: null }
    selectResults = null
    mockGetTransactionsByDateRange.mockClear()
    mockGetTransactionsByDateRange.mockResolvedValue({ data: [], error: null })
  })

  it("returns mapped budget categories with zero spend when no transactions exist", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Monthly food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }

    const result = await getBudgetsCategories()

    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(1)
    expect(result.data![0]).toEqual({
      id: "budget-1",
      userId: "user-123",
      name: "Food",
      description: "Monthly food budget",
      amount: 0,
      budgetLimit: 500,
      transactionCategoryIds: ["cat-food"],
    })
  })

  it("returns empty array when user has no budget categories", async () => {
    selectResult = { data: [], error: null }

    const result = await getBudgetsCategories()
    expect(result.data).toEqual([])
    expect(result.error).toBeUndefined()
  })

  it("returns error when budget category fetch fails", async () => {
    selectResult = { data: null, error: { message: "Database unavailable" } }

    const result = await getBudgetsCategories()
    expect(result.error).toBe("Database unavailable")
    expect(result.data).toBeUndefined()
  })

  it("returns error when transaction fetch fails", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: null,
      error: "Transaction query failed",
    })

    const result = await getBudgetsCategories()
    expect(result.error).toBe("Transaction query failed")
    expect(result.data).toBeUndefined()
  })

  it("sums expense transactions linked to the budget category", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food", "cat-dining"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [
        buildTransaction({ id: "tx-1", amount: 50 }),
        buildTransaction({
          id: "tx-2",
          amount: 75,
          transactionCategory: {
            id: "cat-dining",
            userId: "user-123",
            name: "Dining",
            type: TransactionCategoryTypeEnum.EXPENSE,
            createdAt: "2026-06-01T00:00:00Z",
            updatedAt: "2026-06-01T00:00:00Z",
            isSystem: false,
          },
        }),
      ],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data![0].amount).toBe(125)
  })

  it("excludes income, transfer, and subscription transactions from spend", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [
        buildTransaction({ id: "tx-expense", amount: 40 }),
        buildTransaction({
          id: "tx-income",
          amount: 1000,
          transactionType: TransactionCategoryTypeEnum.INCOME,
        }),
        buildTransaction({
          id: "tx-transfer",
          amount: 200,
          transactionType: TransactionCategoryTypeEnum.TRANSFER,
        }),
        buildTransaction({
          id: "tx-subscription",
          amount: 15,
          transactionType: TransactionCategoryTypeEnum.SUBSCRIPTION,
        }),
      ],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data![0].amount).toBe(40)
  })

  it("ignores transactions from unlinked categories", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [
        buildTransaction({ id: "tx-linked", amount: 30 }),
        buildTransaction({
          id: "tx-unlinked",
          amount: 999,
          transactionCategory: {
            id: "cat-transport",
            userId: "user-123",
            name: "Transport",
            type: TransactionCategoryTypeEnum.EXPENSE,
            createdAt: "2026-06-01T00:00:00Z",
            updatedAt: "2026-06-01T00:00:00Z",
            isSystem: false,
          },
        }),
      ],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data![0].amount).toBe(30)
  })

  it("ignores transactions with a missing category", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [
        buildTransaction({ id: "tx-valid", amount: 25 }),
        buildTransaction({
          id: "tx-uncategorized",
          amount: 500,
          transactionCategory: null,
        }),
      ],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data![0].amount).toBe(25)
  })

  it("normalizes legacy single-string transaction_category_ids", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: "cat-food",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [buildTransaction({ amount: 60 })],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data![0].transactionCategoryIds).toEqual(["cat-food"])
    expect(result.data![0].amount).toBe(60)
  })

  it("normalizes null or empty transaction_category_ids to an empty array", async () => {
    selectResult = {
      data: [
        {
          id: "budget-1",
          user_id: "user-123",
          name: "Orphan",
          description: "No linked categories",
          budget_limit: 100,
          transaction_category_ids: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [buildTransaction({ amount: 80 })],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data![0].transactionCategoryIds).toEqual([])
    expect(result.data![0].amount).toBe(0)
  })

  it("computes spend independently for multiple budget categories", async () => {
    selectResult = {
      data: [
        {
          id: "budget-food",
          user_id: "user-123",
          name: "Food",
          description: "Food budget",
          budget_limit: 500,
          transaction_category_ids: ["cat-food"],
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
        {
          id: "budget-transport",
          user_id: "user-123",
          name: "Transport",
          description: "Transport budget",
          budget_limit: 200,
          transaction_category_ids: ["cat-transport"],
          created_at: "2026-01-02T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
        },
      ],
      error: null,
    }
    mockGetTransactionsByDateRange.mockResolvedValue({
      data: [
        buildTransaction({ id: "tx-food", amount: 100 }),
        buildTransaction({
          id: "tx-transport",
          amount: 45,
          transactionCategory: {
            id: "cat-transport",
            userId: "user-123",
            name: "Transport",
            type: TransactionCategoryTypeEnum.EXPENSE,
            createdAt: "2026-06-01T00:00:00Z",
            updatedAt: "2026-06-01T00:00:00Z",
            isSystem: false,
          },
        }),
      ],
      error: null,
    })

    const result = await getBudgetsCategories()
    expect(result.data).toHaveLength(2)
    expect(result.data!.find((c) => c.id === "budget-food")?.amount).toBe(100)
    expect(result.data!.find((c) => c.id === "budget-transport")?.amount).toBe(
      45
    )
  })

  it("fetches transactions for the current month date range", async () => {
    await getBudgetsCategories()

    expect(mockGetTransactionsByDateRange).toHaveBeenCalledTimes(1)
    const [startDate, endDate] = mockGetTransactionsByDateRange.mock.calls[0]
    expect(new Date(startDate).getDate()).toBe(1)
    expect(new Date(endDate).getMonth()).toBe(new Date(startDate).getMonth())
  })
})

describe("createBudgetsCategory", () => {
  beforeEach(() => {
    insertResult = { data: null, error: null }
    setValidationSelectResults()
    vi.mocked(revalidatePath).mockClear()
  })

  it("successfully creates a budget category with multiple linked categories", async () => {
    const formData = buildFormData({
      name: "Entertainment",
      description: "Movies and events",
      budgetLimit: "150",
      transactionCategoryIds: ["cat-movies", "cat-events"],
    })

    const result = await createBudgetsCategory(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(revalidatePath).toHaveBeenCalledWith("/budgets")
  })

  it("returns error when insert fails", async () => {
    insertResult = {
      data: null,
      error: { message: "Duplicate budget category name" },
    }

    const formData = buildFormData({
      name: "Food",
      description: "Food budget",
      budgetLimit: "500",
      transactionCategoryIds: ["cat-food"],
    })

    const result = await createBudgetsCategory(formData)
    expect(result.error).toBe("Duplicate budget category name")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects invalid budget limits before insert", async () => {
    const formData = buildFormData({
      name: "Food",
      description: "Food budget",
      budgetLimit: "abc",
      transactionCategoryIds: ["cat-food"],
    })

    const result = await createBudgetsCategory(formData)
    expect(result.error).toBe("translated:budgetLimitWholeNumber")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects budget limits above the total budget before insert", async () => {
    setValidationSelectResults({ totalBudget: 500 })

    const formData = buildFormData({
      name: "Food",
      description: "Food budget",
      budgetLimit: "500",
      transactionCategoryIds: ["cat-food"],
    })

    const result = await createBudgetsCategory(formData)
    expect(result.error).toBe("translated:budgetLimitLessThanTotal")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects transaction categories already assigned to another budget", async () => {
    setValidationSelectResults({
      budgetCategories: [
        {
          id: "budget-food",
          transaction_category_ids: ["cat-food"],
        },
      ],
    })

    const formData = buildFormData({
      name: "Transport",
      description: "Transport budget",
      budgetLimit: "200",
      transactionCategoryIds: ["cat-food"],
    })

    const result = await createBudgetsCategory(formData)
    expect(result.error).toBe("translated:transactionCategoriesAlreadyAssigned")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe("updateBudgetsCategory", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
    setValidationSelectResults()
    vi.mocked(revalidatePath).mockClear()
  })

  it("successfully updates a budget category", async () => {
    const formData = buildFormData({
      id: "budget-1",
      name: "Updated Food",
      description: "Updated description",
      budgetLimit: "600",
      transactionCategoryIds: ["cat-food", "cat-groceries"],
    })

    const result = await updateBudgetsCategory(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(revalidatePath).toHaveBeenCalledWith("/budgets")
  })

  it("returns error when update fails", async () => {
    selectResults = [
      { data: { total_budget: 3000 }, error: null },
      { data: [], error: null },
      { data: null, error: { message: "Row not found" } },
    ]

    const formData = buildFormData({
      id: "budget-missing",
      name: "Ghost",
      description: "Does not exist",
      budgetLimit: "100",
      transactionCategoryIds: ["cat-food"],
    })

    const result = await updateBudgetsCategory(formData)
    expect(result.error).toBe("Row not found")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("allows keeping categories assigned to the budget being edited", async () => {
    setValidationSelectResults({
      budgetCategories: [
        {
          id: "budget-1",
          transaction_category_ids: ["cat-food"],
        },
      ],
    })
    selectResults = [...(selectResults ?? []), { data: null, error: null }]

    const formData = buildFormData({
      id: "budget-1",
      name: "Updated Food",
      description: "Updated description",
      budgetLimit: "600",
      transactionCategoryIds: ["cat-food"],
    })

    const result = await updateBudgetsCategory(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(revalidatePath).toHaveBeenCalledWith("/budgets")
  })
})

describe("deleteBudgetsCategory", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
    selectResults = null
    vi.mocked(revalidatePath).mockClear()
  })

  it("successfully deletes a budget category", async () => {
    const result = await deleteBudgetsCategory("budget-1")
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(revalidatePath).toHaveBeenCalledWith("/budgets")
  })

  it("returns error when delete fails", async () => {
    selectResult = { data: null, error: { message: "Delete forbidden" } }

    const result = await deleteBudgetsCategory("budget-1")
    expect(result.error).toBe("Delete forbidden")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe("updateTotalBudget", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
    vi.mocked(revalidatePath).mockClear()
  })

  it("successfully updates the profile total budget", async () => {
    const result = await updateTotalBudget(3000)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(revalidatePath).toHaveBeenCalledWith("/budgets")
  })

  it("returns error when profile update fails", async () => {
    selectResult = { data: null, error: { message: "Profile update failed" } }

    const result = await updateTotalBudget(3000)
    expect(result.error).toBe("Profile update failed")
    expect(result.success).toBeUndefined()
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
