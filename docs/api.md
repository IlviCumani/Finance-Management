# API Reference

This document covers all Server Actions, API routes, and the data access layer.

---

## Overview

FinSanctuary does not have a traditional REST API. Instead, it uses:

- **Next.js Server Actions** (`"use server"`) for all mutations and data fetching
- **One API route** for CRON-triggered recurring transaction processing
- **Reusable query functions** in `lib/supabase/queries/` for cross-module reads

---

## Server Actions

### Auth Actions

**File**: `app/auth/actions.ts`

| Action | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `login(formData)` | `FormData` with `email`, `password` | `{ error?: string }` | Sign in with email/password |
| `register(formData)` | `FormData` with `email`, `password`, `fullName` | `{ error?: string }` | Create a new account |
| `logout()` | — | Redirects to `/auth/login` | Sign out and clear session |

---

### Account Actions

**File**: `app/(app-layout)/accounts/actions.ts`

| Action | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `getAccounts()` | — | `{ data?: Array<Account>, error?: string }` | Fetch all non-archived accounts |
| `createAccount(formData)` | `FormData` with `name`, `currentBalance`, `currency` | `{ success?: boolean, error?: string }` | Create a new account |
| `updateAccount(formData)` | `FormData` with `id`, `name`, `currency`, `isArchived` | `{ success?: boolean, error?: string }` | Update account details or archive |
| `deleteAccount(id)` | `string` | `{ success?: boolean, error?: string }` | Permanently delete an account |

---

### Transaction Actions

**File**: `app/(app-layout)/transactions/actions.ts`

| Action | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `getTransactions()` | — | `{ data?: Array<Transaction>, error?: string }` | Fetch all transactions with joined account and category data |
| `createTransaction(formData)` | `FormData` (see below) | `{ success?: boolean, error?: string }` | Create a transaction (delegates to transfer or non-transfer helper) |
| `deleteTransaction(transaction)` | `Transaction` object | `{ success?: boolean, error?: string }` | Delete a transaction and reverse balance changes |

**`createTransaction` FormData fields:**

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `name` | `string` | Yes | Transaction name |
| `amount` | `string` | Yes | Transaction amount |
| `accountId` | `string` | Yes | Source account ID |
| `transactionCategoryId` | `string` | Yes | Category ID |
| `transactionDate` | `string` | Yes | ISO date string |
| `transactionType` | `string` | Yes | `income`, `expense`, `transfer`, or `subscription` |
| `description` | `string` | No | Optional notes |
| `toAccountId` | `string` | No | Destination account (triggers transfer flow) |

---

### Recurring Transaction Actions

**File**: `app/(app-layout)/recurring-transactions/actions.ts`

| Action | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `getRecurringTransactions()` | — | `{ data?: Array<RecurringTransaction>, error?: string }` | Fetch all recurring transactions with joined account data |
| `createRecurringTransaction(formData)` | `FormData` (see below) | `{ success?: boolean, error?: string }` | Create a new recurring transaction |
| `updateRecurringTransaction(formData)` | `FormData` (see below) | `{ success?: boolean, error?: string }` | Update a recurring transaction |
| `deleteRecurringTransaction(id)` | `string` | `{ success?: boolean, error?: string }` | Delete a recurring transaction |

**`createRecurringTransaction` FormData fields:**

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `name` | `string` | Yes | Subscription name |
| `amount` | `string` | Yes | Charge amount |
| `frequency` | `string` | Yes | `daily`, `weekly`, `monthly`, `quarterly`, `yearly` |
| `accountId` | `string` | Yes | Account to charge |
| `paymentDate` | `string` | Yes | Next payment date (must be in the future) |
| `description` | `string` | No | Optional notes |

**`updateRecurringTransaction` additional fields:**

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | `string` | Yes | Recurring transaction ID |
| `isActive` | `string` | Yes | `"true"` or `"false"` |

---

