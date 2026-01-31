import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, Shield, Eye } from 'lucide-react'
import Header from '../components/Header'
import { spendingPersonality } from '../../data/mockExpenses'

/**
 * Spending Personality — fun, shareable, strengths & blind spots.
 */
export default function Personality() {
  const navigate = useNavigate()
  const p = spendingPersonality

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header title="Spending personality" onBack={() => navigate(-1)} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Personality card */}
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-lavender dark:bg-primary/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary dark:text-primary-light" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                The {p.type}
              </h2>
              <p className="text-sm text-muted dark:text-muted-dark mt-0.5">
                Your money companion style
              </p>
            </div>
          </div>
          <p className="mt-4 text-muted dark:text-muted-dark leading-relaxed">
            {p.description}
          </p>
        </motion.article>

        {/* Strengths */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="p-5 rounded-2xl bg-accent-mint/50 dark:bg-success/10 border border-accent-mint/50 dark:border-success/20"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" strokeWidth={1.8} />
            Strengths
          </h3>
          <ul className="mt-3 space-y-2">
            {p.strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-success mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Blind spots — gentle framing */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-accent-peach/40 dark:bg-primary/10 border border-accent-peach/50 dark:border-primary/20"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary dark:text-primary-light" strokeWidth={1.8} />
            Things to watch (gently)
          </h3>
          <ul className="mt-3 space-y-2">
            {p.blindSpots.map((b, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Monthly evolution */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
        >
          <h3 className="font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" strokeWidth={1.8} />
            Monthly evolution
          </h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.monthlyEvolution}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-full rounded-full bg-primary dark:bg-primary-light"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {p.monthlyEvolution}%
            </span>
          </div>
          <p className="mt-2 text-xs text-muted dark:text-muted-dark">
            How much you’ve grown with your habits this month
          </p>
        </motion.section>
      </div>
    </div>
  )
}
