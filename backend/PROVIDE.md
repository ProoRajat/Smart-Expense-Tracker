# What You Need to Provide

This document lists **everything you must provide** (env vars, API keys, services) to run and deploy the Smart Expense Tracker backend, and **where to get them**.

---

## 1. Required: JWT Secret

**What:** A long random string used to sign and verify login tokens.  
**Where:** You generate it yourself — never use a default in production.

- **Local/dev:** You can use the default in code (`dev-secret-change-in-production`) or set in `.env`:
  ```env
  JWT_SECRET=any-long-random-string-at-least-32-characters
  ```
- **Production:** Generate a secure random string, e.g.:
  - Node: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - Or use a password manager / secrets manager to generate 32+ random characters.
- **Where to set:** In `backend/.env` (see `backend/.env.example`).  
  For production, set in your host’s environment (Railway, Render, Vercel, etc.).

---

## 2. Optional: Port

**What:** Port the API listens on.  
**Default:** `3001`.

- **Where to set:** `backend/.env` → `PORT=3001` (or any free port).  
  Hosting platforms usually assign a port via `process.env.PORT`; you rarely need to set this yourself.

---

## 3. Optional: Database Path (SQLite)

**What:** Path to the SQLite database file.  
**Default:** `backend/data/expenses.db` (created automatically).

- **Where to set:** `backend/.env` → `DATABASE_PATH=./data/expenses.db`.  
- **Production:** For a real deployment you may switch to PostgreSQL; then you’d provide `DATABASE_URL` instead (see below). The current code uses SQLite only; no external DB signup is required for local run.

---

## 4. Optional: CORS Origin (Frontend URL)

**What:** The URL of your frontend so the API allows browser requests from it.  
**Default:** `http://localhost:5173` (Vite default).

- **Where to set:** `backend/.env` → `CORS_ORIGIN=http://localhost:5173`.  
- **Production:** Set to your real frontend URL, e.g. `https://yourapp.vercel.app`.  
- **Where you get it:** Your own frontend URL — you don’t “get” this from a third party.

---

## 5. Optional: Email (Forgot Password / Notifications)

**What:** SMTP credentials to send emails (e.g. forgot password, reminders).  
**Status:** Not implemented in the current backend. When you add it, you’ll need:

| Variable   | What it is           | Where to get it |
|-----------|---------------------|------------------|
| SMTP_HOST | SMTP server host    | Your email provider |
| SMTP_PORT | Usually 587 (TLS)   | Same |
| SMTP_USER | SMTP username       | Same |
| SMTP_PASS | SMTP password       | Same (often “app password”) |
| EMAIL_FROM | Sender address    | Your domain or provider |

**Where to get SMTP:**

- **Gmail:** [Google App Passwords](https://support.google.com/accounts/answer/185833) (use an app password, not your normal password).
- **SendGrid:** [SendGrid](https://sendgrid.com/) → API Keys or SMTP credentials.
- **Resend:** [Resend](https://resend.com/) → API key + use their SMTP or HTTP API.
- **Mailgun:** [Mailgun](https://www.mailgun.com/) → SMTP credentials in dashboard.
- **AWS SES:** [Amazon SES](https://aws.amazon.com/ses/) → SMTP credentials in SES console.

You don’t need any of these to run the app today; they’re for future email features.

---

## 6. Optional: PostgreSQL (Production Database)

**What:** A production database URL if you switch from SQLite to PostgreSQL.  
**Status:** Current backend uses SQLite only. No PostgreSQL is required to run the app.

**Where to get a database URL:**

- **Railway:** [railway.app](https://railway.app) → New Project → PostgreSQL → copy `DATABASE_URL`.
- **Render:** [render.com](https://render.com) → New → PostgreSQL → copy Internal/External URL.
- **Supabase:** [supabase.com](https://supabase.com) → New project → Settings → Database → connection string.
- **Neon:** [neon.tech](https://neon.tech) → Create project → connection string.
- **Vercel Postgres:** [Vercel Storage](https://vercel.com/storage) → Postgres.

If you add PostgreSQL support later, you’d set `DATABASE_URL` in your production environment; the app would need code changes to use it instead of SQLite.

---

## 7. Optional: Hosting (Where to Run the Backend)

**What:** A server or platform to run the Node.js API in production.  
**Where to get it:** You choose a host and create an account. Examples:

- **Railway:** [railway.app](https://railway.app) — easy deploy from GitHub, env vars in dashboard.
- **Render:** [render.com](https://render.com) — free tier, set env vars in dashboard.
- **Fly.io:** [fly.io](https://fly.io) — CLI deploy, secrets via `fly secrets set`.
- **Vercel:** [vercel.com](https://vercel.com) — better for serverless; you’d add env vars in project settings.
- **Your own VPS:** DigitalOcean, Linode, etc. — you set env vars in the environment or a `.env` file.

You don’t need to provide any “API” for hosting; you just sign up and configure env vars (especially `JWT_SECRET` and `CORS_ORIGIN`).

---

## Summary Table: What You Provide and Where

| Item            | Required? | Where you get it / set it |
|-----------------|-----------|----------------------------|
| **JWT_SECRET**  | Yes (prod)| You generate it; set in `backend/.env` or host env. |
| **PORT**        | No        | Optional in `.env`; host often sets for you. |
| **DATABASE_PATH** | No     | Optional in `.env`; default SQLite path. |
| **CORS_ORIGIN** | No        | Your frontend URL; set in `.env` or host env. |
| **SMTP_*** / **EMAIL_FROM** | No (future) | Email provider (Gmail, SendGrid, Resend, etc.). |
| **DATABASE_URL**| No (future)| If you add PostgreSQL: Railway, Render, Supabase, Neon, etc. |
| **Hosting**     | For production | Railway, Render, Fly.io, Vercel, or your server. |

---

## Quick Start (Nothing External Required)

To run the backend **without providing any external API or key**:

1. Copy `backend/.env.example` to `backend/.env`.
2. (Optional) Set `JWT_SECRET=your-secret` in `backend/.env`; otherwise the dev default is used.
3. From project root:
   ```bash
   cd backend
   npm install
   npm run init-db
   npm run seed    # optional: demo user anubha@example.com / password123
   npm run dev
   ```
4. Frontend: set `VITE_API_URL=http://localhost:3001` (see frontend README or `.env.example`).

No signup for third-party APIs is required for local development.
