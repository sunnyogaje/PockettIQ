# PockettIQ

Personal finance and budgeting PWA for Nigerian salary earners, students,
freelancers, and anyone trying to understand where their money goes.
**Your Money. Smarter.**

Not a bank — PockettIQ never holds money, moves funds, or extends credit.
Everything is calculated from information the user enters manually.

## Tech stack

- **Next.js 16** (App Router), **TypeScript**, **React 19**
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives)
- **PostgreSQL** + **Prisma 6**
- Custom session-based auth (bcrypt + DB-backed, revocable sessions) — no
  third-party auth library
- **recharts** for the Reports charts, palette validated with Claude's
  `dataviz` skill's colorblind/contrast checker
- **@ducanh2912/next-pwa** for the service worker (see gotcha below)

## Local setup

1. **Database.** Point `DATABASE_URL` in `.env` at a Postgres 14+ instance.
   Locally this project was built against a native PostgreSQL 18 server
   with a dedicated `pockettiq` role/database — Docker Compose or any
   other local Postgres works too, nothing here is Docker-specific.
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and
   `AUTH_SECRET` (`openssl rand -hex 32`). Leave `NODE_ENV` unset — Next.js
   sets it automatically; hardcoding it disables the PWA build (see below).
3. Install dependencies and run migrations:
   ```bash
   npm install
   npx prisma migrate dev
   npm run db:seed   # seeds the default expense/income categories
   ```
4. `npm run dev` — starts on http://localhost:3000 with Turbopack.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack, fast refresh) |
| `npm run build` | Production build (`--webpack` — see gotcha below) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:seed` | Re-seed default categories |
| `npm run db:studio` | Prisma Studio |

## Gotcha: the build uses Webpack, not Turbopack

`@ducanh2912/next-pwa` generates the service worker by hooking into the
Webpack config (`config.webpack` in `next.config.ts`) — Turbopack doesn't
process that hook at all, so under Turbopack the PWA build step silently
never runs and no `sw.js` gets emitted. `npm run build` therefore runs
`next build --webpack`. `npm run dev` stays on Turbopack for fast local
iteration since the service worker is disabled in development anyway
(`disable: process.env.NODE_ENV === "development"` in `next.config.ts`).

If you ever see the PWA silently stop building, check two things first:
that `next.config.ts` isn't accidentally building with Turbopack, and that
nothing in `.env` hardcodes `NODE_ENV` (it must stay whatever Next.js sets
automatically — `development` in `next dev`, `production` in `next build`).

## Becoming an admin

There's no self-serve way to get the `/admin` dashboard — by design.
Promote a user directly in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## Architecture notes

- **`src/server/services/*`** hold all business logic and Prisma queries;
  **`src/server/actions/*`** are thin `'use server'` wrappers that call
  `requireUser()`, validate input with the matching Zod schema in
  `src/server/validation/*`, then call a service. Never call Prisma
  directly from a component or action.
- **Every user-owned query is scoped by the authenticated `userId`** from
  `requireUser()`/`getCurrentUser()` — never a client-supplied id. This is
  the IDOR boundary; keep it that way when adding new services.
- **`src/lib/finance.ts`** is the single source of truth for financial
  calculations (totals, budget percentages, savings rate, daily spending
  allowance, financial health score). Don't re-derive these inline.
- Recurring transactions have no cron job — `processDueRecurringTransactions`
  runs on every authenticated page load (see `src/app/(app)/layout.tsx`)
  and lazily materializes anything due, catching up if the user's been
  away. Same layout also runs the deterministic notification generator
  (budget-threshold, payday, upcoming-reminder checks — no AI anywhere).
- Ads and payments are both architected but intentionally unimplemented:
  `src/lib/ads.ts` is an `AdProvider` interface with a placeholder impl to
  swap for a real network later; Premium upgrade in `/pricing` flips
  `Subscription.plan` directly with no payment processing (explicitly out
  of scope per the product spec) — `paymentProvider`/`providerReference`
  on that model are the seam for a real Paystack/Flutterwave webhook later.
