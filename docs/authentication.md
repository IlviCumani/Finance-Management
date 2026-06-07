# Authentication

This document covers the authentication system, session management, route protection, and user profile handling.

---

## Overview

FinSanctuary uses **Supabase Auth** with email/password authentication. Sessions are managed via **HTTP-only cookies** using the `@supabase/ssr` package, with **Next.js Middleware** handling session refresh and route protection on every request.

---

## Authentication Flows

### Registration

1. User submits full name, email, password, and password confirmation
2. Client-side validation runs via Zod schema (password strength, email format)
3. `register` Server Action calls `supabase.auth.signUp()` with email, password, and `full_name` metadata
4. Supabase creates the user and a linked profile row (via database trigger)
5. On success, the user is redirected to `/dashboard`

### Login

1. User submits email and password
2. Client-side validation via Zod schema
3. `login` Server Action calls `supabase.auth.signInWithPassword()`
4. Supabase returns a session; cookies are set automatically
5. On success, the user is redirected to `/dashboard`

### Logout

1. `logout` Server Action calls `supabase.auth.signOut()`
2. Session cookies are cleared
3. User is redirected to `/auth/login`

---

## Password Requirements

Validated on both client and server side:

| Rule | Regex / Constraint |
|:---|:---|
| Minimum 8 characters | `.min(8)` |
| At least one uppercase letter | `/[A-Z]/` |
| At least one lowercase letter | `/[a-z]/` |
| At least one digit | `/\d/` |
| At least one special character | `/[!@#$%^&*]/` |
| Passwords must match (registration) | `.refine()` comparison |

All validation messages are internationalized through the `validation` message namespace.

---

## Session Management

### Cookie-Based Sessions

The `@supabase/ssr` package manages sessions via cookies. Different Supabase client factories handle cookies for each execution context:

| Client | Cookie Access | Context |
|:---|:---|:---|
| `createClient()` (server) | Read-only cookies | Server Components |
| `createActionClient()` | Read/write cookies | Server Actions |
| `createBrowserClient()` | Browser cookie store | Client Components |

### Middleware Session Refresh

`middleware.ts` runs on every request (except static assets) and calls `updateSession()`:

```
Request → Middleware → Check session → Refresh if needed → Continue
```

The middleware:
1. Creates a Supabase client with cookie read/write access
2. Calls `supabase.auth.getUser()` to verify and refresh the session
3. Copies refreshed session cookies from the response to the actual response

This ensures tokens are refreshed before they expire, preventing stale sessions.

---

## Route Protection

Routes are categorized into two groups:

### Guest-Only Paths

Redirect authenticated users to `/dashboard`:
- `/` (landing page)
- `/auth/login`
- `/auth/register`

### Protected Paths

Redirect unauthenticated users to `/auth/login`:
- `/dashboard`
- `/transactions`
- `/accounts`
- `/budgets`
- `/savings`
- `/recurring-transactions`
- `/analytics`
- `/settings` (and all sub-routes)

### Protection Logic

```
if (!user && isProtectedPath)   → redirect to /auth/login
if (user && isGuestOnlyPath)    → redirect to /dashboard
```

### Server-Side Guard

In addition to middleware, the `requireUser()` utility provides an in-code guard:

```typescript
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}
```

This is called in Server Actions and query functions to ensure the user is authenticated before accessing data.

---

## User Profile

The `profiles` table is linked 1:1 with Supabase Auth users. Profile data is fetched via:

```typescript
async function getLoggedUserProfile() {
  const supabase = await createActionClient()
  const { data } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  return { loggedUserDetails: profileData, user: data.user }
}
```

The profile is used in the sidebar user dropdown to display the user's name and avatar.

---

## Security Considerations

| Area | Implementation |
|:---|:---|
| Password hashing | Handled by Supabase Auth (bcrypt) |
| Session storage | HTTP-only cookies (not accessible via JS) |
| Token refresh | Automatic via middleware on every request |
| Data isolation | Row Level Security on all tables |
| Admin operations | Service Role Key restricted to server-only CRON |
| CRON authorization | Bearer token validation against `CRON_SECRET` |

---

## Auth-Related File Map

```
app/auth/
├── actions.ts               # login, register, logout Server Actions
├── login/page.tsx            # Login form (Client Component)
├── register/page.tsx         # Registration form (Client Component)
└── _components/
    └── card-layout.tsx       # Shared auth page card wrapper

lib/
├── require-user.ts           # Auth guard utility
└── supabase/
    ├── middleware.ts          # Session refresh + route protection
    ├── server.ts              # Server Component client
    ├── actions.ts             # Server Action client
    └── client.ts              # Browser client

middleware.ts                  # Next.js edge middleware entry point
```
