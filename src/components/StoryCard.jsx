import { motion } from 'framer-motion'
import { UtensilsCrossed, Moon, Target } from 'lucide-react'

const iconMap = { UtensilsCrossed, Moon, Target }

/**
 * Narrative story card for Weekly Money Story page — text + icon, minimal chart.
 */
export default function StoryCard({ story, index = 0 }) {
  const Icon = iconMap[story.icon] || Target

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="p-5 rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-lavender dark:bg-primary/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary dark:text-primary-light" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white text-lg leading-snug">
            {story.title}
          </h3>
          <p className="mt-2 text-muted dark:text-muted-dark text-sm leading-relaxed">
            {story.description}
          </p>
        </div>
      </div>
    </motion.article>
  )
}
