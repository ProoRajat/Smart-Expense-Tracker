# Smart Expense Tracker — Backend API

Node.js + Express + **sql.js** (pure-JavaScript SQLite) API for the Smart Expense Tracker frontend. No native build or Visual Studio required — works on Windows, Mac, and Linux.

## Quick start

```bash
cd backend
npm install
npm run init-db
npm run seed    # optional: demo user anubha@example.com / password123
npm run dev
```

API runs at `http://localhost:3001`. Set `VITE_API_URL=http://localhost:3001` in the frontend `.env` to use it.

## What you need to provide

See **[PROVIDE.md](./PROVIDE.md)** for a list of things you must provide (env vars, API keys) and where to get them.

## API overview

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /api/auth/signup`, `POST /api/auth/login` |
| **User** | `GET /api/users/me`, `PATCH /api/users/me` |
| **Expenses** | `GET/POST /api/expenses`, `PATCH/DELETE /api/expenses/:id` |
| **Savings** | `GET/POST /api/savings-goals`, `PATCH/DELETE /api/savings-goals/:id` |
| **Subscriptions** | `GET/POST /api/subscriptions`, `PATCH/DELETE /api/subscriptions/:id` |
| **Summary** | `GET /api/summary/monthly`, `GET /api/summary/yearly` |
| **Badges** | `GET /api/badges`, `POST /api/badges/:id/earn` |
| **Budget** | `GET /api/budget`, `PATCH /api/budget` |
| **Config** | `GET /api/config/categories`, `GET /api/config/moods` |

Protected routes require header: `Authorization: Bearer <token>`.

## Scripts

- `npm run dev` — start with watch
- `npm start` — start production
- `npm run init-db` — create DB and tables
- `npm run seed` — seed demo user and sample data
