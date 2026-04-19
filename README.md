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

## Admin CMS

Access the admin panel at `/admin/login`

- Default username: `admin`
- Default password: `admin123`

**Important**: Change the admin password after first login!

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
