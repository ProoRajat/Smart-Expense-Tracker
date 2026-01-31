import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trophy, PartyPopper, X, Pencil, Trash2 } from 'lucide-react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'

/**
 * Savings tracker: list goals, progress, congratulate when reached, mark as achievement.
 */
export default function Savings() {
  const navigate = useNavigate()
  const { savingsGoals, addSavingsGoal, addToSavings, markGoalAchieved, updateSavingsGoal, removeSavingsGoal } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [addAmountGoalId, setAddAmountGoalId] = useState(null)
  const [addAmount, setAddAmount] = useState('')
  const [editingGoal, setEditingGoal] = useState(null)
  const [editItem, setEditItem] = useState('')
  const [editTarget, setEditTarget] = useState('')

  const handleAddGoal = (e) => {
    e.preventDefault()
    const target = parseFloat(newTarget?.replace(/,/g, ''))
    if (!newItem.trim() || !Number.isFinite(target) || target <= 0) return
    addSavingsGoal({ item: newItem.trim(), targetAmount: target, savedAmount: 0 })
    setNewItem('')
    setNewTarget('')
    setShowAdd(false)
  }

  const handleAddToSavings = (e) => {
    e.preventDefault()
    const amt = parseFloat(addAmount?.replace(/,/g, ''))
    if (!addAmountGoalId || !Number.isFinite(amt) || amt <= 0) return
    addToSavings(addAmountGoalId, amt)
    setAddAmount('')
    setAddAmountGoalId(null)
  }

  const openEdit = (goal) => {
    setEditingGoal(goal)
    setEditItem(goal.item)
    setEditTarget(String(goal.targetAmount))
  }

  const handleEditGoal = (e) => {
    e.preventDefault()
    const target = parseFloat(editTarget?.replace(/,/g, ''))
    if (!editingGoal || !editItem.trim() || !Number.isFinite(target) || target <= 0) return
    updateSavingsGoal(editingGoal.id, { item: editItem.trim(), targetAmount: target })
    setEditingGoal(null)
  }

  const handleRemoveGoal = (id) => {
    if (window.confirm('Remove this savings goal? Progress will be lost.')) removeSavingsGoal(id)
  }

  const activeGoals = savingsGoals.filter((g) => !g.achieved)
  const achievedGoals = savingsGoals.filter((g) => g.achieved)

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header
        title="Savings"
        onBack={() => navigate(-1)}
        rightAction={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="p-2 rounded-xl bg-primary text-white hover:bg-primary-light touch-manipulation"
            aria-label="Add savings goal"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted dark:text-muted-dark mb-6">
          What are you saving for? Add a goal and track your progress.
        </p>

        {/* Active goals */}
        <section className="mb-8">
          <h2 className="font-display font-semibold text-primary dark:text-primary-light mb-4">
            Your goals
          </h2>
          <ul className="space-y-4">
            {activeGoals.map((goal) => {
              const pct = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
              const isComplete = goal.savedAmount >= goal.targetAmount
              return (
                <motion.li
                  key={goal.id}
                  layout
                  className="p-4 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                        {goal.item}
                      </h3>
                      <p className="text-sm text-muted dark:text-muted-dark mt-0.5">
                        ₹{goal.savedAmount?.toLocaleString()} / ₹{goal.targetAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openEdit(goal)}
                        className="p-2 rounded-xl text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
                        aria-label="Edit goal"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(goal.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation"
                        aria-label="Remove goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isComplete && (
                        <button
                          type="button"
                          onClick={() => markGoalAchieved(goal.id)}
                          className="text-2xl p-1"
                          title="Mark as achievement"
                        >
                          🎉
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-primary dark:bg-primary-light"
                    />
                  </div>
                  {isComplete && (
                    <div className="mt-3 flex items-center gap-2 text-success font-medium text-sm">
                      <PartyPopper className="w-4 h-4" />
                      You did it! Congrats! Mark as achievement above.
                    </div>
                  )}
                  {!isComplete && (
                    <div className="mt-3 flex gap-2">
                      {addAmountGoalId === goal.id ? (
                        <form onSubmit={handleAddToSavings} className="flex gap-2 flex-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Amount"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            className="flex-1 min-h-[40px] px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                          />
                          <button type="submit" className="px-3 rounded-xl bg-primary text-white text-sm font-medium">
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAddAmountGoalId(null); setAddAmount('') }}
                            className="p-2 rounded-xl text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddAmountGoalId(goal.id)}
                          className="text-sm font-medium text-primary dark:text-primary-light"
                        >
                          + Add to this goal
                        </button>
                      )}
                    </div>
                  )}
                </motion.li>
              )
            })}
          </ul>
        </section>

        {/* Achieved */}
        {achievedGoals.length > 0 && (
          <section>
            <h2 className="font-display font-semibold text-primary dark:text-primary-light mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </h2>
            <ul className="space-y-3">
              {achievedGoals.map((goal) => (
                <li
                  key={goal.id}
                  className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 shadow-3d flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{goal.item}</span>
                  <span className="text-2xl">🏆</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {savingsGoals.length === 0 && (
          <p className="text-muted dark:text-muted-dark text-center py-8">
            No savings goals yet. Tap + to add one!
          </p>
        )}
      </div>

      {/* Edit goal modal */}
      <AnimatePresence>
        {editingGoal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setEditingGoal(null)}
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
                  Edit savings goal
                </h3>
                <button type="button" onClick={() => setEditingGoal(null)} className="p-2 rounded-xl text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditGoal} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">What are you saving for?</span>
                  <input
                    type="text"
                    value={editItem}
                    onChange={(e) => setEditItem(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target amount (₹)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
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

      {/* Add goal modal */}
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
              className="fixed bottom-0 left-0 right-0 z-50 p-4 rounded-t-3xl bg-card dark:bg-card-dark shadow-3d pb-safe"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                  New savings goal
                </h3>
                <button type="button" onClick={() => setShowAdd(false)} className="p-2 rounded-xl text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">What are you saving for?</span>
                  <input
                    type="text"
                    placeholder="e.g. New laptop"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target amount (₹)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="50000"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-primary text-white font-semibold"
                >
                  Add goal
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
