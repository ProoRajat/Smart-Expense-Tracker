import { initDb, closeDb } from './db.js'

initDb()
  .then(() => {
    console.log('Database initialized')
    closeDb()
    setTimeout(() => process.exit(0), 100)
  })
  .catch((e) => {
    console.error(e)
    closeDb()
    setTimeout(() => process.exit(1), 100)
  })
