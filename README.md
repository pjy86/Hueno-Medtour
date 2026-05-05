# HN Travel - Medical Tourism to China

A professional medical tourism website for US and Indonesia customers seeking medical treatment in China. Supports English, Chinese, and Indonesian languages.

## Features

- Multi-language support (EN, ZH, ID)
- Responsive design for all devices
- Admin CMS for content management
- Contact form for customer inquiries
- Image and text content configuration

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.0
- **i18n**: next-intl
- **Database**: PostgreSQL (via Render)
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Render)

### Environment Setup

Update `.env` file with your database connection:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Installation

```bash
npm install
```

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed default data (creates admin user: admin/admin123)
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Git workflow

**Default:** Work on a **feature branch**, open a **Pull Request into `main`**, and use **Render Pull Request Previews** (when enabled) to validate a production-like build before merging. Merge the PR on GitHub to ship to production.

Do **not** routinely push feature work straight to **`main`** (that skips the PR preview path). **Exception:** only when explicitly requested (e.g. hotfix agreed with the team), with the reason communicated.

See also `.cursor/rules/project-workflow.mdc` for full project workflow notes.

## Admin CMS

Access the admin panel at `/admin/login`

- Default username: `admin`
- Default password: `admin123` (created by `npm run db:seed` when no `admin` user exists)

**Important:** Change the password after first login. New passwords must be at least **12 characters** (enforced on the change-password form and on the ops script below).

### Session and APIs

- Sessions use an **HttpOnly** cookie `admin_session` (7-day JWT). Admin UI calls use **credentialed** `fetch` (`credentials: 'include'`). `Authorization: Bearer` is still accepted for scripts and tooling.
- Protected routes include `GET /api/admin/session`, `POST /api/admin/logout`, `POST /api/admin/change-password`, `GET /api/cms`, `PUT /api/cms/update`, and `GET /api/contact`.
- The public site loads CMS via server-side [`getCmsData()`](src/lib/get-cms-data.ts) only (it does **not** call `GET /api/cms`). `POST /api/contact` remains public for form submissions.

### Login rate limit

Per client IP (from `x-forwarded-for` / `x-real-ip`), login attempts are limited (default **15** per **900** seconds). Override with optional env:

```env
ADMIN_LOGIN_MAX_ATTEMPTS_PER_WINDOW=15
ADMIN_LOGIN_WINDOW_SECONDS=900
```

The counter is held **in server memory**; if you run multiple Node instances, each applies its own limit (tighter in aggregate).

### Production secrets

Set a strong value in `NEXTAUTH_SECRET` or `ADMIN_JWT_SECRET`. If neither is set, or the value is the literal `secret`, the app returns **503** in production when issuing or verifying tokens. Local dev can use the weak default when unset.

**On Render** (`RENDER=true`), if `NEXTAUTH_SECRET` / `ADMIN_JWT_SECRET` are unset, the app derives a JWT signing key from Render’s own env (PR previews use `IS_PULL_REQUEST` + commit; production web services use a **stable** hash of `RENDER_SERVICE_ID` so sessions survive deploys). Setting an explicit random `NEXTAUTH_SECRET` in the dashboard is still **recommended** for production so the key is independent of Render internals.

### Forgot admin password (ops)

No self-service email reset is configured. With database access, set a new password from your machine (same `DATABASE_URL` as production):

```bash
npm run admin:set-password -- <username> <newPassword>
```

`newPassword` must satisfy the minimum length rule.

## Deployment to Render

### Option 1: Automatic Deploy via GitHub

1. Push this project to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Blueprint"
4. Connect your GitHub repo
5. Render will read `render.yaml` and create:
   - Web Service
   - PostgreSQL Database
6. Add environment variable `NEXT_PUBLIC_SITE_URL` with your site URL
7. Deploy!

### Option 2: Manual Deploy

1. Create a Web Service on Render
2. Create a PostgreSQL database on Render
3. Set environment variables:
   - `DATABASE_URL` (from Render PostgreSQL)
   - `NEXTAUTH_SECRET` (generate a secure string)
   - `NEXT_PUBLIC_SITE_URL` (your site URL)
4. Deploy via GitHub or render CLI

### Database Migration on Render

After first deployment, run seed to create default data:

```bash
# Via Render Shell or local
npx prisma db push
npm run db:seed
```

## Project Structure

```
hntravel/
├── src/
│   ├── app/
│   │   ├── [locale]/     # i18n routing
│   │   │   ├── page.tsx  # Homepage
│   │   │   └── layout.tsx
│   │   ├── admin/        # Admin CMS
│   │   │   ├── login/
│   │   │   ├── contents/
│   │   │   ├── images/
│   │   │   └── contacts/
│   │   └── api/          # API routes
│   │       ├── cms/
│   │       ├── contact/
│   │       └── admin/
│   ├── components/        # React components
│   ├── i18n/             # next-intl configuration
│   ├── lib/               # Database client
│   └── messages/          # Translation files
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── public/                # Static assets
```

## Database Schema

### Contents Table
Stores configurable text content with i18n support (en, zh, id_text columns).

### Images Table
Stores image URLs for homepage configuration.

### Contacts Table
Stores customer inquiries submitted via contact form.

### Admins Table
Stores admin user credentials for CMS access.

## Multi-language

The site supports 3 languages:
- English (EN) - `/en`
- Chinese (ZH) - `/zh`
- Indonesian (ID) - `/id`

Language is switched via the header dropdown and persists in URL.

## License

Private - All rights reserved
