# Nashville Scavenger Hunt

Production-ready **Next.js App Router** website and **mobile-first browser game** for [NashvilleScavengerHunt.com](https://nashvillescavengerhunt.com). One unified project — marketing site, booking, Stripe checkout, team play, certificates, and admin portal — backed by **MongoDB Atlas**.

## Quick start

```bash
cd nashville-scavenger-hunt
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and secrets
npm install
npm run seed
npx next dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + **Framer Motion**
- **MongoDB Atlas** + **Mongoose**
- **Auth.js (NextAuth v5)** — email/password, roles
- **Stripe Checkout** (test mode) + signed webhooks
- **Leaflet / OpenStreetMap** (game maps)
- **pdf-lib** — completion certificates
- **Cloudinary** — admin media (optional)
- **Nodemailer** — contact form (optional)
- **Lucide React** — icons only (no emoji UI icons)

## Project structure

```
app/
  (marketing)/     Public site (home, hunts, booking, policies, shop)
  (auth)/          Login, signup, password flows
  dashboard/       Customer account
  game/            Lobby, live play, finish
  admin/           CMS + live control room
  api/             REST + webhooks
components/        marketing, game, admin, ui
lib/               db, models, auth, routing, payments, certificates
scripts/seed.ts    Idempotent database seed
```

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `AUTH_SECRET` | Session signing (openssl rand -base64 32) |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin user (not public signup) |
| `STRIPE_*` | Hosted checkout + webhook |
| `CLOUDINARY_*` | Signed uploads in admin media |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Contact form delivery |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Optional analytics |

**Never commit real secrets.**

## MongoDB Atlas setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Database Access → add a user with read/write on your database.
3. Network Access → allow your IP (or `0.0.0.0/0` for Vercel).
4. Connect → copy the connection string into `MONGODB_URI`.
5. Run `npm run seed` once per environment.

Seed creates: site settings, **$50/person / 4 minimum** pricing plan, hunts, ~15 Nashville locations, challenges (including a **preview-safe riddle**), FAQs, sample testimonials, demo leaderboard, gift card product, and an **admin account** from env vars.

## Stripe webhook setup

1. Dashboard → Developers → API keys → add test keys to `.env.local`.
2. Create a webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `charge.refunded` (and related payment events you use).
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`.
5. Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Without Stripe keys in development**, checkout uses a clearly marked **dev fulfillment path** that still creates orders and game entitlements for testing.

## Cloudinary setup

1. Create a Cloudinary account.
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. Admin → Media uses server-side signed uploads.

## Gmail App Password (contact form)

1. Google Account → Security → 2-Step Verification enabled.
2. App passwords → create “Mail” → copy into `GMAIL_APP_PASSWORD`.
3. Set `GMAIL_USER` to the sending address.

If Gmail is not configured, contact submissions still return success and are logged server-side.

## Admin login

After seed:

- URL: `/admin`
- Email: `ADMIN_EMAIL` from `.env.local`
- Password: `ADMIN_PASSWORD`

Roles: `admin`, `super_admin`, `content_editor`, `facilitator`. Public registration cannot create admin users.

Admin can edit **pricing**, **homepage content**, **hunts**, **locations**, **challenges**, **orders**, **FAQs/testimonials**, and monitor **live games**.

## Customer journey (storyboard-aligned)

1. **Discover** → landing, referral params preserved
2. **Choose** → booking wizard (group type, date, accessibility)
3. **Create team** → name, color, captain, join code
4. **Pay** → Stripe Checkout → webhook → entitlement
5. **Assign route** → seeded weighted route engine on game start
6. **Play** → CLUE → TRAVEL → ARRIVE → TASK → VERIFY → AWARD → NEXT
7. **Finish** → Team Vault completion numbers verified
8. **Celebrate** → PDF certificate, share card, survey

## Game testing (no payment)

1. Complete booking in dev (auto-pay) or confirm a test order in admin.
2. Open `/game/lobby/[sessionId]` as captain → **Start game**.
3. Play stops on `/game/play/[sessionId]`.
4. Finish at `/game/finish/[sessionId]`.

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npm run seed     # Idempotent DB seed
```

## Deploy on Vercel (production)

1. Push repo to GitHub and import in [Vercel](https://vercel.com).
2. Set **Environment Variables** (Production + Preview) from `.env.example`:
   - **Required:** `MONGODB_URI`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_APP_URL`
   - **Payments:** `STRIPE_*` (live keys for production)
   - **Optional:** `GMAIL_*`, `CONTACT_TO_EMAIL`, analytics
3. MongoDB Atlas → Network Access → allow Vercel (`0.0.0.0/0` or Vercel IP ranges).
4. Stripe webhook → `https://YOUR_DOMAIN/api/webhooks/stripe` with signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Deploy. After first deploy, run **`npm run seed`** locally pointed at the **production** `MONGODB_URI` once (strong admin password).
6. Verify: home page loads, `/login`, `/admin`, upload in Admin → Settings, booking checkout.

**Local production smoke test:**

```bash
npm run build
npm run start
# open http://localhost:3000
```

**CI-style check:** `npm run prod:check` (lint + build).

## Features requiring external credentials

| Feature | Required env |
|---------|----------------|
| Database | `MONGODB_URI` |
| Login sessions | `AUTH_SECRET` |
| Live card payments | `STRIPE_*` |
| Contact email delivery | `GMAIL_*` |
| Admin media uploads | `CLOUDINARY_*` |
| Analytics | `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` |

## Logo & brand assets

Replace `public/icon.svg` and upload your logo via **Admin → Settings** when ready. You can drop the final logo into the next update — the header reads logo URL from MongoDB site settings.

## License

Proprietary — Nashville Scavenger Hunt. All rights reserved.
