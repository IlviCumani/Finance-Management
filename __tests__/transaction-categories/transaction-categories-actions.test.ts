import { describe, it, expect, vi, beforeEach } from "vitest"

let selectResult: { data: unknown; error: unknown } = { data: [], error: null }
let insertResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}

vi.mock("@/lib/supabase/actions", () => ({
  createActionClient: vi.fn().mockImplementation(async () => ({
    from: () => {
      const chain: Record<string, unknown> = {}
      chain.select = vi.fn().mockReturnValue(chain)
      chain.insert = vi.fn().mockResolvedValue(insertResult)
      chain.update = vi.fn().mockReturnValue(chain)
      chain.delete = vi.fn().mockReturnValue(chain)
      chain.eq = vi.fn().mockReturnValue(chain)
      chain.order = vi.fn().mockReturnValue(chain)

      Object.defineProperty(chain, "then", {
        value: (resolve: (val: unknown) => void) => resolve(selectResult),
        enumerable: false,
      })

      return chain
    },
  })),
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

import {
  getTransactionCategories,
  createTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
} from "@/app/(app-layout)/settings/transaction-categories/actions"

function buildFormData(entries: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value)
  }
  return formData
}

describe("getTransactionCategories", () => {
  beforeEach(() => {
    selectResult = { data: [], error: null }
  })

  it("returns mapped categories successfully", async () => {
    selectResult = {
      data: [
        {
          id: "cat-1",
          user_id: "user-123",
          name: "Food",
          type: "expense",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
          is_system: false,
        },
        {
          id: "cat-2",
          user_id: "user-123",
          name: "Salary",
          type: "income",
          created_at: "2026-01-02T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
          is_system: true,
        },
      ],
      error: null,
    }

    const result = await getTransactionCategories()

    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(2)
    expect(result.data![0]).toEqual({
      id: "cat-1",
      userId: "user-123",
      name: "Food",
      type: "expense",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      isSystem: false,
    })
    expect(result.data![1].isSystem).toBe(true)
  })

  it("returns empty array when no categories exist", async () => {
    selectResult = { data: [], error: null }

    const result = await getTransactionCategories()
    expect(result.data).toEqual([])
  })

  it("returns error when fetch fails", async () => {
    selectResult = { data: null, error: { message: "Connection refused" } }

    const result = await getTransactionCategories()
    expect(result.error).toBe("Connection refused")
  })
})

describe("createTransactionCategory", () => {
  beforeEach(() => {
    insertResult = { data: null, error: null }
  })

  it("successfully creates an expense category", async () => {
    const formData = buildFormData({
      name: "Transportation",
      type: "expense",
    })

    const result = await createTransactionCategory(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("successfully creates an income category", async () => {
    const formData = buildFormData({
      name: "Freelancing",
      type: "income",
    })

    const result = await createTransactionCategory(formData)
    expect(result.success).toBe(true)
  })

  it("returns error when insert fails", async () => {
    insertResult = { data: null, error: { message: "Duplicate category name" } }

    const formData = buildFormData({
      name: "Food",
      type: "expense",
    })

    const result = await createTransactionCategory(formData)
    expect(result.error).toBe("Duplicate category name")
  })
})

describe("updateTransactionCategory", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
  })

  it("successfully updates a category", async () => {
    const formData = buildFormData({
      id: "cat-1",
      name: "Dining Out",
      type: "expense",
    })

    const result = await updateTransactionCategory(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when update fails", async () => {
    selectResult = { data: null, error: { message: "Update forbidden" } }

    const formData = buildFormData({
      id: "cat-1",
      name: "Updated",
      type: "expense",
    })

    const result = await updateTransactionCategory(formData)
    expect(result.error).toBe("Update forbidden")
  })
})

describe("deleteTransactionCategory", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
  })

  it("successfully deletes a category", async () => {
    const result = await deleteTransactionCategory("cat-1")
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when category has linked transactions", async () => {
    selectResult = {
      data: null,
      error: {
        message: "Foreign key constraint: transactions reference this category",
      },
    }

    const result = await deleteTransactionCategory("cat-1")
    expect(result.error).toBe(
      "Foreign key constraint: transactions reference this category"
    )
  })
})
