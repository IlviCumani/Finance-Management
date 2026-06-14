<div align="center">

# 🏦 FinSanctuary

### Your Personal Finance Command Center

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

A modern, full-featured personal finance management application built with the latest web technologies. Track income, expenses, transfers, subscriptions, savings goals, and budgets — all from a single, beautiful dashboard.

[Getting Started](#-getting-started) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Documentation](#-documentation)

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Dashboard
Real-time financial overview with KPI cards, balance trend charts, and at-a-glance spending summaries. Powered by Recharts with custom Line, Area, Bar, Pie, Radar, Radial, Column, and Matrix chart components.

</td>
<td width="50%">

### 💸 Transactions
Full CRUD for income, expenses, and inter-account transfers. Each transaction auto-updates account balances. Filterable data tables built with TanStack Table.

</td>
</tr>
<tr>
<td width="50%">

### 🏛️ Accounts
Manage multiple financial accounts (bank, cash wallet, savings). Track real-time balances, archive old accounts, and transfer money between them.

</td>
<td width="50%">

### 🔁 Recurring Transactions
Automate subscription tracking with configurable frequencies: daily, weekly, monthly, quarterly, or yearly. A CRON API endpoint processes due subscriptions automatically.

</td>
</tr>
<tr>
<td width="50%">

### 📁 Transaction Categories
Organize spending with custom categories (income, expense, transfer, subscription). System-provided defaults plus user-created categories.

</td>
<td width="50%">

### 🌍 Internationalization
Full i18n support for **English** and **Albanian** (sq) via `next-intl`. Every label, validation message, and UI string is translatable with locale persistence.

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Theming
Light and dark mode with `next-themes`. Three custom Google Fonts — Raleway (headings), Nunito Sans (body), and Geist Mono (code).

</td>
<td width="50%">

### 🔐 Authentication
Email/password auth powered by Supabase Auth. Middleware-enforced route protection, session refresh, and user profile management.

</td>
</tr>
<tr>
<td width="50%">

### 💰 Budgets
Set a monthly total budget on your profile, then break it into category-level limits linked to expense transaction categories. Spending is computed live from the current month's transactions. Progress bars show utilization with near-limit and over-limit warnings.

</td>
<td width="50%">

### 🐷 Savings Goals
Set financial targets with deadlines and track progress toward each goal.

</td>
</tr>
<tr>
<td width="50%">

### 📈 Analytics
Visualize spending habits across categories, time periods, and accounts with rich interactive charts.

</td>
<td width="50%">

### ⚙️ Settings
Profile management, notification preferences, security options, and app-wide preference controls.

</td>
</tr>
</table>

---

## 🛠 Tech Stack

### Core Framework

| Technology | Version | Purpose |
|:---|:---|:---|
| <img src="https://cdn.simpleicons.org/next.js/000/fff" width="16" height="16" /> **Next.js** | `16.2.6` | App Router, Server Components, Server Actions, Middleware |
| <img src="https://cdn.simpleicons.org/react/61DAFB" width="16" height="16" /> **React** | `19.2.4` | UI rendering with latest concurrent features |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" width="16" height="16" /> **TypeScript** | `5.x` | End-to-end type safety |

### Backend & Database

| Technology | Purpose |
|:---|:---|
| <img src="https://cdn.simpleicons.org/supabase/3FCF8E" width="16" height="16" /> **Supabase** | PostgreSQL database, Auth, Row Level Security, Admin client |
| <img src="https://cdn.simpleicons.org/supabase/3FCF8E" width="16" height="16" /> **@supabase/ssr** | Server-side cookie-based session management |

### UI & Styling

| Technology | Purpose |
|:---|:---|
| <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="16" height="16" /> **Tailwind CSS v4** | Utility-first styling with CSS-native configuration |
| <img src="https://cdn.simpleicons.org/shadcnui/000/fff" width="16" height="16" /> **shadcn/ui** | 67+ accessible UI components (Radix UI primitives) |
| <img src="https://cdn.simpleicons.org/radixui/161618/fff" width="16" height="16" /> **Radix UI** | Headless, accessible component primitives |
| 🎨 **class-variance-authority** | Type-safe component variant management |
| 🖼️ **Hugeicons** | Premium icon library with React bindings |

### Data & Forms

| Technology | Purpose |
|:---|:---|
| 📊 **Recharts** | 8 chart types: Line, Area, Bar, Pie, Radar, Radial, Column, Matrix |
| 📋 **TanStack Table** | Headless, type-safe data tables with sorting & filtering |
| 📝 **React Hook Form** | Performant forms with minimal re-renders |
| ✅ **Zod** | Schema-based validation with i18n error messages |

### Internationalization

| Technology | Purpose |
|:---|:---|
| 🌐 **next-intl** | Server & client i18n with nested message catalogs |
| 🇬🇧 🇦🇱 **2 Locales** | English (`en`) and Albanian (`sq`) |

### Developer Experience

| Technology | Purpose |
|:---|:---|
| <img src="https://cdn.simpleicons.org/vitest/6E9F18" width="16" height="16" /> **Vitest** | Unit & integration testing |
| <img src="https://cdn.simpleicons.org/testinglibrary/E33332" width="16" height="16" /> **Testing Library** | DOM testing utilities for React |
| <img src="https://cdn.simpleicons.org/eslint/4B32C3" width="16" height="16" /> **ESLint** | Linting with Next.js config |
| <img src="https://cdn.simpleicons.org/prettier/F7B93E" width="16" height="16" /> **Prettier** | Code formatting with Tailwind plugin |
| 🐶 **Husky** | Git hooks for pre-commit quality checks |
| 📋 **lint-staged** | Run formatters only on staged files |

### Additional Libraries

| Library | Purpose |
|:---|:---|
| `date-fns` | Lightweight date manipulation |
| `sonner` | Toast notifications |
| `vaul` | Drawer component |
| `cmdk` | Command palette (⌘K) |
| `embla-carousel-react` | Carousel/slider component |
| `react-resizable-panels` | Resizable split panes |
| `react-day-picker` | Date picker component |
| `timescape` | Time input field |
| `input-otp` | OTP input for verification |
| `frimousse` | Emoji picker |
| `react-call` | Programmatic dialog/confirm calls |
| `tw-animate-css` | Tailwind animation utilities |

---

## 🏗 Architecture

```
finance-management/
├── app/                              # Next.js App Router
│   ├── (app-layout)/                 # Authenticated layout group
│   │   ├── dashboard/                # Dashboard with charts & KPIs
│   │   ├── transactions/             # Transaction CRUD + data table
│   │   ├── accounts/                 # Account management
│   │   ├── recurring-transactions/   # Subscription/recurring payments
│   │   ├── budgets/                  # Budget tracking
│   │   ├── savings/                  # Savings goals
│   │   ├── analytics/                # Charts & reports
│   │   ├── settings/                 # User settings
│   │   │   ├── profile/
│   │   │   ├── preferences/
│   │   │   ├── security/
│   │   │   ├── notifications/
│   │   │   └── transaction-categories/
│   │   └── _components/              # Shared layout components
│   │       ├── app-sidebar/          # Navigation sidebar
│   │       ├── app-header/           # Top bar with theme/language
│   │       ├── page-header/          # Breadcrumb page headers
│   │       └── form-sheet-wrapper/   # Slide-over form panels
│   ├── auth/                         # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   └── cron/                     # CRON job endpoints
│   │       └── process-recurring-transactions/
│   └── page.tsx                      # Landing / redirect
├── components/
│   ├── ui/                           # 67 shadcn/ui components
│   ├── charts/                       # 8 Recharts wrapper components
│   └── form-fields/                  # Reusable form field components
├── hooks/                            # Custom React hooks
├── i18n/                             # Internationalization
│   ├── config.ts                     # Locale configuration
│   ├── request.ts                    # Server-side message loading
│   └── messages/                     # 86 translation files (en/sq)
├── lib/
│   ├── supabase/                     # Supabase client utilities
│   │   ├── server.ts                 # Server Component client
│   │   ├── client.ts                 # Browser client
│   │   ├── actions.ts                # Server Action client
│   │   ├── admin.ts                  # Service-role admin client
│   │   ├── middleware.ts             # Session refresh middleware
│   │   └── queries/                  # Reusable query functions
│   ├── format/                       # Number, date, text formatters
│   ├── require-user.ts              # Auth guard utility
│   └── utils.ts                      # General utilities (cn, etc.)
├── types/                            # TypeScript type definitions
│   ├── account/
│   ├── transaction/
│   ├── transaction-category/
│   ├── recurring-transactions/
│   └── budget/
├── __tests__/                        # Test suite
│   ├── accounts/
│   ├── transactions/
│   ├── recurring-transactions/
│   ├── transaction-categories/
│   ├── api/cron/
│   ├── lib/
│   └── i18n/
└── docs/                             # Detailed documentation
    ├── architecture.md
    ├── database.md
    ├── authentication.md
    ├── transactions.md
    ├── subscriptions.md
    ├── budgets.md
    ├── deployment.md
    └── api.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** (or pnpm / yarn)
- A **Supabase** project ([create one free](https://supabase.com/dashboard))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-management.git
cd finance-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
# Public (exposed to the browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LOGO_DEV_KEY=your-logo-dev-key
NEXT_PUBLIC_LOGDEV_URL=https://img.logo.dev

# Server-only (never prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-cron-secret
```

### 4. Set Up the Database

Set up your Supabase database tables and Row Level Security policies. See [docs/database.md](docs/database.md) for the full schema.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects authenticated users to `/dashboard` automatically.

---

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:ci` | Run tests once (CI mode) |
| `npm run quality` | Run lint + typecheck + format check + tests |

---

## 📚 Documentation

Detailed documentation for each major subsystem lives in the [`docs/`](docs/) directory:

| Document | Description |
|:---|:---|
| [**architecture.md**](docs/architecture.md) | System architecture, design patterns, and project conventions |
| [**database.md**](docs/database.md) | Supabase schema, tables, relationships, and RLS policies |
| [**authentication.md**](docs/authentication.md) | Auth flows, middleware, session handling, and route protection |
| [**transactions.md**](docs/transactions.md) | Transaction types, balance logic, and transfer mechanics |
| [**subscriptions.md**](docs/subscriptions.md) | Recurring transactions, CRON processing, and frequency scheduling |
| [**budgets.md**](docs/budgets.md) | Total and category budgets, monthly spend tracking, and progress warnings |
| [**deployment.md**](docs/deployment.md) | Production deployment, environment setup, and CI/CD |
| [**api.md**](docs/api.md) | Server Actions, API routes, and data layer reference |

---

## 🗺 Roadmap

<table>
<tr>
<td>

**Phase 1** ✅
- Authentication
- Accounts
- Transactions
- Categories
- Dashboard

</td>
<td>

**Phase 2** 🚧
- Budgets ✅
- Subscriptions ✅
- Savings goals
- Charts

</td>
<td>

**Phase 3** 📋
- Analytics
- Notifications
- Reports
- CSV/PDF export

</td>
<td>

**Phase 4** 🔮
- AI financial insights
- OCR receipt scanning
- Bank API integration
- Mobile app

</td>
</tr>
</table>

---

## 🧪 Testing

The project uses **Vitest** with **Testing Library** for unit and integration tests:

```bash
# Watch mode
npm run test

# Single run (CI)
npm run test:ci
```

Test coverage includes:
- Server Actions (accounts, transactions, recurring transactions, categories)
- CRON job logic (recurring transaction processing, next-run-at computation)
- Utility functions (date formatting, number formatting, text formatting)
- i18n configuration validation
- Type definitions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes (the `quality` script runs lint, typecheck, format check, and tests)
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with** ❤️ **using Next.js, React, Supabase, and shadcn/ui**

</div>
