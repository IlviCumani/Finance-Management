# Budgets

This document covers the budget system, including total monthly budgets, category-level limits, spending computation, progress tracking, and the card grid UI.

---

## Overview

Budgets help users plan and monitor monthly spending. FinSanctuary uses a **two-tier model**:

1. **Total budget** — a monthly spending cap stored on the user's profile (`profiles.total_budget`)
2. **Budget categories** — named groups with individual limits, each linked to one or more expense transaction categories

Spending is computed **server-side** from expense transactions in the **current calendar month**. Progress bars and warning badges reflect utilization against each limit. No separate budget ledger is maintained — amounts are derived live from transaction data.

---

## Budget Category Properties

| Field | Description |
|:---|:---|
| `name` | Budget category display name |
| `description` | Short explanation of what the budget covers |
| `budgetLimit` | Maximum allowed spend for the current month |
| `transactionCategoryIds` | Expense categories whose transactions count toward this budget |
| `amount` | Computed spend this month (not stored in the database) |

The `amount` field is calculated in `getBudgetsCategories()` by summing expense transactions whose category ID appears in `transactionCategoryIds` and whose date falls within the current month.

---

## Total Budget

The total budget lives on the user's profile record:

| Field | Storage | Description |
|:---|:---|:---|
| `totalBudget` | `profiles.total_budget` | User-wide monthly spending cap |

The **Total Budget** card at the top of the page shows:

- The configured total limit
- Aggregate spend across all budget categories this month
- Remaining amount (or over-limit amount)
- A utilization progress bar with the same warning thresholds as category cards

Users set or edit the total budget through a slide-over form (`TotalBudgetForm`) that calls `updateTotalBudget()`.

---

## Spending Computation

Flow inside `getBudgetsCategories()`:

1. Fetch all `budget_categories` rows for the authenticated user
2. Determine the current month window with `startOfMonth()` and `endOfMonth()` from `date-fns`
3. Fetch all transactions in that date range via `getTransactionsByDateRange()`
4. For each budget category:
   a. Normalize `transaction_category_ids` (handles array or legacy single-string values)
   b. Filter transactions where:
      - `transactionType === "expense"`
      - The transaction's category ID is in the budget category's linked IDs
   c. Sum matching transaction amounts into `amount`
5. Return mapped `BudgetCategory` objects with computed spend

Only **expense** transactions contribute to budget utilization. Income, transfers, and subscription charges use other transaction types and are excluded unless categorized as expenses.

---

## Progress & Warning Thresholds

Both the total budget card and individual category cards share the same utilization logic:

| Utilization | Progress Bar | Badge |
|:---|:---|:---|
| `< 80%` | Default | — |
| `80% – 99%` | Amber | **Near Limit** |
| `100%` | Muted | — |
| `> 100%` | Red | **Over Limit** |

The remaining label shows `"left"` when under budget and `"over limit"` when spend exceeds the limit.

---

## User-Facing CRUD

Users manage budgets through Server Actions:

| Action | Description |
|:---|:---|
| `getBudgetsCategories()` | Fetch budget categories with computed monthly spend |
| `createBudgetsCategory(formData)` | Create a new budget category |
| `updateBudgetsCategory(formData)` | Update name, limit, description, or linked categories |
| `deleteBudgetsCategory(id)` | Remove a budget category |
| `updateTotalBudget(updatedTotalBudget)` | Set the profile-level total budget |

All mutations call `revalidatePath("/budgets")` so the page reflects the latest data after changes.

### Validation Rules

**Budget category form** (Zod + React Hook Form):

- `name` — required
- `description` — required
- `budgetLimit` — required, numeric, must be greater than 0
- `budgetLimit` — must be **less than** the user's total budget
- `transactionCategoryIds` — at least one expense category required

**Total budget form**:

- `totalBudget` — required, numeric, must be greater than 0

Validation messages are displayed inline via form field state. Success and error toasts use Sonner.

### Transaction Category Assignment

Each expense transaction category can be linked to **at most one** budget category. The `BudgetCategoriesProvider` context computes `transactionCategories` as expense categories not yet assigned to any budget. When editing an existing budget category, its currently assigned categories remain selectable alongside unassigned ones.

---

## UI Presentation

The budgets page uses a **card grid** layout:

- **Total Budget card** — summary of monthly cap vs. aggregate category spend, with edit/add action
- **Budget category cards** — name, description, spent/limit, progress bar, warning badges, remaining amount
- **Add Budget Category card** — opens the create form

Interaction patterns:

- Click a budget category card to open the edit form in a slide-over sheet
- Delete via a destructive button (visible on hover; always visible on small screens) with a confirmation dialog
- Forms use `FormSheetWrapper` for consistent slide-over presentation

The page includes a dedicated `loading.tsx` skeleton that mirrors the total budget card plus a responsive grid of category card placeholders.

---

## Context Provider

`BudgetCategoriesProvider` wraps the page and supplies shared state to client components:

| Context Value | Description |
|:---|:---|
| `totalBudget` | Profile-level monthly cap |
| `budgetCategories` | All budget categories with computed spend |
| `transactionCategories` | Unassigned expense categories (available for new/edited budgets) |
| `allTransactionCategories` | Full category list (used to preserve selections when editing) |

Client components access this via the `useBudgetContext()` hook.

---

## Data Dependencies

The budgets page fetches three data sources in parallel on the server:

| Source | Function | Purpose |
|:---|:---|:---|
| Budget categories | `getBudgetsCategories()` | Category limits + computed spend |
| Transaction categories | `getTransactionCategories()` | Category picker options |
| User profile | `getLoggedUserProfile()` | Total budget value |

See [transactions.md](transactions.md) for how expense transactions are recorded, and [database.md](database.md) for the underlying schema.

---

## File Map

```
app/(app-layout)/budgets/
├── page.tsx                              # Server Component — parallel data fetch + provider
├── loading.tsx                           # Route-level loading skeleton
├── actions.ts                            # Server Actions — CRUD + spend computation
├── context/
│   └── budget-context.tsx                # BudgetCategoriesProvider + useBudgetContext
└── _components/
    ├── header/index.tsx                  # Page header
    ├── budget-grid/
    │   ├── index.tsx                     # Grid layout (total card + category cards)
    │   ├── total-budget-card.tsx         # Total budget summary card
    │   ├── budget-card.tsx               # Individual category card with progress
    │   └── add-budget-category-card.tsx  # Create-new card trigger
    ├── budget-category-form/index.tsx    # Create/edit category form (RHF + Zod)
    └── total-budget-form/index.tsx       # Total budget form

types/budget/
└── budget-types.ts                       # BudgetCategory + BudgetCategory_Response types

components/page-status/loading/
└── grid-loading-layout.tsx               # Shared skeleton components used by loading.tsx
```

---

## Design Notes

- **Computed spend, not stored totals** — budget utilization always reflects the current month's transactions. Deleting or editing a transaction automatically affects budget progress on the next page load or revalidation.
- **Total budget as ceiling** — category limits must stay below the total budget, enforcing that allocated category budgets do not exceed the user's declared monthly cap.
- **Exclusive category mapping** — linking an expense category to one budget category removes it from the pool available to other budgets, preventing double-counting across categories.
