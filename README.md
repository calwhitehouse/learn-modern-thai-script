# Thai Font Trainer

A calm, mobile-first Next.js app for learning to read **looped** Thai script when you are used to **modern** letterforms. Each quiz card shows a prompt in [Prompt](https://fonts.google.com/specimen/Prompt) (modern) and four multiple-choice answers in [Sarabun](https://fonts.google.com/specimen/Sarabun) (looped).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (email/password auth, Postgres, RLS)

## Features

- Decks: letters, words, sentences
- Flashcard quiz with shuffle, instant feedback, explanations, session summary
- Spaced repetition on `user_card_progress` (wrong = due today; streaks 1d / 3d / 7d / 14d / mastered)
- Review queue for due cards (including recent mistakes)
- Progress stats: accuracy, strongest/weakest deck, most missed cards

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20 LTS recommended)
- A free [Supabase](https://supabase.com) account

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Run [`supabase/seed.sql`](supabase/seed.sql) to insert decks and Thai cards.
4. Under **Authentication → Providers**, enable **Email**.
5. For local dev, you can disable **Confirm email** under Auth settings so sign-up works immediately.
6. Under **Authentication → URL configuration**:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** add `http://localhost:3000/auth/callback` (and your production URL later)
7. Optional — **CAPTCHA** ([Supabase guide](https://supabase.com/docs/guides/auth/auth-captcha)): enable hCaptcha in **Auth → Bot and Abuse Protection**, paste the **secret** in Supabase, and set `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` in `.env.local` (site key only). For local dev, add `localhost` to your hCaptcha site hostnames.

### 2. Environment variables

Copy [`.env.local.example`](.env.local.example) to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-sitekey
```

Find both under **Project Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://abcdef.supabase.co` — **no** `/rest/v1/` suffix)
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (JWT starting with `eyJ…`, not `service_role`)

**Common mistake:** using the REST API URL or the `service_role` key causes `Invalid path specified in request URL` on sign-up.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public letter reference. Sign up on `/login`, then practice from `/dashboard`.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public letter reference (modern vs looped script) |
| `/login` | Email/password sign in and sign up |
| `/dashboard` | Signed-in overview and deck shortcuts |
| `/practice` | Deck list |
| `/practice/[deckSlug]` | Quiz (`letters`, `words`, `sentences`) |
| `/review` | Due cards (SRS) |
| `/progress` | Stats |
| `/about` | About this app |

The app **proxy** ([`src/proxy.ts`](src/proxy.ts)) protects `/dashboard`, `/practice`, `/review`, `/progress`, and `/about`.

## Database

- `profiles` — created via trigger on `auth.users`
- `decks`, `cards` — shared content (seeded)
- `user_card_progress` — SRS state per user/card
- `quiz_attempts` — per-answer log with `session_id`

## Deploy to Vercel

See [`DEPLOY.md`](DEPLOY.md) for the full production checklist.

1. Push the project to GitHub and import it in [Vercel](https://vercel.com).
2. Set environment variables (Production and Preview):

   | Variable | Value |
   |----------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` (no `/rest/v1/`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public JWT (`eyJ…`) — **never** `service_role` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |

3. Deploy, then in Supabase **Authentication → URL configuration** add your production Site URL and `https://your-app.vercel.app/auth/callback` (keep `http://localhost:3000/auth/callback` for local dev).

## Security

- Only the Supabase **anon** key is used in this app; row-level security enforces per-user data access.
- Never commit `.env.local` or add `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
- Production responses include security headers via [`next.config.ts`](next.config.ts).

## Bulk import (100+ words / sentences)

1. Put your lists in [`data/words.csv`](data/words.csv) and/or [`data/sentences.csv`](data/sentences.csv) (see [`data/README.md`](data/README.md) and the `.example` files).
2. Run `npm run import:cards` → generates [`supabase/import-cards.sql`](supabase/import-cards.sql).
3. Run that SQL file in the Supabase SQL Editor (safe to re-run; skips duplicates).

JSON format is also supported (`data/words.json`, `data/sentences.json`).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint
- `npm run import:cards` — generate SQL from `data/words.*` and `data/sentences.*`
- `node scripts/verify-security.mjs` — pre-deploy secret scan

## License

Private / personal use.
