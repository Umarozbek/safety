# Safety Net Management System

Internal management app for a safety net supply and installation company operating across multiple cities in South Korea. Tracks construction orders, job sites, teams, and installation progress. No client-facing access — only internal staff (Boss, Admin, Worker roles) log in.

## Stack

- **Backend**: Nest.js (TypeScript), Prisma ORM, JWT auth with role-based guards
- **Frontend**: Next.js 16 (App Router), Tailwind CSS
- **Database**: SQLite for local dev (see `backend/prisma/schema.prisma` for notes on switching to MySQL for production)

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run start:dev
```

Runs on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Runs on `http://localhost:3002` (or the next available port).

## Test accounts

After seeding, log in with username + PIN:

| Role | Username | PIN |
|---|---|---|
| Boss | `boss` | `1234` |
| Admin | `admin` | `1234` |
| Worker | `worker` | `1234` |

## Roles

- **Boss** — read-only dashboards: completed/pending area, active teams, per-city breakdown
- **Admin** — full CRUD on customers, cities, sites, orders, teams, workers; assigns teams to jobs
- **Worker** — sees only their team's assigned jobs; marks jobs finished
