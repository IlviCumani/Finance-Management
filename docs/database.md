# Database

This document describes the Supabase PostgreSQL database schema, table relationships, and security model.

---

## Overview

FinSanctuary uses **Supabase** (managed PostgreSQL) as its sole data store. All tables are scoped per user via `user_id` foreign keys and protected by **Row Level Security (RLS)** policies.

---

## Tables

### `profiles`

User profile information, linked 1:1 to Supabase Auth users.

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` (PK) | References `auth.users.id` |
| `full_name` | `text` | User's display name |
| `avatar_url` | `text` | Profile image URL |
| `total_budget` | `numeric` | Monthly spending cap for budget tracking (default `0`) |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `accounts`

Financial accounts (bank accounts, cash wallets, savings).

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` (PK) | Auto-generated |
| `user_id` | `uuid` (FK) | Owner, references `auth.users.id` |
| `name` | `text` | Account display name |
| `current_balance` | `numeric` | Running balance, updated by transactions |
| `currency` | `text` | ISO currency code (e.g., `EUR`, `USD`) |
| `is_archived` | `boolean` | Soft-delete flag (default `false`) |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**Key behaviors:**
- Balance is modified atomically when transactions are created or deleted
- Archived accounts are excluded from active queries but preserved for history
- Multiple currency support per user

---

### `transaction_categories`

Categories for organizing transactions.

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` (PK) | Auto-generated |
| `user_id` | `uuid` (FK) | Owner |
| `name` | `text` | Category display name |
| `type` | `text` | One of: `income`, `expense`, `transfer`, `subscription` |
| `is_system` | `boolean` | `true` for system-provided defaults |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**Key behaviors:**
- System categories (`is_system = true`) are auto-created per user and cannot be deleted
- The `subscription` type is used by recurring transaction processing
- Users can create custom categories of any type

---

### `transactions`

Individual financial transactions.

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` (PK) | Auto-generated |
| `user_id` | `uuid` (FK) | Owner |
| `account_id` | `uuid` (FK) | Source account |
| `transaction_category_id` | `uuid` (FK) | Category reference |
| `transferred_to_account_id` | `uuid` (FK, nullable) | Destination account (transfers only) |
| `name` | `text` | Transaction description |
| `description` | `text` (nullable) | Optional notes |
| `amount` | `numeric` | Transaction amount (always positive) |
| `transaction_date` | `timestamptz` | When the transaction occurred |
| `transaction_type` | `text` | One of: `income`, `expense`, `transfer`, `subscription` |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**Key behaviors:**
- **Income**: Adds `amount` to the source account balance
- **Expense**: Subtracts `amount` from the source account balance
- **Transfer**: Subtracts from `account_id`, adds to `transferred_to_account_id`
- **Subscription**: Created by CRON job, subtracts from source account
- Balance updates happen in the Server Action, not via database triggers

---

### `recurring_transactions`

Subscription and recurring payment definitions.

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` (PK) | Auto-generated |
| `user_id` | `uuid` (FK) | Owner |
| `account_id` | `uuid` (FK) | Account to charge |
| `name` | `text` | Subscription name |
| `description` | `text` (nullable) | Optional notes |
| `amount` | `numeric` | Recurring charge amount |
| `frequency` | `text` | One of: `daily`, `weekly`, `monthly`, `quarterly`, `yearly` |
| `next_run_at` | `timestamptz` | Next scheduled execution |
| `last_run_at` | `timestamptz` (nullable) | Last execution time |
| `is_active` | `boolean` | Whether the subscription is currently active |
| `auto_execute` | `boolean` | Reserved for future auto-execution feature |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**Key behaviors:**
- The CRON job queries all active recurring transactions where `next_run_at <= now()`
- After processing, `next_run_at` is advanced by the frequency interval
- `last_run_at` records the most recent execution

---

### `budget_categories`

User-defined budget groups with monthly spending limits.

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` (PK) | Auto-generated |
| `user_id` | `uuid` (FK) | Owner |
| `name` | `text` | Budget category display name |
| `description` | `text` | Short description |
| `budget_limit` | `numeric` | Maximum allowed spend for the current month |
| `transaction_category_ids` | `uuid[]` | Expense categories whose transactions count toward this budget |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**Key behaviors:**
- Monthly spend is **not stored** — it is computed at read time from expense transactions in the current calendar month
- Each expense transaction category should be linked to at most one budget category
- Category limits are validated in the UI to stay below the user's `profiles.total_budget`

See [budgets.md](budgets.md) for spend computation and progress tracking details.

---

## Entity Relationships

```
auth.users
    │
    ├── 1:1 ── profiles
    │
    ├── 1:N ── accounts
    │              │
    │              ├── N:1 ── transactions.account_id
    │              ├── N:1 ── transactions.transferred_to_account_id
    │              └── N:1 ── recurring_transactions.account_id
    │
    ├── 1:N ── transaction_categories
    │              │
    │              ├── N:1 ── transactions.transaction_category_id
    │              └── N:M ── budget_categories.transaction_category_ids
    │
    ├── 1:N ── budget_categories
    │
    ├── 1:N ── transactions
    │
    └── 1:N ── recurring_transactions
```

---

## Row Level Security (RLS)

All tables have RLS enabled. The general policy pattern:

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own records"
  ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
  ON table_name
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
  ON table_name
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records"
  ON table_name
  FOR DELETE
  USING (auth.uid() = user_id);
```

The **Admin client** (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS for system operations like CRON processing.

---

## Data Mapping Pattern

Database columns use `snake_case` (PostgreSQL convention), while the TypeScript application layer uses `camelCase`. Each entity has two types:

```typescript
// Application layer (camelCase)
type Account = {
  id: string
  userId: string
  name: string
  currentBalance: number
  currency: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

// Database response (snake_case)
type Account_Response = {
  id: string
  user_id: string
  name: string
  current_balance: number
  currency: string
  is_archived: boolean
  created_at: string
  updated_at: string
}
```

Query functions in `lib/supabase/queries/` handle the mapping between the two.

---

## Naming Conventions

| Context | Convention | Example |
|:---|:---|:---|
| Database columns | `snake_case` | `current_balance` |
| TypeScript properties | `camelCase` | `currentBalance` |
| Table names | `snake_case` plural | `recurring_transactions` |
| Type names | `PascalCase` | `RecurringTransaction` |
| Response types | `PascalCase_Response` | `RecurringTransaction_Response` |
