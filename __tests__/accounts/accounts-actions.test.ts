import { describe, it, expect, vi, beforeEach } from "vitest"

let selectResult: { data: unknown; error: unknown } = { data: [], error: null }
let insertResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}
let updateResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}
let deleteResult: { data: unknown; error: unknown } = {
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
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/app/(app-layout)/accounts/actions"

function buildFormData(entries: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value)
  }
  return formData
}

describe("getAccounts", () => {
  beforeEach(() => {
    selectResult = { data: [], error: null }
  })

  it("returns mapped account data successfully", async () => {
    selectResult = {
      data: [
        {
          id: "acc-1",
          user_id: "user-123",
          name: "Main Account",
          current_balance: 1500,
          currency: "EUR",
          is_archived: false,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
        },
      ],
      error: null,
    }

    const result = await getAccounts()

    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(1)
    expect(result.data![0]).toEqual({
      id: "acc-1",
      userId: "user-123",
      name: "Main Account",
      currentBalance: 1500,
      currency: "EUR",
      isArchived: false,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    })
  })

  it("returns empty array when user has no accounts", async () => {
    selectResult = { data: [], error: null }

    const result = await getAccounts()
    expect(result.data).toEqual([])
    expect(result.error).toBeUndefined()
  })

  it("returns error when fetch fails", async () => {
    selectResult = { data: null, error: { message: "Network error" } }

    const result = await getAccounts()
    expect(result.error).toBe("Network error")
    expect(result.data).toBeUndefined()
  })
})

describe("createAccount", () => {
  beforeEach(() => {
    insertResult = { data: null, error: null }
  })

  it("successfully creates a new account", async () => {
    const formData = buildFormData({
      name: "Savings",
      currentBalance: "5000",
      currency: "USD",
    })

    const result = await createAccount(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when insert fails", async () => {
    insertResult = { data: null, error: { message: "Duplicate name" } }

    const formData = buildFormData({
      name: "Savings",
      currentBalance: "5000",
      currency: "USD",
    })

    const result = await createAccount(formData)
    expect(result.error).toBe("Duplicate name")
    expect(result.success).toBeUndefined()
  })
})

describe("updateAccount", () => {
  beforeEach(() => {
    updateResult = { data: null, error: null }
    selectResult = { data: null, error: null }
  })

  it("successfully updates an account", async () => {
    const formData = buildFormData({
      id: "acc-1",
      name: "Updated Name",
      currency: "EUR",
      isArchived: "false",
    })

    const result = await updateAccount(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("handles archiving an account", async () => {
    const formData = buildFormData({
      id: "acc-1",
      name: "Old Account",
      currency: "USD",
      isArchived: "true",
    })

    const result = await updateAccount(formData)
    expect(result.success).toBe(true)
  })
})

describe("deleteAccount", () => {
  beforeEach(() => {
    deleteResult = { data: null, error: null }
    selectResult = { data: null, error: null }
  })

  it("successfully deletes an account", async () => {
    const result = await deleteAccount("acc-1")
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when delete fails due to foreign key constraint", async () => {
    selectResult = {
      data: null,
      error: { message: "Cannot delete: account has transactions" },
    }

    const result = await deleteAccount("acc-1")
    expect(result.error).toBe("Cannot delete: account has transactions")
  })
})
