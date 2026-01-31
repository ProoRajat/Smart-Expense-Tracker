import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, ChefHat } from 'lucide-react'

const iconMap = { TrendingUp, Sparkles, ChefHat }

/**
 * Insight or suggestion card — empathetic language, soft styling.
 */
export default function InsightCard({ insight, index = 0 }) {
  const Icon = iconMap[insight.icon] || Sparkles

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-mint dark:bg-success/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-success dark:text-success/90" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white">
            {insight.title}
          </h3>
          <p className="mt-1.5 text-muted dark:text-muted-dark text-sm leading-relaxed">
            {insight.text}
          </p>
        </div>
      </div>
    </motion.article>
  )
}
