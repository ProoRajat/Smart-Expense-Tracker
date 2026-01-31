import { motion } from 'framer-motion'

/**
 * App header — minimal, with optional back and title.
 * Used on dashboard and inner pages.
 */
export default function Header({ title, onBack, rightAction }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 bg-card dark:bg-card-dark border-b border-gray-100 dark:border-gray-800/50"
    >
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold font-display text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        )}
      </div>
      {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
    </motion.header>
  )
}
