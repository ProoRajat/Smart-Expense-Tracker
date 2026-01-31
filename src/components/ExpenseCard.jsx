import { motion } from 'framer-motion'
import { UtensilsCrossed, Car, ShoppingBag, Film, Receipt, Heart, MoreHorizontal } from 'lucide-react'
import { categories } from '../../data/mockExpenses'

const iconMap = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Heart,
  MoreHorizontal,
}

/**
 * Single expense row/card — category icon, amount, note, optional mood.
 * Optional onEdit/onDelete show edit and end (delete) buttons.
 */
export default function ExpenseCard({ expense, index = 0, onEdit, onDelete }) {
  const category = categories.find((c) => c.id === expense.categoryId) || categories[categories.length - 1]
  const Icon = iconMap[category.icon] || MoreHorizontal

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d"
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${category.color === 'accent-peach' ? 'bg-accent-peach' : category.color === 'accent-sky' ? 'bg-accent-sky' : category.color === 'accent-lavender' ? 'bg-accent-lavender' : category.color === 'accent-mint' ? 'bg-accent-mint' : 'bg-accent-lavender'} dark:bg-primary/20`}
      >
        <Icon className="w-5 h-5 text-primary dark:text-primary-light" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {category.label}
        </p>
        {expense.note && (
          <p className="text-sm text-muted dark:text-muted-dark truncate">{expense.note}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {expense.mood && <span className="text-lg" aria-hidden>{expense.mood}</span>}
        <span className="font-semibold text-gray-900 dark:text-white">
          ₹{expense.amount?.toLocaleString()}
        </span>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(expense)}
            className="p-2 rounded-xl text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            aria-label="Edit expense"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => window.confirm('Delete this expense?') && onDelete(expense.id)}
            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation"
            aria-label="Delete expense"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>
    </motion.article>
  )
}
