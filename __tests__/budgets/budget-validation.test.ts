import { describe, it, expect } from "vitest"
import * as z from "zod"

function createBudgetCategoryFormSchema(totalBudget: number) {
  return z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().min(1, "Description is required"),
      budgetLimit: z
        .string()
        .min(1, "Budget Limit is required")
        .regex(/^\d+$/, "Budget Limit must be a number"),
      transactionCategoryIds: z
        .array(z.string())
        .min(1, "At least one transaction category is required"),
    })
    .refine((data) => Number(data.budgetLimit) > 0, {
      path: ["budgetLimit"],
      message: "Budget Limit must be greater than 0",
    })
    .refine((data) => Number(data.budgetLimit) < totalBudget, {
      path: ["budgetLimit"],
      message: "Budget Limit must be less than total budget",
    })
}

const totalBudgetFormSchema = z
  .object({
    totalBudget: z
      .string()
      .min(1, "Total budget is required")
      .regex(/^\d+$/, "Total budget must be a number"),
  })
  .refine((data) => Number(data.totalBudget) > 0, {
    path: ["totalBudget"],
    message: "Total budget must be greater than 0",
  })

describe("budget category form validation", () => {
  const schema = createBudgetCategoryFormSchema(2000)

  it("accepts valid input", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Monthly food budget",
      budgetLimit: "500",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = schema.safeParse({
      name: "",
      description: "Description",
      budgetLimit: "500",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required")
    }
  })

  it("rejects empty description", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "",
      budgetLimit: "500",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Description is required")
    }
  })

  it("rejects non-numeric budget limit", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Food budget",
      budgetLimit: "abc",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Budget Limit must be a number"
      )
    }
  })

  it("rejects zero budget limit", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Food budget",
      budgetLimit: "0",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Budget Limit must be greater than 0"
      )
    }
  })

  it("rejects budget limit equal to total budget", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Food budget",
      budgetLimit: "2000",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Budget Limit must be less than total budget"
      )
    }
  })

  it("rejects budget limit greater than total budget", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Food budget",
      budgetLimit: "2500",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Budget Limit must be less than total budget"
      )
    }
  })

  it("rejects empty transaction category selection", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Food budget",
      budgetLimit: "500",
      transactionCategoryIds: [],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "At least one transaction category is required"
      )
    }
  })

  it("accepts budget limit one below total budget", () => {
    const result = schema.safeParse({
      name: "Food",
      description: "Food budget",
      budgetLimit: "1999",
      transactionCategoryIds: ["cat-food"],
    })

    expect(result.success).toBe(true)
  })
})

describe("total budget form validation", () => {
  it("accepts valid total budget", () => {
    const result = totalBudgetFormSchema.safeParse({
      totalBudget: "3000",
    })

    expect(result.success).toBe(true)
  })

  it("rejects empty total budget", () => {
    const result = totalBudgetFormSchema.safeParse({
      totalBudget: "",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Total budget is required")
    }
  })

  it("rejects non-numeric total budget", () => {
    const result = totalBudgetFormSchema.safeParse({
      totalBudget: "3k",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Total budget must be a number"
      )
    }
  })

  it("rejects zero total budget", () => {
    const result = totalBudgetFormSchema.safeParse({
      totalBudget: "0",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Total budget must be greater than 0"
      )
    }
  })

  it("rejects negative-looking numeric strings that fail the digit regex", () => {
    const result = totalBudgetFormSchema.safeParse({
      totalBudget: "-100",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Total budget must be a number"
      )
    }
  })
})
