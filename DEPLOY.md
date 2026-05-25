# Production deployment checklist

## 0. Pre-deploy checks (local)

```bash
npm run build
npm run lint
node scripts/verify-security.mjs
```

## 1. GitHub

Git is already initialized with commits on `main`. After you create an empty repo on GitHub:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Use a **private** repository. Confirm `git status` never lists `.env.local`.

## 2. Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
2. Framework: **Next.js** (default). Build command: `npm run build`.
3. **Environment variables** (Production + Preview):

   | Name | Example |
   |------|---------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ…` (anon public only) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |

4. Deploy and copy the production URL.

**Do not** add `service_role` or `SUPABASE_SERVICE_ROLE_KEY`.

Optional: enable **Deployment Protection** on preview deployments if the repo is public.

## 3. Supabase (same project as local)

**Authentication → URL configuration**

| Setting | Value |
|---------|--------|
| Site URL | `https://your-app.vercel.app` |
| Redirect URLs | `https://your-app.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |

**Recommended**

- **Email** provider enabled.
- **Confirm email** on for production (optional for local dev).
- Review **Auth → Rate limits**.

Database: `schema.sql`, `seed.sql`, and `import-cards.sql` should already be applied on this project.

## 4. Post-deploy smoke test

- [ ] `/` redirects to `/login` when logged out
- [ ] Sign up and sign in work
- [ ] Practice and Review load cards; progress saves
- [ ] Browser devtools: no `service_role` or `sb_secret` in sources (anon key in bundle is expected)

## 5. Custom domain (later)

1. Add domain in Vercel.
2. Update `NEXT_PUBLIC_SITE_URL` to the custom domain.
3. Update Supabase Site URL and redirect URLs to match.
