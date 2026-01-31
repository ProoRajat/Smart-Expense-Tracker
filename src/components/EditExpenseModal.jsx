import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { categories, moods } from '../../data/mockExpenses'
import DateCalendar from './DateCalendar'

function dateToISO(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10)
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 10)
}

/**
 * Edit expense modal — same fields as Add, pre-filled. Calls onSave(updates).
 */
export default function EditExpenseModal({ expense, onClose, onSave }) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('food')
  const [date, setDate] = useState('')
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount ?? ''))
      setCategoryId(expense.categoryId || 'food')
      setDate(dateToISO(expense.date))
      setMood(expense.mood ?? null)
      setNote(expense.note ?? '')
    }
  }, [expense])

  if (!expense) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(amount?.replace(/,/g, ''))
    if (!Number.isFinite(num) || num <= 0) return
    onSave({
      amount: num,
      categoryId,
      date: new Date(date || new Date()).toISOString(),
      mood: mood || undefined,
      note: note.trim() || undefined,
    })
    onClose?.()
  }

  return (
    <AnimatePresence>
      {expense && (
        <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-card dark:bg-card-dark shadow-soft pb-safe"
        >
          <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 bg-card dark:bg-card-dark">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">
              Edit expense
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-5">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Date</span>
              <DateCalendar value={date} onChange={setDate} />
              <label className="block mt-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
                  aria-label="Date (alternate input)"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5 w-full min-h-[52px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-xl font-semibold text-gray-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
              />
            </label>

            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`min-h-[44px] px-4 rounded-xl font-medium touch-manipulation transition-colors ${
                      categoryId === c.id
                        ? 'bg-primary text-white dark:bg-primary-light'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mood (optional)</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(mood === m ? null : m)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl text-lg touch-manipulation transition-colors ${
                      mood === m
                        ? 'bg-accent-lavender dark:bg-primary/20 ring-2 ring-primary'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Note (optional)</span>
              <input
                type="text"
                placeholder="e.g. Lunch with team"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
              />
            </label>

            <button
              type="submit"
              className="w-full min-h-[52px] rounded-xl bg-primary text-white font-semibold hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50 touch-manipulation"
            >
              Save changes
            </button>
          </form>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
