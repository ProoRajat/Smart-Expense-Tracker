import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { budgetSchema } from '../middleware/validate.js'

const router = Router()
router.use(authMiddleware)

router.get('/', (req, res) => {
  const db = req.db
  const row = db.prepare('SELECT monthly, streak_days as streakDays FROM user_budget WHERE user_id = ?').get(req.userId)
  res.json(row || { monthly: null, streakDays: 0 })
})

router.patch('/', validateBody(budgetSchema), (req, res) => {
  const db = req.db
  const { monthly, streakDays } = req.valid
  const existing = db.prepare('SELECT monthly, streak_days FROM user_budget WHERE user_id = ?').get(req.userId)
  if (existing) {
    const m = monthly !== undefined ? monthly : existing.monthly
    const s = streakDays !== undefined ? streakDays : existing.streak_days
    db.prepare(`
      UPDATE user_budget SET monthly = ?, streak_days = ?, updated_at = datetime('now') WHERE user_id = ?
    `).run(m, s, req.userId)
  } else {
    db.prepare(`
      INSERT INTO user_budget (user_id, monthly, streak_days) VALUES (?, ?, ?)
    `).run(req.userId, monthly ?? null, streakDays ?? 0)
  }
  const row = db.prepare('SELECT monthly, streak_days as streakDays FROM user_budget WHERE user_id = ?').get(req.userId)
  res.json(row || { monthly: null, streakDays: 0 })
})

export default router
