import { vi } from "vitest"

type MockResult = { data?: unknown; error?: unknown }

export function createSupabaseMock() {
  const results = new Map<string, Array<MockResult>>()
  const callCounts = new Map<string, number>()

  function getNextResult(table: string): MockResult {
    const count = callCounts.get(table) ?? 0
    callCounts.set(table, count + 1)
    const tableResults = results.get(table) ?? []
    return tableResults[count] ?? { data: null, error: null }
  }

  const mock = {
    from: vi.fn((table: string) => {
      const result = getNextResult(table)

      const chain: Record<string, unknown> = {}
      chain.select = vi.fn().mockReturnValue(chain)
      chain.insert = vi.fn().mockResolvedValue(result)
      chain.update = vi.fn().mockReturnValue(chain)
      chain.delete = vi.fn().mockReturnValue(chain)
      chain.eq = vi.fn().mockReturnValue(chain)
      chain.in = vi.fn().mockReturnValue(chain)
      chain.order = vi.fn().mockReturnValue(chain)
      chain.single = vi.fn().mockResolvedValue(result)
      chain.returns = vi.fn().mockReturnValue(chain)

      Object.defineProperty(chain, "then", {
        value: (resolve: (val: unknown) => void) => resolve(result),
        enumerable: false,
      })

      return chain
    }),
    setResult: (table: string, ...tableResults: Array<MockResult>) => {
      results.set(table, tableResults)
    },
    reset: () => {
      results.clear()
      callCounts.clear()
    },
  }

  return mock
}

export function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-123",
    email: "test@example.com",
    ...overrides,
  }
}
