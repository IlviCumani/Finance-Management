# Architecture

This document describes the system architecture, design patterns, and conventions used throughout FinSanctuary.

---

## High-Level Overview

FinSanctuary is a **Next.js 16 App Router** application using **React 19 Server Components** as the default rendering strategy. Data lives in a **Supabase PostgreSQL** database, accessed through the Supabase JS client. There is no separate backend API server — the application uses **Next.js Server Actions** for mutations and **server-side data fetching** for reads.

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│  React 19 Client Components + Server Components     │
│  (Hydrated by Next.js App Router)                   │
└──────────────┬──────────────────────────────────────┘
               │
               │  HTTP / RSC Payload
               │
┌──────────────▼──────────────────────────────────────┐
│              Next.js Edge Middleware                 │
│  ┌───────────────────────────────────────────────┐  │
│  │  Session refresh (Supabase SSR)               │  │
│  │  Route protection (guest vs. authenticated)   │  │
│  └───────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│              Next.js Server                         │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Server Actions   │  │ Server Components       │  │
│  │ (Mutations)      │  │ (Data Fetching + SSR)   │  │
│  └────────┬────────┘  └──────────┬──────────────┘  │
│           │                      │                  │
│  ┌────────▼──────────────────────▼──────────────┐  │
│  │           Supabase Client Layer              │  │
│  │  server.ts | actions.ts | admin.ts           │  │
│  └────────────────────┬─────────────────────────┘  │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│              Supabase Platform                      │
│  ┌──────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │ Postgres │ │   Auth    │ │  Row Level        │  │
│  │ Database │ │  Service  │ │  Security (RLS)   │  │
│  └──────────┘ └───────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Design Principles

### 1. Server-First Rendering
All pages default to **React Server Components**. Client Components are used only when interactivity is required (forms, client-side state, browser APIs). This minimizes JS shipped to the browser.

### 2. Colocation
Each route module colocates its own components, server actions, and utility functions:

```
app/(app-layout)/transactions/
├── page.tsx                  # Server Component (data fetching)
├── actions.ts                # Server Actions (mutations)
├── util/
│   ├── create-helpers.ts     # Transaction creation logic
│   └── delete-helpers.ts     # Transaction deletion logic
└── _components/
    ├── header/
    ├── transaction-table/
    └── transactions-form/
```

### 3. Type Safety Everywhere
The project uses strict TypeScript with dedicated type files in `types/`. Each database entity has two type definitions:
- **Camel-case type** (e.g., `Transaction`) — used in the application layer
- **Snake-case response type** (e.g., `Transaction_Response`) — mirrors database column names

A mapping layer in query functions converts between the two.

### 4. Separation of Concerns
- **Pages** (`page.tsx`) — data fetching, layout composition
- **Actions** (`actions.ts`) — mutations with `"use server"` directive
- **Components** (`_components/`) — pure UI rendering
- **Queries** (`lib/supabase/queries/`) — reusable, cross-route read operations
- **Types** (`types/`) — shared type definitions

---

## Route Groups

The application uses Next.js **route groups** to apply different layouts:

| Group | Layout | Purpose |
|:---|:---|:---|
| `(app-layout)` | Sidebar + Header | All authenticated pages |
| `auth` | Centered card | Login and registration |
| Root `page.tsx` | Minimal | Landing page / redirect |

### Authenticated Layout
The `(app-layout)/layout.tsx` wraps all protected pages with:
- `SidebarProvider` — collapsible sidebar with navigation
- `AppSidebar` — navigation menu with icons (Hugeicons)
- `AppHeader` — theme toggle, language selector, breadcrumbs

---

## Supabase Client Strategy

Four distinct Supabase clients serve different execution contexts:

| Client | File | Context | Auth |
|:---|:---|:---|:---|
| **Server** | `lib/supabase/server.ts` | Server Components | Cookie-based (read-only) |
| **Actions** | `lib/supabase/actions.ts` | Server Actions | Cookie-based (read/write) |
| **Admin** | `lib/supabase/admin.ts` | CRON / system ops | Service Role Key (bypasses RLS) |
| **Browser** | `lib/supabase/client.ts` | Client Components | Anon Key |

The Actions client can both read and write cookies (required for session refresh during mutations). The Admin client uses the `SUPABASE_SERVICE_ROLE_KEY` and is only used by server-side CRON jobs.

---

## Internationalization Architecture

The i18n system uses `next-intl` with:

- **86 translation files** organized by feature and locale
- **Nested message structure**: `i18n/messages/{feature}/{sub-feature}/{sub-feature}-{locale}.json`
- **Locale persistence** via cookie + localStorage sync (`LocaleSync` component)
- **Server-side translations** using `getTranslations()` in Server Components and Server Actions
- **Client-side translations** using `useTranslations()` hook

Supported locales: `en` (English, default), `sq` (Albanian).

---

## Component Library

The project includes **67 shadcn/ui components** in `components/ui/` and **8 custom chart components** in `components/charts/`. Reusable form fields in `components/form-fields/` provide consistent form UX:

- `InputFormField` — text input with icon addon support
- `SelectFormField` — dropdown select
- `DateFormField` — date picker
- `TextareaFormField` — multiline text
- `SwitchFormField` — toggle switch

---

## State Management

The application relies primarily on:
- **Server Components** for data fetching (no client state needed)
- **React Hook Form** for form state management
- **URL state** for filters and navigation
- **`revalidatePath()`** to refresh server-rendered data after mutations

There is no global client-side state library. Server Actions handle all mutations and trigger revalidation.

---

## Testing Strategy

Tests live in `__tests__/` mirroring the source structure:

| Test Area | Examples |
|:---|:---|
| Server Actions | Account CRUD, transaction CRUD, category CRUD, recurring transaction CRUD |
| CRON Logic | `computeNextRunAt`, full recurring transaction processing |
| Utilities | Date formatting, number formatting, text formatting |
| Config | i18n locale validation |
| Types | Recurring transaction type definitions |

The test stack: **Vitest** (runner) + **Testing Library** (DOM utils) + **jsdom** (browser environment).

---

## Quality Gates

The `npm run quality` command runs all checks in sequence:

```
ESLint → TypeScript → Prettier → Vitest
```

Pre-commit hooks (Husky + lint-staged) automatically format staged `.ts` and `.tsx` files.
