import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'

/**
 * Settings & Profile — name, income, notifications, Guilt-Free Mode, Dark mode.
 */
export default function Settings() {
  const navigate = useNavigate()
  const {
    currentUser,
    budget,
    darkMode,
    guiltFreeMode,
    apiEnabled,
    logout,
    toggleDarkMode,
    toggleGuiltFreeMode,
    updateUser,
    updateBudget,
  } = useApp()

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header title="Settings" onBack={() => navigate(-1)} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
            Profile
          </h3>
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
            <input
              type="text"
              value={currentUser.name}
              onChange={(e) => updateUser({ name: e.target.value })}
              className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monthly income (optional)
            </span>
            <input
              type="number"
              placeholder="e.g. 85000"
              value={currentUser.monthlyIncome || ''}
              onChange={(e) =>
                updateUser({ monthlyIncome: e.target.value ? Number(e.target.value) : undefined })
              }
              className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monthly budget (for rewards)
            </span>
            <input
              type="number"
              placeholder="e.g. 40000"
              value={budget?.monthly ?? ''}
              onChange={(e) =>
                updateBudget({ monthly: e.target.value ? Number(e.target.value) : undefined })
              }
              className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark text-gray-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            />
          </label>
        </motion.section>

        {/* Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Guilt-Free Mode</p>
                <p className="text-sm text-muted dark:text-muted-dark">
                  Softer language, no shame-based messaging
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={guiltFreeMode}
                onClick={toggleGuiltFreeMode}
                className={`relative w-12 h-7 rounded-full transition-colors touch-manipulation ${
                  guiltFreeMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    guiltFreeMode ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark mode</p>
                <p className="text-sm text-muted dark:text-muted-dark">
                  Easier on the eyes at night
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={darkMode}
                onClick={toggleDarkMode}
                className={`relative w-12 h-7 rounded-full transition-colors touch-manipulation ${
                  darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    darkMode ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Notifications (UI only) */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
            Notifications
          </h3>
          <p className="text-sm text-muted dark:text-muted-dark">
            Weekly story and gentle reminders (UI only — no backend).
          </p>
        </motion.section>

        {apiEnabled && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
          >
            <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h3>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
              className="w-full min-h-[48px] rounded-xl border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation"
            >
              Sign out
            </button>
          </motion.section>
        )}

        <p className="text-center text-sm text-muted dark:text-muted-dark">
          <Link to="/welcome" className="hover:underline">Welcome page</Link>
          {!apiEnabled && (
            <> · <Link to="/login" className="hover:underline">Login (UI)</Link></>
          )}
        </p>
      </div>
    </div>
  )
}
