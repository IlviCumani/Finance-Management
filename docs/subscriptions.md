# Subscriptions & Recurring Transactions

This document covers the recurring transaction system, including scheduling frequencies, the CRON processing pipeline, and the next-run-at computation logic.

---

## Overview

Recurring transactions represent scheduled financial obligations — subscriptions (Netflix, Spotify), regular bills (rent, utilities), or any periodic charge. Users define the subscription with a name, amount, frequency, source account, and start date. A CRON job endpoint processes due subscriptions by creating actual transaction records and updating account balances.

---

## Recurring Transaction Properties

| Field | Description |
|:---|:---|
| `name` | Subscription/payment name |
| `description` | Optional notes |
| `amount` | Charge amount per occurrence |
| `account` | Account to debit |
| `frequency` | Scheduling interval |
| `nextRunAt` | When the next charge is due |
| `lastRunAt` | When the last charge was processed |
| `isActive` | Whether the subscription is currently active |
| `autoExecute` | Reserved for future auto-execution feature |

---

## Supported Frequencies

| Frequency | Interval | date-fns Function |
|:---|:---|:---|
| `daily` | 1 day | `addDays(base, 1)` |
| `weekly` | 7 days | `addWeeks(base, 1)` |
| `monthly` | 1 calendar month | `addMonths(base, 1)` |
| `quarterly` | 3 calendar months | `addMonths(base, 3)` |
| `yearly` | 1 calendar year | `addYears(base, 1)` |

The `computeNextRunAt()` function advances the `next_run_at` timestamp based on the subscription's frequency after each processing cycle.

---

## User-Facing CRUD

Users manage recurring transactions through Server Actions:

| Action | Description |
|:---|:---|
| `getRecurringTransactions()` | Fetch all recurring transactions with joined account data |
| `createRecurringTransaction()` | Create a new subscription (validates payment date is in the future) |
| `updateRecurringTransaction()` | Update name, amount, frequency, account, or active status |
| `deleteRecurringTransaction()` | Remove a recurring transaction |

### Validation Rules

- **Payment date must be in the future**: The `next_run_at` value must be >= today (compared at `startOfDay` granularity)
- All standard form validations (required fields, numeric amount)
- Validation messages are internationalized

### UI Presentation

Recurring transactions are displayed as a **card grid** (not a table), with each card showing:
- Subscription name and description
- Amount and frequency badge
- Next payment date
- Active/inactive status
- Associated account
- Edit and delete actions

---

## CRON Processing Pipeline

### Endpoint

```
GET /api/cron/process-recurring-transactions
```

### Authorization

The endpoint requires a Bearer token matching the `CRON_SECRET` environment variable:

```
Authorization: Bearer <CRON_SECRET>
```

Unauthorized requests receive a `401` response.

### Processing Flow

```
1. Fetch all active recurring transactions where next_run_at <= now
2. If none are due → return { processed: 0, skipped: 0, errors: 0 }
3. Collect unique user IDs from due transactions
4. Fetch the "subscription" category for each user
5. Collect unique account IDs and fetch current balances
6. For each due recurring transaction:
   a. Look up the user's subscription category ID
   b. If no category found → skip (increment skipped counter)
   c. Insert a new transaction record:
      - name: "{subscription name} Subscription"
      - type: "subscription"
      - amount: recurring amount
      - date: now
   d. Update account balance: currentBalance - amount
   e. Compute the next run date using computeNextRunAt()
   f. Update the recurring transaction: next_run_at, last_run_at
   g. Increment processed counter
7. Return { processed, skipped, errors }
```

### Error Handling

Each recurring transaction is processed independently. If one fails:
- The error is logged to the console
- The `errors` counter is incremented
- Processing continues with the remaining transactions

The response always returns a summary:

```json
{
  "processed": 5,
  "skipped": 0,
  "errors": 1
}
```

### Admin Client

The CRON endpoint uses the **Admin client** (`SUPABASE_SERVICE_ROLE_KEY`) which bypasses Row Level Security. This is necessary because the endpoint operates across multiple users' data without an authenticated session.

---

## Next-Run-At Computation

The `computeNextRunAt()` function uses `date-fns` to advance dates:

```typescript
function computeNextRunAt(
  currentNextRunAt: string,
  frequency: RecurringTransactionFrequency
): string {
  const base = new Date(currentNextRunAt)

  switch (frequency) {
    case "daily":    return addDays(base, 1).toISOString()
    case "weekly":   return addWeeks(base, 1).toISOString()
    case "monthly":  return addMonths(base, 1).toISOString()
    case "quarterly": return addMonths(base, 3).toISOString()
    case "yearly":   return addYears(base, 1).toISOString()
  }
}
```

The computation is based on the **previous `next_run_at`** value, not the current time. This preserves the original cadence (e.g., if a monthly subscription is set for the 15th, it stays on the 15th).

---

## File Map

```
app/(app-layout)/recurring-transactions/
├── page.tsx                          # Server Component — fetches and renders
├── actions.ts                        # CRUD Server Actions
└── _components/
    ├── header/index.tsx              # Page header with create button
    ├── recurring-transactions-grid/  # Card grid layout
    ├── recurring-transaction-card/   # Individual subscription card
    └── recurring-transaction-form/   # Create/edit form

app/api/cron/process-recurring-transactions/
├── route.ts                          # CRON endpoint handler
└── compute-next-run-at.ts            # Date advancement utility

types/recurring-transactions/
└── recurring-transactions-type.ts    # Type definitions + frequency helpers

__tests__/
├── api/cron/
│   ├── process-recurring-transactions.test.ts
│   └── compute-next-run-at.test.ts
└── recurring-transactions/
    └── recurring-transactions-actions.test.ts
```

---

## Scheduling Considerations

- The CRON job should be scheduled to run at a regular interval (e.g., every hour or once daily)
- If the CRON job misses a run, due transactions will be picked up on the next execution (since it queries `next_run_at <= now`)
- Multiple overdue intervals for the same subscription will only create one transaction per CRON run (the next-run-at advances by one interval per execution)
- Setting up the CRON trigger is external to the application (e.g., Vercel Cron, GitHub Actions, or a third-party scheduler)
