import { describe, it, expect, vi, beforeEach } from "vitest"

let insertResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}
let updateResult: { data: unknown; error: unknown } = {
  data: null,
  error: null,
}
let selectSingleResult: { data: unknown; error: unknown } = {
  data: { current_balance: 500 },
  error: null,
}
let selectInResult: { data: unknown; error: unknown } = {
  data: [
    { id: "acc-1", current_balance: 500 },
    { id: "acc-2", current_balance: 300 },
  ],
  error: null,
}

vi.mock("@/lib/supabase/actions", () => ({
  createActionClient: vi.fn().mockImplementation(async () => ({
    from: (table: string) => {
      const chain: Record<string, unknown> = {}
      chain.select = vi.fn().mockReturnValue(chain)
      chain.eq = vi.fn().mockReturnValue(chain)
      chain.in = vi.fn().mockReturnValue(chain)
      chain.single = vi.fn().mockResolvedValue(selectSingleResult)
      chain.insert = vi.fn().mockResolvedValue(insertResult)
      chain.update = vi.fn().mockReturnValue(chain)
      chain.returns = vi.fn().mockReturnValue(chain)

      Object.defineProperty(chain, "then", {
        value: (resolve: (val: unknown) => void) => {
          if (table === "accounts") {
            resolve(selectInResult)
          } else {
            resolve(insertResult)
          }
        },
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

import {
  createNonTransferTransaction,
  createTransferTransaction,
} from "@/app/(app-layout)/transactions/util/create-helpers"

function buildFormData(entries: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value)
  }
  return formData
}

describe("createNonTransferTransaction", () => {
  beforeEach(() => {
    insertResult = { data: null, error: null }
    updateResult = { data: null, error: null }
    selectSingleResult = { data: { current_balance: 500 }, error: null }
  })

  it("successfully creates an expense transaction and reduces balance", async () => {
    const formData = buildFormData({
      name: "Groceries",
      amount: "50",
      accountId: "acc-1",
      description: "Weekly groceries",
      transactionCategoryId: "cat-1",
      transactionDate: "2026-06-01",
      transactionType: "expense",
    })

    const result = await createNonTransferTransaction(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("successfully creates an income transaction", async () => {
    const formData = buildFormData({
      name: "Salary",
      amount: "3000",
      accountId: "acc-1",
      description: "Monthly salary",
      transactionCategoryId: "cat-2",
      transactionDate: "2026-06-01",
      transactionType: "income",
    })

    const result = await createNonTransferTransaction(formData)
    expect(result.success).toBe(true)
  })

  it("returns error when account is not found", async () => {
    selectSingleResult = {
      data: null,
      error: { message: "Account not found" },
    }

    const formData = buildFormData({
      name: "Test",
      amount: "10",
      accountId: "non-existent",
      description: "",
      transactionCategoryId: "cat-1",
      transactionDate: "2026-06-01",
      transactionType: "expense",
    })

    const result = await createNonTransferTransaction(formData)
    expect(result.error).toBe("Account not found")
    expect(result.success).toBeUndefined()
  })

  it("returns error when transaction insert fails", async () => {
    insertResult = {
      data: null,
      error: { message: "Insert constraint violated" },
    }

    const formData = buildFormData({
      name: "Test",
      amount: "10",
      accountId: "acc-1",
      description: "",
      transactionCategoryId: "cat-1",
      transactionDate: "2026-06-01",
      transactionType: "expense",
    })

    const result = await createNonTransferTransaction(formData)
    expect(result.error).toBe("Insert constraint violated")
  })
})

describe("createTransferTransaction", () => {
  beforeEach(() => {
    insertResult = { data: null, error: null }
    updateResult = { data: null, error: null }
    selectInResult = {
      data: [
        { id: "acc-1", current_balance: 500 },
        { id: "acc-2", current_balance: 300 },
      ],
      error: null,
    }
  })

  it("successfully creates a transfer transaction between accounts", async () => {
    const formData = buildFormData({
      name: "Transfer to Savings",
      amount: "100",
      accountId: "acc-1",
      toAccountId: "acc-2",
      description: "Monthly savings",
      transactionCategoryId: "cat-transfer",
      transactionDate: "2026-06-01",
      transactionType: "transfer",
    })

    const result = await createTransferTransaction(formData)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when fetching accounts fails", async () => {
    selectInResult = {
      data: null,
      error: { message: "Failed to fetch accounts" },
    }

    const formData = buildFormData({
      name: "Transfer",
      amount: "50",
      accountId: "acc-1",
      toAccountId: "acc-2",
      description: "",
      transactionCategoryId: "cat-transfer",
      transactionDate: "2026-06-01",
      transactionType: "transfer",
    })

    const result = await createTransferTransaction(formData)
    expect(result.error).toBe("Failed to fetch accounts")
  })
})
