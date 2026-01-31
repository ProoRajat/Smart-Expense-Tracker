import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { signToken } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { signupSchema, loginSchema } from '../middleware/validate.js'

const router = Router()

router.post('/signup', validateBody(signupSchema), (req, res) => {
  const db = req.db
  const { email, password, name } = req.valid
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' })
  }
  const id = randomUUID()
  const passwordHash = bcrypt.hashSync(password, 10)
  db.prepare(`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `).run(id, email, passwordHash, name)
  const token = signToken({ userId: id })
  const user = db.prepare('SELECT id, email, name, monthly_income as monthlyIncome, dark_mode as darkMode, guilt_free_mode as guiltFreeMode FROM users WHERE id = ?').get(id)
  res.status(201).json({ token, user: { ...user, darkMode: !!user.darkMode, guiltFreeMode: !!user.guiltFreeMode } })
})

router.post('/login', validateBody(loginSchema), (req, res) => {
  const db = req.db
  const { email, password } = req.valid
  const row = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(email)
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const token = signToken({ userId: row.id })
  const user = db.prepare('SELECT id, email, name, monthly_income as monthlyIncome, dark_mode as darkMode, guilt_free_mode as guiltFreeMode FROM users WHERE id = ?').get(row.id)
  res.json({ token, user: { ...user, darkMode: !!user.darkMode, guiltFreeMode: !!user.guiltFreeMode } })
})

export default router
