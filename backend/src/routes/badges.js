import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { BADGE_DEFINITIONS } from '../db/db.js'

const router = Router()
router.use(authMiddleware)

router.get('/', (req, res) => {
  const db = req.db
  const earned = db.prepare('SELECT badge_id, earned_at as earnedAt FROM user_badges WHERE user_id = ?').all(req.userId)
  const earnedMap = Object.fromEntries(earned.map(e => [e.badge_id, e.earnedAt]))
  const badges = BADGE_DEFINITIONS.map(b => ({
    id: b.id,
    name: b.name,
    icon: b.icon,
    earned: !!earnedMap[b.id],
    earnedAt: earnedMap[b.id] || null,
  }))
  res.json(badges)
})

router.post('/:id/earn', (req, res) => {
  const db = req.db
  const badgeId = req.params.id
  const def = BADGE_DEFINITIONS.find(b => b.id === badgeId)
  if (!def) return res.status(404).json({ error: 'Badge not found' })
  try {
    db.prepare('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(req.userId, badgeId)
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      return res.json({ id: badgeId, earned: true, earnedAt: db.prepare('SELECT earned_at as earnedAt FROM user_badges WHERE user_id = ? AND badge_id = ?').get(req.userId, badgeId)?.earnedAt })
    }
    throw e
  }
  const earnedAt = db.prepare('SELECT earned_at as earnedAt FROM user_badges WHERE user_id = ? AND badge_id = ?').get(req.userId, badgeId)?.earnedAt
  res.status(201).json({ id: badgeId, earned: true, earnedAt })
})

export default router
