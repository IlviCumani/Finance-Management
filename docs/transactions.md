# Transactions

This document covers the transaction system, including types, balance mechanics, transfer logic, and data table presentation.

---

## Overview

Transactions are the core data entity of FinSanctuary. Every financial event — earning income, spending money, moving funds between accounts, or paying a subscription — is recorded as a transaction. Each transaction automatically updates the associated account balance(s).

---

## Transaction Types

| Type | Effect on Balance | Description |
|:---|:---|:---|
| `income` | **+** source account | Money received (salary, freelance, gifts) |
| `expense` | **−** source account | Money spent (bills, purchases, services) |
| `transfer` | **−** source, **+** destination | Move money between two accounts |
| `subscription` | **−** source account | Auto-created by CRON for recurring charges |

---

## Creating Transactions

Transaction creation is handled by the `createTransaction` Server Action, which delegates to two specialized helpers based on whether a destination account is specified:

### Non-Transfer Transactions (Income / Expense)

Flow: `createNonTransferTransaction()`

1. Extract form values (name, amount, accountId, categoryId, date, type)
2. Fetch the current balance of the source account
3. Compute the new balance:
   - **Income**: `currentBalance + amount`
   - **Expense**: `currentBalance - amount`
4. Update the account balance in the database
5. Insert the transaction record
6. Revalidate the `/transactions` path

### Transfer Transactions

Flow: `createTransferTransaction()`

1. Extract form values, including `toAccountId`
2. Fetch both account balances in a single query
3. Compute new balances:
   - **Source**: `currentBalance - amount`
   - **Destination**: `currentBalance + amount`
4. Update source account balance
5. Update destination account balance
6. Insert the transaction record with `transferred_to_account_id` set
7. Revalidate the `/transactions` path

---

## Deleting Transactions

Deletion reverses the balance effect:

### Non-Transfer Deletion

1. Fetch the source account's current balance
2. Reverse the balance change:
   - **Income**: `currentBalance - amount`
   - **Expense**: `currentBalance + amount`
3. Update the account balance
4. Delete the transaction record

### Transfer Deletion

1. Fetch both account balances
2. Reverse both balance changes:
   - **Source**: `currentBalance + amount`
   - **Destination**: `currentBalance - amount`
3. Update both account balances
4. Delete the transaction record

---

## Data Fetching

The `getTransactions` Server Action:

1. Queries all transactions for the current user
2. Extracts unique account IDs (source + destination)
3. Batch-fetches all referenced accounts via `getAccountsByIds()`
4. Batch-fetches all referenced categories via `getTransactionCategoriesByIds()`
5. Maps database response to camelCase application types
6. Joins account and category data onto each transaction

This approach minimizes database round-trips while keeping queries scoped to the authenticated user.

---

## Transaction Categories

Each transaction is linked to a category. Categories are typed:

| Category Type | Used By |
|:---|:---|
| `income` | Income transactions |
| `expense` | Expense transactions |
| `transfer` | Transfer transactions |
| `subscription` | Recurring transaction auto-processing |

Users manage categories in **Settings > Transaction Categories** with full CRUD operations. System-provided categories (`is_system = true`) serve as defaults and cannot be deleted.

---

## Data Table

The transactions page displays a data table built with **TanStack Table**:

- Column definitions in `get-columns.tsx`
- Sorting and filtering support
- Responsive layout
- Action buttons for edit and delete
- Type-aware formatting (amounts, dates, category badges)

---

## Transaction Form

The transaction form adapts based on the selected type:

- **Income / Expense**: Shows source account, category, amount, date, description
- **Transfer**: Additionally shows destination account picker

Forms use **React Hook Form** with **Zod** validation. All labels and validation messages are internationalized.

---

## File Map

```
app/(app-layout)/transactions/
├── page.tsx                        # Server Component — fetches and renders
├── actions.ts                      # Server Actions — getTransactions, createTransaction, deleteTransaction
├── util/
│   ├── create-helpers.ts           # createNonTransferTransaction, createTransferTransaction
│   └── delete-helpers.ts           # deleteNonTransferTransaction, deleteTransferTransaction
└── _components/
    ├── header/index.tsx            # Page header with create button
    ├── transaction-table/
    │   ├── index.tsx               # TanStack Table wrapper
    │   └── get-columns.tsx         # Column definitions
    └── transactions-form/
        └── index.tsx               # Create/edit form (React Hook Form + Zod)
```

---

## Balance Consistency

Account balances are updated **synchronously within the same Server Action** as the transaction mutation. This means:

- No database triggers are used for balance updates
- Balance consistency depends on the Server Action completing successfully
- If a balance update fails, the transaction insert is skipped (early return with error)
- `revalidatePath()` ensures the UI reflects the latest state after mutation

This design trades the atomicity of database triggers for simpler, more debuggable application-level logic.