### Transaction Category Actions

**File**: `app/(app-layout)/settings/transaction-categories/actions.ts`

| Action | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `getTransactionCategories()` | — | `{ data?: Array<TransactionCategory>, error?: string }` | Fetch all categories for the user |
| `createTransactionCategory(formData)` | `FormData` with `name`, `type` | `{ success?: boolean, error?: string }` | Create a custom category |
| `updateTransactionCategory(formData)` | `FormData` with `id`, `name`, `type` | `{ success?: boolean, error?: string }` | Update a category |
| `deleteTransactionCategory(id)` | `string` | `{ success?: boolean, error?: string }` | Delete a category |

---

### Locale Action

**File**: `app/(app-layout)/_components/app-header/locale.ts`

| Action | Description |
|:---|:---|
| `setLocale(locale)` | Set the user's preferred locale via cookie |

---

## API Routes

### Process Recurring Transactions (CRON)

```
GET /api/cron/process-recurring-transactions
```

**Authorization**: `Authorization: Bearer <CRON_SECRET>`

**Response (200)**:
```json
{
  "processed": 5,
  "skipped": 0,
  "errors": 1
}
```

**Response (401)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (500)**:
```json
{
  "error": "Database error message"
}
```

See [subscriptions.md](subscriptions.md) for the full processing pipeline.

---

## Query Layer

Reusable query functions in `lib/supabase/queries/` are used by multiple modules:

### Account Queries

**File**: `lib/supabase/queries/account.ts`

| Function | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `getAccounts()` | — | `{ data?: Array<Account>, error?: string }` | Fetch all non-archived accounts |
| `getAccountById(id)` | `string` | `{ data?: Account, error?: string }` | Fetch a single account |
| `getAccountsByIds(ids)` | `Array<string>` | `{ data?: Array<Account>, error?: string }` | Batch fetch accounts by IDs |

### Transaction Category Queries

**File**: `lib/supabase/queries/transaction.ts`

| Function | Parameters | Returns | Description |
|:---|:---|:---|:---|
| `getTransactionCategories()` | — | `{ data?: Array<TransactionCategory>, error?: string }` | Fetch all categories |
| `getTransactionCategoryById(id)` | `string` | `{ data?: TransactionCategory, error?: string }` | Fetch a single category |
| `getTransactionCategoriesByIds(ids)` | `Array<string>` | `{ data?: Array<TransactionCategory>, error?: string }` | Batch fetch categories |

### User Profile Query

**File**: `lib/supabase/queries/user-profile.ts`

| Function | Returns | Description |
|:---|:---|:---|
| `getLoggedUserProfile()` | `{ loggedUserDetails, user }` | Fetch authenticated user's profile data |

---

## Supabase Client Factory

| Factory | File | Use Case |
|:---|:---|:---|
| `createClient()` | `lib/supabase/server.ts` | Server Components (read-only cookies) |
| `createActionClient()` | `lib/supabase/actions.ts` | Server Actions (read/write cookies) |
| `createAdminClient()` | `lib/supabase/admin.ts` | CRON endpoints (service role key, bypasses RLS) |
| `createBrowserClient()` | `lib/supabase/client.ts` | Client Components (browser cookie store) |

---

## Response Pattern

All Server Actions follow a consistent response pattern:

```typescript
// Success (read)
{ data: Array<T> }

// Success (mutation)
{ success: true }

// Error
{ error: "Human-readable error message" }
```

Error messages are internationalized where possible using `getTranslations()` from `next-intl/server`.

---

## Data Flow Summary

```
Client Component (form submit)
        │
        ▼
Server Action ("use server")
        │
        ├── requireUser()  →  Auth check
        │
        ├── createActionClient()  →  Supabase with user session
        │
        ├── Database mutation (insert/update/delete)
        │
        ├── revalidatePath()  →  Refresh server-rendered data
        │
        └── Return { success } or { error }
```
