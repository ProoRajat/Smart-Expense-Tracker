import initSqlJs from 'sql.js'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbDir = path.resolve(__dirname, '../../data')
const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'expenses.db')

let db = null
let dbWrapper = null

function save() {
  if (!db) return
  try {
    const data = db.export()
    const buffer = Buffer.from(data)
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
    fs.writeFileSync(dbPath, buffer)
  } catch (e) {
    console.error('Failed to save database:', e.message)
  }
}

function createWrapper(database) {
  return {
    prepare(sql) {
      return {
        run(...params) {
          const stmt = database.prepare(sql)
          try {
            if (params.length) stmt.bind(params)
            stmt.run()
            save()
            const changes = database.getRowsModified ? database.getRowsModified() : 0
            return { changes, lastInsertRowid: 0 }
          } finally {
            stmt.free()
          }
        },
        get(...params) {
          const stmt = database.prepare(sql)
          try {
            if (params.length) stmt.bind(params)
            return stmt.step() ? stmt.getAsObject() : undefined
          } finally {
            stmt.free()
          }
        },
        all(...params) {
          const stmt = database.prepare(sql)
          try {
            if (params.length) stmt.bind(params)
            const rows = []
            while (stmt.step()) rows.push(stmt.getAsObject())
            return rows
          } finally {
            stmt.free()
          }
        },
      }
    },
    exec(sql) {
      database.exec(sql)
      save()
    },
  }
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    monthly_income REAL,
    dark_mode INTEGER DEFAULT 0,
    guilt_free_mode INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    amount REAL NOT NULL,
    category_id TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    mood TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
  CREATE TABLE IF NOT EXISTS savings_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    item TEXT NOT NULL,
    target_amount REAL NOT NULL,
    saved_amount REAL DEFAULT 0,
    achieved INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON savings_goals(user_id);
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'monthly',
    next_due TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
  CREATE TABLE IF NOT EXISTS user_badges (
    user_id TEXT NOT NULL REFERENCES users(id),
    badge_id TEXT NOT NULL,
    earned_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, badge_id)
  );
  CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
  CREATE TABLE IF NOT EXISTS user_budget (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    monthly REAL,
    streak_days INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon TEXT,
    color TEXT
  );
`

export async function initDb() {
  if (dbWrapper) return dbWrapper
  const config = {}
  try {
    const wasmBinary = path.join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm')
    if (fs.existsSync(wasmBinary)) config.locateFile = () => wasmBinary
  } catch (_) {}
  const SQL = await initSqlJs(config)
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(new Uint8Array(buffer))
  } else {
    db = new SQL.Database()
  }
  db.exec(SCHEMA)
  const countResult = db.exec('SELECT COUNT(*) as c FROM categories')
  const c = countResult.length && countResult[0].values && countResult[0].values[0] ? countResult[0].values[0][0] : 0
  if (Number(c) === 0) {
    const categories = [
      ['food', 'Food & Dining', 'UtensilsCrossed', 'accent-peach'],
      ['transport', 'Transport', 'Car', 'accent-sky'],
      ['shopping', 'Shopping', 'ShoppingBag', 'accent-lavender'],
      ['entertainment', 'Entertainment', 'Film', 'accent-mint'],
      ['bills', 'Bills & Utilities', 'Receipt', 'accent-sky'],
      ['health', 'Health', 'Heart', 'accent-mint'],
      ['other', 'Other', 'MoreHorizontal', 'accent-lavender'],
    ]
    for (const row of categories) {
      db.run('INSERT INTO categories (id, label, icon, color) VALUES (?, ?, ?, ?)', row)
    }
    save()
  }
  dbWrapper = createWrapper(db)
  return dbWrapper
}

export function getDb() {
  if (!dbWrapper) throw new Error('Database not initialized. Call initDb() first.')
  return dbWrapper
}

/** Call before process.exit in scripts (init, seed) to avoid Windows libuv assertion. */
export function closeDb() {
  if (db && typeof db.close === 'function') {
    try { db.close() } catch (_) {}
    db = null
    dbWrapper = null
  }
}

export const BADGE_DEFINITIONS = [
  { id: 'b1', name: 'First save', icon: '🌟' },
  { id: 'b2', name: 'Budget keeper', icon: '🎯' },
  { id: 'b3', name: 'Super saver', icon: '🏆' },
  { id: 'b4', name: '7-day streak', icon: '🔥' },
  { id: 'b5', name: 'Goal crusher', icon: '⭐' },
]

export const MOODS = ['😊', '😌', '😐', '😓', '🎉', '☕', '🍳', '🛒']
