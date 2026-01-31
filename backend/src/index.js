import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDb, getDb } from './db/db.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import expenseRoutes from './routes/expenses.js'
import savingsRoutes from './routes/savings.js'
import subscriptionRoutes from './routes/subscriptions.js'
import summaryRoutes from './routes/summary.js'
import badgeRoutes from './routes/badges.js'
import budgetRoutes from './routes/budget.js'
import configRoutes from './routes/config.js'

const PORT = process.env.PORT || 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

const app = express()
app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use((req, res, next) => {
  req.db = getDb()
  next()
})

app.get('/health', (req, res) => {
  res.json({ ok: true, db: 'sqlite' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/savings-goals', savingsRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/summary', summaryRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/config', configRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

async function start() {
  await initDb()
  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)
    console.log(`Health: http://localhost:${PORT}/health`)
  })
}

start().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})
