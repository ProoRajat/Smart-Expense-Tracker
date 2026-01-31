import { Router } from 'express'
import { randomUUID } from 'crypto'
import { authMiddleware } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { subscriptionSchema } from '../middleware/validate.js'

const router = Router()
router.use(authMiddleware)

const parseNum = (req, res, next) => {
  if (req.body?.amount != null) req.body.amount = Number(req.body.amount)
  next()
}

router.get('/', (req, res) => {
  const db = req.db
  const rows = db.prepare(`
    SELECT id, name, amount, frequency, next_due as nextDue
    FROM subscriptions WHERE user_id = ? ORDER BY next_due ASC
  `).all(req.userId)
  res.json(rows)
})

router.post('/', parseNum, validateBody(subscriptionSchema), (req, res) => {
  const db = req.db
  const { name, amount, frequency, nextDue } = req.valid
  const id = randomUUID()
  db.prepare(`
    INSERT INTO subscriptions (id, user_id, name, amount, frequency, next_due)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, req.userId, name, amount, frequency, nextDue)
  const row = db.prepare('SELECT id, name, amount, frequency, next_due as nextDue FROM subscriptions WHERE id = ?').get(id)
  res.status(201).json(row)
})

router.patch('/:id', parseNum, (req, res) => {
  const db = req.db
  const id = req.params.id
  const existing = db.prepare('SELECT id FROM subscriptions WHERE id = ? AND user_id = ?').get(id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Subscription not found' })
  const body = req.body || {}
  const updates = []
  const values = []
  if (body.name != null) { updates.push('name = ?'); values.push(body.name) }
  if (body.amount != null) { updates.push('amount = ?'); values.push(Number(body.amount)) }
  if (body.frequency != null) { updates.push('frequency = ?'); values.push(body.frequency) }
  if (body.nextDue != null) { updates.push('next_due = ?'); values.push(body.nextDue) }
  if (updates.length === 0) return res.status(400).json({ error: 'No valid fields to update' })
  updates.push("updated_at = datetime('now')")
  values.push(id)
  db.prepare(`UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  const row = db.prepare('SELECT id, name, amount, frequency, next_due as nextDue FROM subscriptions WHERE id = ?').get(id)
  res.json(row)
})

router.delete('/:id', (req, res) => {
  const db = req.db
  const result = db.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  if (result.changes === 0) return res.status(404).json({ error: 'Subscription not found' })
  res.status(204).send()
})

export default router
