import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { userUpdateSchema } from '../middleware/validate.js'

const router = Router()
router.use(authMiddleware)

router.get('/me', (req, res) => {
  const db = req.db
  const row = db.prepare(`
    SELECT id, email, name, monthly_income as monthlyIncome, dark_mode as darkMode, guilt_free_mode as guiltFreeMode
    FROM users WHERE id = ?
  `).get(req.userId)
  if (!row) return res.status(404).json({ error: 'User not found' })
  res.json({ ...row, darkMode: !!row.darkMode, guiltFreeMode: !!row.guiltFreeMode })
})

router.patch('/me', validateBody(userUpdateSchema), (req, res) => {
  const db = req.db
  const u = req.valid
  const updates = []
  const values = []
  if (u.name !== undefined) { updates.push('name = ?'); values.push(u.name) }
  if (u.monthlyIncome !== undefined) { updates.push('monthly_income = ?'); values.push(u.monthlyIncome) }
  if (u.darkMode !== undefined) { updates.push('dark_mode = ?'); values.push(u.darkMode ? 1 : 0) }
  if (u.guiltFreeMode !== undefined) { updates.push('guilt_free_mode = ?'); values.push(u.guiltFreeMode ? 1 : 0) }
  if (updates.length === 0) return res.status(400).json({ error: 'No valid fields to update' })
  updates.push("updated_at = datetime('now')")
  values.push(req.userId)
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  const row = db.prepare(`
    SELECT id, email, name, monthly_income as monthlyIncome, dark_mode as darkMode, guilt_free_mode as guiltFreeMode
    FROM users WHERE id = ?
  `).get(req.userId)
  res.json({ ...row, darkMode: !!row.darkMode, guiltFreeMode: !!row.guiltFreeMode })
})

export default router
