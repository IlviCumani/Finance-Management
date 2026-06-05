import { describe, it, expect, vi, beforeEach } from "vitest"

let selectResult: { data: unknown; error: unknown } = { data: [], error: null }
let insertResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}
// const updateResult: { data: unknown; error: unknown } = {
//   data: null,
//   error: null,
// }
// const deleteResult: { data: unknown; error: unknown } = {
//   data: null,
//   error: null,
// }

vi.mock("@/lib/supabase/actions", () => ({
  createActionClient: vi.fn().mockImplementation(async () => ({
    from: () => {
      const chain: Record<string, unknown> = {}
      chain.select = vi.fn().mockReturnValue(chain)
      chain.insert = vi.fn().mockResolvedValue(insertResult)
      chain.update = vi.fn().mockReturnValue(chain)
      chain.delete = vi.fn().mockReturnValue(chain)
      chain.eq = vi.fn().mockReturnValue(chain)
      chain.in = vi.fn().mockReturnValue(chain)
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

vi.mock("@/lib/supabase/queries/account", () => ({
  getAccountsByIds: vi.fn().mockResolvedValue({
    data: [
      {
        id: "acc-1",
        userId: "user-123",
        name: "Main",
        currentBalance: 1000,
        currency: "EUR",
        isArchived: false,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ],
    error: null,
  }),
}))

import {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} from "@/app/(app-layout)/recurring-transactions/actions"

function buildFormData(entries: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value)
  }
  return formData
}

function futureDate(daysAhead: number = 7): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString()
}

function pastDate(daysAgo: number = 7): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

describe("getRecurringTransactions", () => {
  beforeEach(() => {
    selectResult = { data: [], error: null }
  })

  it("returns mapped recurring transactions successfully", async () => {
    selectResult = {
      data: [
        {
          id: "rec-1",
          user_id: "user-123",
          account_id: "acc-1",
          name: "Netflix",
          description: "Monthly streaming",
          amount: 15.99,
          frequency: "monthly",
          next_run_at: "2026-07-01T00:00:00Z",
          last_run_at: "2026-06-01T00:00:00Z",
          is_active: true,
          auto_execute: false,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-06-01T00:00:00Z",
        },
      ],
      error: null,
    }

    const result = await getRecurringTransactions()

    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(1)
    expect(result.data![0].name).toBe("Netflix")
    expect(result.data![0].frequency).toBe("monthly")
    expect(result.data![0].isActive).toBe(true)
    expect(result.data![0].account).not.toBeNull()
    expect(result.data![0].account!.name).toBe("Main")
  })

  it("returns empty array when user has no recurring transactions", async () => {
    selectResult = { data: [], error: null }

    const result = await getRecurringTransactions()
    expect(result.data).toEqual([])
  })

  it("returns error when fetch fails", async () => {
    selectResult = { data: null, error: { message: "Fetch failed" } }

    const result = await getRecurringTransactions()
    expect(result.error).toBe("Fetch failed")
    expect(result.data).toBeUndefined()
  })
})

describe("createRecurringTransaction", () => {
  beforeEach(() => {
    insertResult = { data: null, error: null }
  })

  it("successfully creates a recurring transaction with future date", async () => {
    const formData = buildFormData({
      name: "Spotify",
      description: "Music streaming",
      amount: "9.99",
      frequency: "monthly",
      accountId: "acc-1",
      paymentDate: futureDate(30),
    })

    const result = await createRecurringTransaction(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("rejects creation when payment date is in the past", async () => {
    const formData = buildFormData({
      name: "Old Sub",
      description: "",
      amount: "5",
      frequency: "monthly",
      accountId: "acc-1",
      paymentDate: pastDate(5),
    })

    const result = await createRecurringTransaction(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it("returns error when Supabase insert fails", async () => {
    insertResult = { data: null, error: { message: "Constraint violation" } }

    const formData = buildFormData({
      name: "Test Sub",
      description: "",
      amount: "10",
      frequency: "weekly",
      accountId: "acc-1",
      paymentDate: futureDate(7),
    })

    const result = await createRecurringTransaction(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("Constraint violation")
  })
})

describe("updateRecurringTransaction", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
  })

  it("successfully updates a recurring transaction", async () => {
    const formData = buildFormData({
      id: "rec-1",
      name: "Updated Netflix",
      description: "Premium plan",
      amount: "22.99",
      frequency: "monthly",
      accountId: "acc-1",
      paymentDate: futureDate(30),
      isActive: "true",
    })

    const result = await updateRecurringTransaction(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("rejects update when payment date is in the past", async () => {
    const formData = buildFormData({
      id: "rec-1",
      name: "Netflix",
      description: "",
      amount: "15.99",
      frequency: "monthly",
      accountId: "acc-1",
      paymentDate: pastDate(2),
      isActive: "true",
    })

    const result = await updateRecurringTransaction(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it("allows deactivating a recurring transaction", async () => {
    const formData = buildFormData({
      id: "rec-1",
      name: "Netflix",
      description: "",
      amount: "15.99",
      frequency: "monthly",
      accountId: "acc-1",
      paymentDate: futureDate(30),
      isActive: "false",
    })

    const result = await updateRecurringTransaction(formData)
    expect(result.success).toBe(true)
  })
})

describe("deleteRecurringTransaction", () => {
  beforeEach(() => {
    selectResult = { data: null, error: null }
  })

  it("successfully deletes a recurring transaction", async () => {
    const result = await deleteRecurringTransaction("rec-1")
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when delete fails", async () => {
    selectResult = { data: null, error: { message: "Record not found" } }

    const result = await deleteRecurringTransaction("non-existent")
    expect(result.error).toBe("Record not found")
    expect(result.success).toBe(false)
  })
})
