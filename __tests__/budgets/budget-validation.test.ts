import { describe, it, expect } from "vitest"
import * as z from "zod"
import {
  collectAssignedTransactionCategoryIds,
  createBudgetCategoryFormSchema,
  findConflictingTransactionCategoryIds,
  validateBudgetCategoryInput,
} from "@/lib/budget/budget-category-validation"

const validationMessages = {
  nameRequired: "Name is required",
  descriptionRequired: "Description is required",
  budgetLimitRequired: "Budget Limit is required",
  budgetLimitWholeNumber: "Budget Limit must be a number",
  transactionCategoriesRequired:
    "At least one transaction category is required",
  budgetLimitMin: "Budget Limit must be greater than 0",
  budgetLimitLessThanTotal: "Budget Limit must be less than total budget",
  transactionCategoriesAlreadyAssigned:
    "One or more transaction categories are already assigned to another budget",
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
  const schema = createBudgetCategoryFormSchema(2000, validationMessages)

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

describe("exclusive transaction category assignment validation", () => {
  it("rejects categories already assigned to another budget", () => {
    const assignedIds = collectAssignedTransactionCategoryIds([
      {
        id: "budget-food",
        transaction_category_ids: ["cat-food"],
      },
    ])

    const result = validateBudgetCategoryInput(
      {
        name: "Transport",
        description: "Transport budget",
        budgetLimit: "200",
        transactionCategoryIds: ["cat-food"],
      },
      2000,
      validationMessages,
      assignedIds
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe(
        validationMessages.transactionCategoriesAlreadyAssigned
      )
    }
  })

  it("allows categories assigned to the budget being edited", () => {
    const assignedIds = collectAssignedTransactionCategoryIds(
      [
        {
          id: "budget-food",
          transaction_category_ids: ["cat-food"],
        },
      ],
      "budget-food"
    )

    const result = validateBudgetCategoryInput(
      {
        name: "Food",
        description: "Updated food budget",
        budgetLimit: "500",
        transactionCategoryIds: ["cat-food"],
      },
      2000,
      validationMessages,
      assignedIds
    )

    expect(result.success).toBe(true)
  })

  it("finds conflicts against the assigned category set", () => {
    const assignedIds = new Set(["cat-food", "cat-dining"])

    expect(
      findConflictingTransactionCategoryIds(["cat-food"], assignedIds)
    ).toEqual(["cat-food"])
    expect(
      findConflictingTransactionCategoryIds(["cat-transport"], assignedIds)
    ).toEqual([])
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
