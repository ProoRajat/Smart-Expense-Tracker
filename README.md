# Smart Expense Tracker

A calm, friendly money companion — **understand your money, without guilt.**

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, Lucide, Recharts
- **Backend (optional):** Node.js + Express + SQLite in `/backend` — sign up, sign in, persist data
- **Mobile-first** — bottom nav on mobile, sidebar on desktop
- **Empathetic UX** — narrative stories, gentle insights, no guilt-based design

Without backend: mock data only (`/data/mockExpenses.js`). With backend: set `VITE_API_URL` and run the API (see [backend/README.md](backend/README.md)). **What you need to provide** (env vars, API keys): [backend/PROVIDE.md](backend/PROVIDE.md).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **View Demo** on the landing page to jump to the dashboard.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, features, Get Started / View Demo |
| `/login`, `/signup` | Auth UI only (no backend) |
| `/dashboard` | Greeting, balance, add expense, recent expenses |
| `/story` | Weekly money story (narrative cards) |
| `/insights` | Insights & predictions (empathetic suggestions) |
| `/personality` | Spending personality (Comfort Spender, strengths, evolution) |
| `/settings` | Profile, income, Guilt-Free Mode, Dark mode |

## Structure

- `src/components/` — Header, BottomNav, ActionButton, ExpenseCard, StoryCard, InsightCard, AddExpenseModal, Layout
- `src/context/AppContext.jsx` — user, expenses, monthly summary, dark/guilt-free toggles
- `src/pages/` — one file per page
- `data/mockExpenses.js` — user, categories, expenses, weekly stories, insights, personality

## Design

- **Colors:** soft neutrals, pastel accents (lavender, peach, mint, sky), primary purple — no aggressive red/green
- **Typography:** DM Sans (body), Outfit (display)
- **Touch:** 48px min tap targets, bottom sheet for add expense

## Backend (optional)

```bash
cd backend
npm install
npm run init-db
npm run seed   # demo user: anubha@example.com / password123
npm run dev
```

Then in project root create `.env` with `VITE_API_URL=http://localhost:3001` and restart the frontend. See [backend/README.md](backend/README.md) and [backend/PROVIDE.md](backend/PROVIDE.md) for API overview and what you need to provide.

## Run backend and frontend together (sign-in and data persistence)

1. **One-time setup** (from project root):
   ```bash
   npm install
   cd backend && npm install && npm run init-db && npm run seed && cd ..
   ```
   Ensure a **`.env`** file exists in the project root (same folder as `package.json`) with:
   ```
   VITE_API_URL=http://localhost:3001
   ```
   If this is missing, the app uses mock data only and does not show sign-in; changes won’t persist after refresh.

2. **Start both** (from project root):
   ```bash
   npm run dev:all
   ```
   - API: [http://localhost:3001](http://localhost:3001)
   - App: [http://localhost:5173](http://localhost:5173)

   Or run in two terminals: `npm run dev:api` (backend) and `npm run dev` (frontend).

## Build

```bash
npm run build
npm run preview
```
