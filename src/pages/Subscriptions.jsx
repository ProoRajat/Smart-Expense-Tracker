import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Pencil, Trash2 } from 'lucide-react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'

const SUGGESTED_SUBSCRIPTIONS = [
  { name: 'Netflix', amount: 499, frequency: 'monthly' },
  { name: 'Spotify', amount: 129, frequency: 'monthly' },
  { name: 'YouTube Premium', amount: 159, frequency: 'monthly' },
  { name: 'Amazon Prime', amount: 299, frequency: 'monthly' },
  { name: 'Disney+ Hotstar', amount: 299, frequency: 'monthly' },
]

/**
 * Subscriptions tab: list and add subscriptions (name, amount, frequency, next due).
 * Suggested subscriptions (Netflix, Spotify, YouTube) auto-fill. Edit and end subscription.
 */
export default function Subscriptions() {
  const navigate = useNavigate()
  const { subscriptions, addSubscription, updateSubscription, removeSubscription } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('monthly')
  const [nextDue, setNextDue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editFrequency, setEditFrequency] = useState('monthly')
  const [editNextDue, setEditNextDue] = useState('')

  const defaultNextDue = () => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toISOString().slice(0, 10)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const amt = parseFloat(amount?.replace(/,/g, ''))
    if (!name.trim() || !Number.isFinite(amt) || amt <= 0) return
    addSubscription({
      name: name.trim(),
      amount: amt,
      frequency: frequency || 'monthly',
      nextDue: nextDue || defaultNextDue(),
    })
    setName('')
    setAmount('')
    setFrequency('monthly')
    setNextDue('')
    setShowAdd(false)
  }

  const applySuggestion = (s) => {
    setName(s.name)
    setAmount(String(s.amount))
    setFrequency(s.frequency || 'monthly')
    if (!nextDue) setNextDue(defaultNextDue())
  }

  const openEdit = (sub) => {
    setEditingId(sub.id)
    setEditName(sub.name)
    setEditAmount(String(sub.amount))
    setEditFrequency(sub.frequency || 'monthly')
    setEditNextDue(sub.nextDue || defaultNextDue())
  }

  const handleEdit = (e) => {
    e.preventDefault()
    const amt = parseFloat(editAmount?.replace(/,/g, ''))
    if (!editingId || !editName.trim() || !Number.isFinite(amt) || amt <= 0) return
    updateSubscription(editingId, {
      name: editName.trim(),
      amount: amt,
      frequency: editFrequency,
      nextDue: editNextDue,
    })
    setEditingId(null)
  }

  const handleEnd = (id) => {
    if (window.confirm('End this subscription? It will be removed from your list.')) {
      removeSubscription(id)
    }
  }

  const totalMonthly =
    subscriptions.reduce((sum, s) => {
      if (s.frequency === 'monthly') return sum + s.amount
      if (s.frequency === 'yearly') return sum + s.amount / 12
      return sum + s.amount
    }, 0) || 0

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header
        title="Subscriptions"
        onBack={() => navigate(-1)}
        rightAction={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="p-2 rounded-xl bg-primary text-white hover:bg-primary-light touch-manipulation"
            aria-label="Add subscription"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="p-4 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d mb-6">
          <p className="text-sm text-muted dark:text-muted-dark">Estimated monthly</p>
          <p className="text-xl font-display font-bold text-primary dark:text-primary-light">
            ₹{totalMonthly.toLocaleString()}
          </p>
        </div>

        <ul className="space-y-3">
          {subscriptions.map((sub) => (
            <li
              key={sub.id}
              className="p-4 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d flex justify-between items-center gap-2"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-gray-900 dark:text-white">{sub.name}</p>
                <p className="text-sm text-muted dark:text-muted-dark">
                  ₹{sub.amount?.toLocaleString()} / {sub.frequency} · Next: {sub.nextDue}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="font-semibold text-primary dark:text-primary-light mr-2">
                  ₹{sub.amount?.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(sub)}
                  className="p-2 rounded-xl text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
                  aria-label="Edit subscription"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEnd(sub.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation"
                  aria-label="End subscription"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {subscriptions.length === 0 && (
          <p className="text-muted dark:text-muted-dark text-center py-8">
            No subscriptions yet. Tap + to add one.
          </p>
        )}
      </div>

      {/* Add subscription modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto p-4 rounded-t-3xl bg-card dark:bg-card-dark shadow-3d pb-safe"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                  Add subscription
                </h3>
                <button type="button" onClick={() => setShowAdd(false)} className="p-2 rounded-xl text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Quick add (famous subscriptions)
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SUBSCRIPTIONS.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
                    >
                      {s.name} — ₹{s.amount}
                    </button>
                  ))}
                </div>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                  <input
                    type="text"
                    placeholder="e.g. Netflix"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="499"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</span>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next due date</span>
                  <input
                    type="date"
                    value={nextDue}
                    onChange={(e) => setNextDue(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-primary text-white font-semibold"
                >
                  Add subscription
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit subscription modal */}
      <AnimatePresence>
        {editingId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setEditingId(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 rounded-t-3xl bg-card dark:bg-card-dark shadow-3d pb-safe"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                  Edit subscription
                </h3>
                <button type="button" onClick={() => setEditingId(null)} className="p-2 rounded-xl text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEdit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</span>
                  <select
                    value={editFrequency}
                    onChange={(e) => setEditFrequency(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next due date</span>
                  <input
                    type="date"
                    value={editNextDue}
                    onChange={(e) => setEditNextDue(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-primary text-white font-semibold"
                >
                  Save changes
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
