import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/monthly', (req, res) => {
  const db = req.db
  const { month, year } = req.query
  const m = month || String(new Date().getMonth() + 1).padStart(2, '0')
  const y = year || String(new Date().getFullYear())
  const rows = db.prepare(`
    SELECT category_id, SUM(amount) as total
    FROM expenses
    WHERE user_id = ? AND strftime('%Y', date) = ? AND strftime('%m', date) = ?
    GROUP BY category_id
  `).all(req.userId, y, m)
  const totalSpent = rows.reduce((s, r) => s + r.total, 0)
  const daysTracked = db.prepare(`
    SELECT COUNT(DISTINCT date(date)) as c
    FROM expenses
    WHERE user_id = ? AND strftime('%Y', date) = ? AND strftime('%m', date) = ?
  `).get(req.userId, y, m)?.c ?? 0
  const top = rows.length ? rows.reduce((a, b) => (a.total > b.total ? a : b)) : null
  const user = db.prepare('SELECT monthly_income FROM users WHERE id = ?').get(req.userId)
  const income = user?.monthly_income ?? 0
  const topCategory = top ? { id: top.category_id, amount: top.total } : null
  const catLabels = db.prepare('SELECT id, label FROM categories').all()
  const labelMap = Object.fromEntries(catLabels.map(c => [c.id, c.label]))
  res.json({
    totalSpent,
    income,
    daysTracked,
    topCategory: topCategory ? { ...topCategory, label: labelMap[topCategory.id] || topCategory.id } : null,
  })
})

router.get('/yearly', (req, res) => {
  const db = req.db
  const { year } = req.query
  const y = year || String(new Date().getFullYear())
  const rows = db.prepare(`
    SELECT strftime('%m', date) as month, SUM(amount) as spent
    FROM expenses
    WHERE user_id = ? AND strftime('%Y', date) = ?
    GROUP BY strftime('%m', date)
    ORDER BY month
  `).all(req.userId, y)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const byMonth = Object.fromEntries(rows.map(r => [r.month, r.spent]))
  const result = monthNames.map((name, i) => {
    const mm = String(i + 1).padStart(2, '0')
    return { month: name, spent: byMonth[mm] ?? 0 }
  })
  res.json(result)
})

export default router
