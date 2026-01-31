import bcrypt from 'bcryptjs'
import { initDb, getDb, closeDb } from './db.js'

const userId = 'user-demo-1'

async function seed() {
  await initDb()
  const db = getDb()

  const passwordHash = bcrypt.hashSync('password123', 10)

  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, name, monthly_income, dark_mode, guilt_free_mode)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, 'anubha@example.com', passwordHash, 'Anubha', 85000, 0, 1)

  const expenses = [
    [userId, 420, 'food', '2025-01-28T12:30:00', 'Lunch with team', '😊'],
    [userId, 180, 'transport', '2025-01-28T09:00:00', 'Cab', '😐'],
    [userId, 890, 'shopping', '2025-01-27T18:00:00', 'Groceries', '🛒'],
    [userId, 350, 'food', '2025-01-27T20:00:00', 'Dinner out', '😌'],
    [userId, 120, 'entertainment', '2025-01-26T19:00:00', 'Streaming', '😌'],
    [userId, 2100, 'bills', '2025-01-25T00:00:00', 'Rent', null],
    [userId, 280, 'food', '2025-01-25T14:00:00', 'Coffee & snacks', '☕'],
    [userId, 450, 'health', '2025-01-24T07:00:00', 'Gym', '😊'],
  ]

  db.prepare('DELETE FROM expenses WHERE user_id = ?').run(userId)
  const insertExp = db.prepare(`
    INSERT INTO expenses (id, user_id, amount, category_id, date, note, mood)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  expenses.forEach((row, i) => {
    insertExp.run(`exp-${userId}-${i + 1}`, ...row)
  })

  db.prepare('DELETE FROM savings_goals WHERE user_id = ?').run(userId)
  const insertGoal = db.prepare(`
    INSERT INTO savings_goals (id, user_id, item, target_amount, saved_amount, achieved)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  insertGoal.run('sg1', userId, 'New laptop', 50000, 32000, 0)
  insertGoal.run('sg2', userId, 'Vacation fund', 25000, 25000, 1)
  insertGoal.run('sg3', userId, 'Emergency fund', 100000, 15000, 0)

  db.prepare('DELETE FROM subscriptions WHERE user_id = ?').run(userId)
  const insertSub = db.prepare(`
    INSERT INTO subscriptions (id, user_id, name, amount, frequency, next_due)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  insertSub.run('sub1', userId, 'Netflix', 499, 'monthly', '2025-02-05')
  insertSub.run('sub2', userId, 'Spotify', 129, 'monthly', '2025-02-12')
  insertSub.run('sub3', userId, 'Gym', 1500, 'monthly', '2025-02-01')

  db.prepare('DELETE FROM user_badges WHERE user_id = ?').run(userId)
  const insertBadge = db.prepare('INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES (?, ?, ?)')
  insertBadge.run(userId, 'b1', '2025-01-15')
  insertBadge.run(userId, 'b2', '2025-01-20')
  insertBadge.run(userId, 'b5', '2025-01-28')

  db.prepare(`
    INSERT OR REPLACE INTO user_budget (user_id, monthly, streak_days)
    VALUES (?, ?, ?)
  `).run(userId, 40000, 5)

  console.log('Seed complete. Demo user: anubha@example.com / password123')
  closeDb()
  setTimeout(() => process.exit(0), 100)
}

seed().catch((e) => {
  console.error(e)
  closeDb()
  setTimeout(() => process.exit(1), 100)
})
