import { Router } from 'express'
import { randomUUID } from 'crypto'
import { authMiddleware } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { expenseSchema } from '../middleware/validate.js'

const router = Router()
router.use(authMiddleware)

// Parse amount from body (can be number or string)
const expenseParse = (req, res, next) => {
  if (req.body?.amount != null) req.body.amount = Number(req.body.amount)
  next()
}

router.get('/', (req, res) => {
  const db = req.db
  const { month, year, limit = 50, offset = 0 } = req.query
  let sql = 'SELECT id, amount, category_id as categoryId, date, note, mood FROM expenses WHERE user_id = ?'
  const params = [req.userId]
  if (month && year) {
    sql += ' AND strftime("%Y", date) = ? AND strftime("%m", date) = ?'
    params.push(String(year), String(month).padStart(2, '0'))
  }
  sql += ' ORDER BY date DESC LIMIT ? OFFSET ?'
  params.push(Number(limit), Number(offset))
  const rows = db.prepare(sql).all(...params)
  res.json(rows)
})

router.post('/', expenseParse, validateBody(expenseSchema), (req, res) => {
  const db = req.db
  const { amount, categoryId, date, note, mood } = req.valid
  const id = randomUUID()
  db.prepare(`
    INSERT INTO expenses (id, user_id, amount, category_id, date, note, mood)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.userId, amount, categoryId, date, note ?? null, mood ?? null)
  const row = db.prepare('SELECT id, amount, category_id as categoryId, date, note, mood FROM expenses WHERE id = ?').get(id)
  res.status(201).json(row)
})

router.patch('/:id', expenseParse, (req, res) => {
  const db = req.db
  const id = req.params.id
  const existing = db.prepare('SELECT id FROM expenses WHERE id = ? AND user_id = ?').get(id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Expense not found' })
  const body = req.body || {}
  const updates = []
  const values = []
  if (body.amount != null) { updates.push('amount = ?'); values.push(Number(body.amount)) }
  if (body.categoryId != null) { updates.push('category_id = ?'); values.push(body.categoryId) }
  if (body.date != null) { updates.push('date = ?'); values.push(body.date) }
  if (body.note !== undefined) { updates.push('note = ?'); values.push(body.note ?? null) }
  if (body.mood !== undefined) { updates.push('mood = ?'); values.push(body.mood ?? null) }
  if (updates.length === 0) return res.status(400).json({ error: 'No valid fields to update' })
  updates.push("updated_at = datetime('now')")
  values.push(id)
  db.prepare(`UPDATE expenses SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  const row = db.prepare('SELECT id, amount, category_id as categoryId, date, note, mood FROM expenses WHERE id = ?').get(id)
  res.json(row)
})

router.delete('/:id', (req, res) => {
  const db = req.db
  const result = db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  if (result.changes === 0) return res.status(404).json({ error: 'Expense not found' })
  res.status(204).send()
})

export default router
