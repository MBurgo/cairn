# Cairn

A ten-year plan for raising sons on purpose, and a book you hand each of them
on his eighteenth birthday.

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Supabase (Postgres + Auth + RLS).

## Getting started

1. **Create a Supabase project**, then copy its API settings:

   ```bash
   cp .env.example .env.local
   # fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   ```

2. **Apply the migrations** in order, from the Supabase SQL editor or the CLI:

   ```
   supabase/migrations/20260913000000_init.sql
   supabase/migrations/20260913000100_rls.sql
   ```

   Both are idempotent and transactional, so re-running them is safe.

3. **Run it:**

   ```bash
   npm install
   npm run dev
   ```

Without `.env.local` the app renders a setup screen rather than crashing.

## Commands

| | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Domain unit tests (vitest) |

## How it is put together

**The content is code, not data.** Arc items live in `src/lib/domain/content/`
with stable string ids. Progress rows in the database reference those ids, so
the writing can be edited freely without a migration.

**The domain layer is pure.** `src/lib/domain/` has no Supabase imports —
ages, stages, the clock and the weekly nudge are all plain functions with
tests. Everything that decides *what a father sees this week* is testable
without a database.

**A family is the tenant**, not a user, so both parents share one account's
worth of data. Row level security gates every table on family membership via
`public.user_family_ids()`.

**There is no approval gate.** A family is usable the moment it is created,
through `public.create_family()`. This is deliberate: readyforsunday shipped
an `approved` flag that had to be flipped by hand in the dashboard, and that
one column is the reason it never onboarded a family that wasn't ours.

### Two rules the code has to keep

1. **One nudge a week for the whole family, never one per son.** Three boys
   must not mean three notifications. `weeklyNudge()` rotates between sons by
   ISO week and falls through to a brother if one has nothing outstanding.
2. **No comparison between brothers, anywhere.** No side-by-side progress, no
   completion counts, no leaderboards. Boys three years apart develop at
   different rates and a father under pressure reads a gap as a verdict.

### Shared versus individual

A camping trip covers every son at once; the puberty conversation never does.
Items carry a `scope`, and `completionKey()` makes a shared item complete once
per family and an individual one complete per boy.
