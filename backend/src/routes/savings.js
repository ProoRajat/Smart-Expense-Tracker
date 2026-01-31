import { Router } from 'express'
import { randomUUID } from 'crypto'
import { authMiddleware } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { savingsGoalSchema } from '../middleware/validate.js'

const router = Router()
router.use(authMiddleware)

const parseNum = (req, res, next) => {
  if (req.body?.targetAmount != null) req.body.targetAmount = Number(req.body.targetAmount)
  if (req.body?.savedAmount != null) req.body.savedAmount = Number(req.body.savedAmount)
  next()
}

router.get('/', (req, res) => {
  const db = req.db
  const rows = db.prepare(`
    SELECT id, item, target_amount as targetAmount, saved_amount as savedAmount, achieved
    FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.userId)
  res.json(rows.map(r => ({ ...r, achieved: !!r.achieved })))
})

router.post('/', parseNum, validateBody(savingsGoalSchema), (req, res) => {
  const db = req.db
  const { item, targetAmount, savedAmount = 0 } = req.valid
  const id = randomUUID()
  db.prepare(`
    INSERT INTO savings_goals (id, user_id, item, target_amount, saved_amount, achieved)
    VALUES (?, ?, ?, ?, ?, 0)
  `).run(id, req.userId, item, targetAmount, savedAmount)
  const row = db.prepare('SELECT id, item, target_amount as targetAmount, saved_amount as savedAmount, achieved FROM savings_goals WHERE id = ?').get(id)
  res.status(201).json({ ...row, achieved: !!row.achieved })
})

router.patch('/:id', parseNum, (req, res) => {
  const db = req.db
  const id = req.params.id
  const existing = db.prepare('SELECT * FROM savings_goals WHERE id = ? AND user_id = ?').get(id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Savings goal not found' })
  const body = req.body || {}
  const updates = []
  const values = []
  if (body.item != null) { updates.push('item = ?'); values.push(body.item) }
  if (body.targetAmount != null) { updates.push('target_amount = ?'); values.push(Number(body.targetAmount)) }
  if (body.savedAmount != null) { updates.push('saved_amount = ?'); values.push(Number(body.savedAmount)) }
  if (body.achieved !== undefined) { updates.push('achieved = ?'); values.push(body.achieved ? 1 : 0) }
  if (updates.length === 0) return res.status(400).json({ error: 'No valid fields to update' })
  updates.push("updated_at = datetime('now')")
  values.push(id)
  db.prepare(`UPDATE savings_goals SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  const row = db.prepare('SELECT id, item, target_amount as targetAmount, saved_amount as savedAmount, achieved FROM savings_goals WHERE id = ?').get(id)
  res.json({ ...row, achieved: !!row.achieved })
})

router.delete('/:id', (req, res) => {
  const db = req.db
  const result = db.prepare('DELETE FROM savings_goals WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  if (result.changes === 0) return res.status(404).json({ error: 'Savings goal not found' })
  res.status(204).send()
})

export default router
