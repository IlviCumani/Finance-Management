import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "@/app/api/cron/process-recurring-transactions/route"

const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockLte = vi.fn()
const mockIn = vi.fn()
const mockSingle = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()

function createChainMock(finalResult: { data: unknown; error: unknown }) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  chain.select = vi.fn().mockReturnValue(chain)
  chain.eq = vi.fn().mockReturnValue(chain)
  chain.lte = vi.fn().mockReturnValue(chain)
  chain.in = vi.fn().mockReturnValue(chain)
  chain.single = vi.fn().mockResolvedValue(finalResult)
  chain.insert = vi.fn().mockResolvedValue(finalResult)
  chain.update = vi.fn().mockReturnValue(chain)
  chain.then = vi.fn((resolve) => resolve(finalResult))
  return chain
}

let fromCallCount = 0
let fromHandlers: Array<{ data: unknown; error: unknown }> = []

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      const idx = fromCallCount++
      const result = fromHandlers[idx] || { data: null, error: null }

      const chain: Record<string, unknown> = {}
      chain.select = vi.fn().mockReturnValue(chain)
      chain.eq = vi.fn().mockReturnValue(chain)
      chain.lte = vi.fn().mockReturnValue(chain)
      chain.in = vi.fn().mockReturnValue(chain)
      chain.single = vi.fn().mockResolvedValue(result)
      chain.insert = vi.fn().mockResolvedValue(result)
      chain.update = vi.fn().mockReturnValue(chain)

      Object.defineProperty(chain, "then", {
        value: (resolve: (val: unknown) => void) => resolve(result),
        enumerable: false,
      })

      return chain
    },
  }),
}))

describe("GET /api/cron/process-recurring-transactions", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", "test-cron-secret")
    fromCallCount = 0
    fromHandlers = []
  })

  it("returns 401 when authorization header is missing", async () => {
    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions"
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe("Unauthorized")
  })

  it("returns 401 when authorization header is invalid", async () => {
    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer wrong-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe("Unauthorized")
  })

  it("returns processed: 0 when no recurring transactions are due", async () => {
    fromHandlers = [{ data: [], error: null }]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ processed: 0, skipped: 0, errors: 0 })
  })

  it("returns 500 when fetching recurring transactions fails", async () => {
    fromHandlers = [
      { data: null, error: { message: "Database connection failed" } },
    ]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe("Database connection failed")
  })

  it("processes a due recurring transaction successfully", async () => {
    const dueTransaction = {
      id: "rec-1",
      user_id: "user-1",
      account_id: "acc-1",
      name: "Netflix",
      description: "Streaming service",
      amount: 15.99,
      frequency: "monthly",
      next_run_at: "2026-06-01T00:00:00.000Z",
      last_run_at: null,
      is_active: true,
    }

    fromHandlers = [
      { data: [dueTransaction], error: null },
      { data: { id: "cat-1", user_id: "user-1" }, error: null },
      { data: [{ id: "acc-1", current_balance: 500 }], error: null },
      { data: null, error: null },
      { data: null, error: null },
      { data: null, error: null },
    ]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.processed).toBe(1)
    expect(json.errors).toBe(0)
    expect(json.skipped).toBe(0)
  })

  it("skips recurring transaction when no subscription category exists for user", async () => {
    const dueTransaction = {
      id: "rec-1",
      user_id: "user-1",
      account_id: "acc-1",
      name: "Spotify",
      amount: 9.99,
      frequency: "monthly",
      next_run_at: "2026-06-01T00:00:00.000Z",
      is_active: true,
    }

    fromHandlers = [
      { data: [dueTransaction], error: null },
      { data: { id: "cat-1", user_id: "user-other" }, error: null },
      { data: [{ id: "acc-1", current_balance: 100 }], error: null },
    ]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.skipped).toBe(1)
    expect(json.processed).toBe(0)
  })

  it("returns 500 when fetching categories fails", async () => {
    const dueTransaction = {
      id: "rec-1",
      user_id: "user-1",
      account_id: "acc-1",
      name: "Test",
      amount: 10,
      frequency: "monthly",
      next_run_at: "2026-06-01T00:00:00.000Z",
      is_active: true,
    }

    fromHandlers = [
      { data: [dueTransaction], error: null },
      { data: null, error: { message: "Categories table error" } },
    ]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe("Categories table error")
  })

  it("returns 500 when fetching accounts fails", async () => {
    const dueTransaction = {
      id: "rec-1",
      user_id: "user-1",
      account_id: "acc-1",
      name: "Test",
      amount: 10,
      frequency: "monthly",
      next_run_at: "2026-06-01T00:00:00.000Z",
      is_active: true,
    }

    fromHandlers = [
      { data: [dueTransaction], error: null },
      { data: { id: "cat-1", user_id: "user-1" }, error: null },
      { data: null, error: { message: "Accounts table error" } },
    ]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe("Accounts table error")
  })

  it("counts errors when transaction insert fails", async () => {
    const dueTransaction = {
      id: "rec-1",
      user_id: "user-1",
      account_id: "acc-1",
      name: "Netflix",
      amount: 15.99,
      frequency: "monthly",
      next_run_at: "2026-06-01T00:00:00.000Z",
      is_active: true,
    }

    fromHandlers = [
      { data: [dueTransaction], error: null },
      { data: { id: "cat-1", user_id: "user-1" }, error: null },
      { data: [{ id: "acc-1", current_balance: 500 }], error: null },
      { data: null, error: { message: "Insert failed" } },
    ]

    const request = new Request(
      "http://localhost/api/cron/process-recurring-transactions",
      {
        headers: { authorization: "Bearer test-cron-secret" },
      }
    )
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.errors).toBe(1)
    expect(json.processed).toBe(0)
  })
})
