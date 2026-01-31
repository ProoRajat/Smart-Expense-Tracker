import { Router } from 'express'
import { MOODS } from '../db/db.js'

const router = Router()

router.get('/categories', (req, res) => {
  const db = req.db
  const rows = db.prepare('SELECT id, label, icon, color FROM categories ORDER BY id').all()
  res.json(rows)
})

router.get('/moods', (req, res) => {
  res.json(MOODS)
})

export default router
