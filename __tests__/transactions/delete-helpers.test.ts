import { describe, it, expect, vi, beforeEach } from "vitest"
import type { Transaction } from "@/types/transaction/transaction-types"

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
    from: (table: string) => {
      const chain: Record<string, unknown> = {}
      chain.update = vi.fn().mockReturnValue(chain)
      chain.delete = vi.fn().mockReturnValue(chain)
      chain.eq = vi.fn().mockImplementation(() => {
        if (table === "transactions") {
          return {
            ...chain,
            then: (r: (v: unknown) => void) => r(deleteResult),
          }
        }
        return chain
      })

      Object.defineProperty(chain, "then", {
        value: (resolve: (val: unknown) => void) => resolve(updateResult),
        enumerable: false,
      })

      return chain
    },
  })),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import {
  deleteNonTransferTransaction,
  deleteTransferTransaction,
} from "@/app/(app-layout)/transactions/util/delete-helpers"

describe("deleteNonTransferTransaction", () => {
  beforeEach(() => {
    updateResult = { data: null, error: null }
    deleteResult = { data: null, error: null }
  })

  const expenseTransaction: Transaction = {
    id: "txn-1",
    userId: "user-123",
    account: {
      id: "acc-1",
      userId: "user-123",
      name: "Checking",
      currentBalance: 450,
      currency: "USD",
      isArchived: false,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    transactionCategory: null,
    name: "Groceries",
    amount: 50,
    transactionDate: "2026-06-01",
    transactionType: "expense",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  }

  const incomeTransaction: Transaction = {
    ...expenseTransaction,
    id: "txn-2",
    name: "Salary",
    amount: 3000,
    transactionType: "income",
    account: {
      ...expenseTransaction.account!,
      currentBalance: 3500,
    },
  }

  it("successfully deletes an expense and restores account balance", async () => {
    const result = await deleteNonTransferTransaction(expenseTransaction)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("successfully deletes an income and reduces account balance", async () => {
    const result = await deleteNonTransferTransaction(incomeTransaction)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when account balance update fails", async () => {
    updateResult = { data: null, error: { message: "Balance update failed" } }

    const result = await deleteNonTransferTransaction(expenseTransaction)
    expect(result.error).toBe("Balance update failed")
    expect(result.success).toBeUndefined()
  })

  it("returns error when transaction delete fails", async () => {
    deleteResult = { data: null, error: { message: "Delete forbidden" } }

    const result = await deleteNonTransferTransaction(expenseTransaction)
    expect(result.error).toBe("Delete forbidden")
  })
})

describe("deleteTransferTransaction", () => {
  beforeEach(() => {
    updateResult = { data: null, error: null }
    deleteResult = { data: null, error: null }
  })

  const transferTransaction: Transaction = {
    id: "txn-3",
    userId: "user-123",
    account: {
      id: "acc-1",
      userId: "user-123",
      name: "Checking",
      currentBalance: 400,
      currency: "USD",
      isArchived: false,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    transferredToAccount: {
      id: "acc-2",
      userId: "user-123",
      name: "Savings",
      currentBalance: 600,
      currency: "USD",
      isArchived: false,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    transactionCategory: null,
    name: "Transfer to Savings",
    amount: 100,
    transactionDate: "2026-06-01",
    transactionType: "transfer",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  }

  it("successfully deletes a transfer and reverses both account balances", async () => {
    const result = await deleteTransferTransaction(transferTransaction)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("returns error when updating transfer-to account fails", async () => {
    updateResult = {
      data: null,
      error: { message: "Update target account failed" },
    }

    const result = await deleteTransferTransaction(transferTransaction)
    expect(result.error).toBe("Update target account failed")
  })
})
