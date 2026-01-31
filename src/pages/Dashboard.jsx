import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Camera, Award, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import ExpenseCard from '../components/ExpenseCard'
import ActionButton from '../components/ActionButton'
import AddExpenseModal from '../components/AddExpenseModal'
import EditExpenseModal from '../components/EditExpenseModal'
import PieChartSpend from '../components/charts/PieChartSpend'
import BarChartYearly from '../components/charts/BarChartYearly'
import ScatterExpenses from '../components/charts/ScatterExpenses'
import { categories } from '../../data/mockExpenses'
import { categorySpendTotals, yearlyMonthlySpend, scatterExpensePoints } from '../../data/mockExpenses'

const PIE_COLORS = ['#2563eb', '#f97316', '#eab308', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Derive pie data from expenses (updates when user adds expense)
function usePieDataFromExpenses(expenses) {
  return useMemo(() => {
    const byCategory = {}
    expenses.forEach((e) => {
      const id = e.categoryId
      byCategory[id] = (byCategory[id] || 0) + (e.amount || 0)
    })
    return categories
      .filter((c) => byCategory[c.id] > 0)
      .map((c, i) => ({
        name: c.label,
        value: byCategory[c.id],
        fill: PIE_COLORS[i % PIE_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])
}

// Derive scatter from expenses (x = index, y = amount, name, category)
function useScatterFromExpenses(expenses) {
  return useMemo(() => {
    return expenses.slice(0, 20).map((e, i) => {
      const cat = categories.find((c) => c.id === e.categoryId)
      return {
        x: i + 1,
        y: e.amount,
        name: e.note || cat?.label || 'Expense',
        category: cat?.label || 'Other',
      }
    })
  }, [expenses])
}

// Subscriptions due this month (by nextDue date) — monthly equivalent amount
function useSubscriptionsDueThisMonth(subscriptions) {
  return useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    return subscriptions.reduce((sum, s) => {
      const due = s.nextDue ? new Date(s.nextDue) : null
      if (!due || due.getFullYear() !== y || due.getMonth() !== m) return sum
      const monthly = s.frequency === 'yearly' ? s.amount / 12 : s.amount
      return sum + monthly
    }, 0)
  }, [subscriptions])
}

export default function Dashboard() {
  const {
    currentUser,
    expenses,
    monthlySummary,
    badges,
    budget,
    subscriptions,
    savingsGoals,
    updateExpense,
    removeExpense,
  } = useApp()
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [badgePopup, setBadgePopup] = useState(null)

  const income = currentUser.monthlyIncome ?? monthlySummary.income ?? 0
  const totalSpent = monthlySummary.totalSpent ?? 0
  const subsDueThisMonth = useSubscriptionsDueThisMonth(subscriptions)
  const incomeLeft = Math.max(0, income - totalSpent - subsDueThisMonth)
  const totalSaved = useMemo(
    () => savingsGoals.reduce((s, g) => s + (g.savedAmount || 0), 0),
    [savingsGoals]
  )
  const spentPct = income > 0 ? Math.min(100, (totalSpent / income) * 100) : 0

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5, x: 0.3 } }), 150)
    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5, x: 0.7 } }), 300)
  }, [])

  const onBadgeClick = useCallback(
    (b) => {
      if (b.earned) {
        setBadgePopup(b)
        fireConfetti()
      }
    },
    [fireConfetti]
  )

  const pieData = usePieDataFromExpenses(expenses)
  const scatterData = useScatterFromExpenses(expenses)
  const pieDataToShow = pieData.length > 0 ? pieData : categorySpendTotals
  const scatterDataToShow = scatterData.length > 0 ? scatterData : scatterExpensePoints

  // Pie data including Savings and Income left
  const pieDataWithSavingsAndIncome = useMemo(() => {
    const base = [...pieDataToShow]
    if (totalSaved > 0) {
      base.push({ name: 'Savings', value: totalSaved, fill: '#10b981' })
    }
    if (incomeLeft > 0) {
      base.push({ name: 'Income left (month)', value: incomeLeft, fill: '#06b6d4' })
    }
    return base.length > 0 ? base : pieDataToShow
  }, [pieDataToShow, totalSaved, incomeLeft])

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Greeting — 3D card */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            {getGreeting()}, {currentUser.name} 👋
          </h2>
        </motion.section>

        {/* Current balance — 3D style */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d mb-6 bg-gradient-to-br from-white to-blue-50 dark:from-card-dark dark:to-primary/10"
        >
          <p className="text-sm text-muted dark:text-muted-dark">This month</p>
          <p className="mt-1 text-2xl font-display font-bold text-gray-900 dark:text-white">
            ₹{totalSpent.toLocaleString()} spent
          </p>
          <p className="mt-1 text-sm text-muted dark:text-muted-dark">
            {monthlySummary.daysTracked} days tracked · Income ₹{income.toLocaleString()}
            {subsDueThisMonth > 0 && (
              <span> · After subs: ₹{(income - subsDueThisMonth).toLocaleString()}</span>
            )}
          </p>
          {/* Percentage bar: spent of income */}
          {income > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs font-medium text-muted dark:text-muted-dark mb-1">
                <span>Spent of income</span>
                <span>{spentPct.toFixed(0)}%</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${spentPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-primary dark:bg-primary-light"
                />
              </div>
            </div>
          )}
        </motion.section>

        {/* Quick actions — 3D buttons */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <ActionButton
            icon={Plus}
            label="Add Expense"
            onClick={() => setShowAddExpense(true)}
          />
          <ActionButton
            icon={Camera}
            label="Upload Screenshot"
            variant="secondary"
            onClick={() => {}}
          />
        </motion.section>

        {/* Gamification: badges & budget streak */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6 p-4 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Your rewards
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onBadgeClick(b)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium touch-manipulation transition-transform active:scale-95 ${
                  b.earned
                    ? 'bg-blue-50 dark:bg-primary/20 text-primary dark:text-primary-light cursor-pointer hover:ring-2 ring-primary/50'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default'
                }`}
                title={b.earned ? `Tap to celebrate: ${b.name}` : `Locked: ${b.name}`}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted dark:text-muted-dark">
            Budget streak: <strong className="text-primary">{budget?.streakDays ?? 0}</strong> days in budget 🎯
          </p>
        </motion.section>

        {/* Pie chart — spend by category + Savings + Income left */}
        <section className="mb-6">
          <PieChartSpend data={pieDataWithSavingsAndIncome} title="Spend, savings & income left" />
        </section>

        {/* Bar chart — whole year */}
        <section className="mb-6">
          <BarChartYearly data={yearlyMonthlySpend} title="Monthly spend this year" />
        </section>

        {/* Scatter — which expense was greater */}
        <section className="mb-8">
          <ScatterExpenses data={scatterDataToShow} title="Expense comparison (higher = larger)" />
        </section>

        {/* Recent expenses — 3D cards with edit/delete */}
        <section>
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
            Recent expenses
          </h3>
          <ul className="space-y-3">
            {expenses.slice(0, 8).map((exp, i) => (
              <li key={exp.id}>
                <ExpenseCard
                  expense={exp}
                  index={i}
                  onEdit={setEditingExpense}
                  onDelete={removeExpense}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Badge congratulations popup with confetti */}
      <AnimatePresence>
        {badgePopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setBadgePopup(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-card dark:bg-card-dark rounded-3xl p-8 max-w-sm w-full shadow-3d border border-primary/20 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-6xl mb-3" aria-hidden>{badgePopup.icon}</p>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                  Congratulations!
                </h3>
                <p className="text-muted dark:text-muted-dark mb-4">
                  You earned: <strong className="text-primary dark:text-primary-light">{badgePopup.name}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setBadgePopup(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={() => setShowAddExpense(false)}
      />

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={(updates) => {
            updateExpense(editingExpense.id, updates)
            setEditingExpense(null)
          }}
        />
      )}
    </div>
  )
}
