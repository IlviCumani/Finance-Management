# Deployment

This document covers production deployment, environment configuration, and CI/CD setup.

---

## Overview

FinSanctuary is a Next.js 16 application designed to deploy on **Vercel** (recommended) or any Node.js-capable hosting platform. The backend is fully managed by **Supabase** — no additional server infrastructure is needed.

---

## Prerequisites

- A **Supabase** project with the database schema configured (see [database.md](database.md))
- A hosting platform that supports Next.js (Vercel, Netlify, Railway, self-hosted Node.js)
- Node.js 18.17 or later

---

## Environment Variables

All required environment variables are defined in `.env.example`:

### Public Variables (Exposed to Browser)

| Variable | Description |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL` | Supabase storage endpoint |
| `NEXT_PUBLIC_APP_URL` | Application URL (e.g., `https://app.example.com`) |
| `NEXT_PUBLIC_LOGO_DEV_KEY` | API key for logo.dev service |
| `NEXT_PUBLIC_LOGDEV_URL` | Logo.dev base URL |

### Server-Only Variables

| Variable | Description |
|:---|:---|
| `SUPABASE_SERVICE_ROLE_KEY` | Admin-level Supabase key (bypasses RLS) |
| `CRON_SECRET` | Bearer token for CRON endpoint authorization |

> **Security note**: Never prefix server-only secrets with `NEXT_PUBLIC_`. The service role key grants full database access and must remain server-side only.

---

## Vercel Deployment (Recommended)

### 1. Connect Repository

1. Push code to a GitHub/GitLab/Bitbucket repository
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Vercel auto-detects Next.js and configures the build

### 2. Configure Environment Variables

Add all variables from `.env.example` in the Vercel project settings under **Settings > Environment Variables**. Set appropriate scopes:

- `NEXT_PUBLIC_*` variables: Production, Preview, Development
- `SUPABASE_SERVICE_ROLE_KEY`: Production only
- `CRON_SECRET`: Production only

### 3. Build Settings

Vercel uses the default Next.js build configuration:

| Setting | Value |
|:---|:---|
| Framework Preset | Next.js |
| Build Command | `next build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

The `postinstall` script runs `patch-package` automatically.

### 4. CRON Job Setup

Configure a Vercel Cron Job to trigger the recurring transaction processor:

Create or add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-recurring-transactions",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

This runs the CRON every 6 hours. Adjust the schedule as needed.

> Note: Vercel Cron sends requests with the `Authorization` header set to `Bearer <CRON_SECRET>` if you configure the `CRON_SECRET` environment variable.

---

## Self-Hosted Deployment

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

The production server starts on port 3000 by default (configure via `PORT` env var).

### CRON Setup

For self-hosted deployments, use a system cron job or external scheduler:

```bash
# Example: run every 6 hours via crontab
0 */6 * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-app.com/api/cron/process-recurring-transactions
```

---

## Build & Quality Pipeline

Run the full quality check before deploying:

```bash
npm run quality
```

This executes in order:
1. **ESLint** — Linting
2. **TypeScript** — Type checking (`tsc --noEmit`)
3. **Prettier** — Format checking
4. **Vitest** — Test suite

### CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Quality Check
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run quality
```

---

## Supabase Production Setup

### 1. Create a Production Project

Create a new Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard) for production (separate from development).

### 2. Apply Database Schema

Apply all tables, RLS policies, and functions to the production database. See [database.md](database.md) for the full schema.

### 3. Configure Auth

In the Supabase Dashboard under **Authentication > Settings**:

- Set **Site URL** to your production URL
- Add redirect URLs for production domain
- Configure email templates if needed
- Enable/disable email confirmation as desired

### 4. Security Checklist

- [ ] RLS enabled on all tables
- [ ] RLS policies restrict access to `auth.uid() = user_id`
- [ ] Service Role Key only used server-side
- [ ] CRON_SECRET is a strong, randomly generated token
- [ ] `NEXT_PUBLIC_*` variables contain no secrets
- [ ] Email confirmation enabled in production (recommended)

---

## Performance Considerations

| Area | Optimization |
|:---|:---|
| Server Components | Pages render on the server by default, reducing client JS |
| Font Loading | Google Fonts loaded via `next/font` with `display: swap` |
| Image Optimization | `next/image` with configured remote patterns |
| Revalidation | `revalidatePath()` ensures fresh data after mutations |
| Bundle Size | Client Components are used sparingly (forms, interactive UI) |
| Middleware | Edge runtime for fast session validation |
