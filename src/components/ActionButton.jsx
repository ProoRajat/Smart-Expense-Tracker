import { motion } from 'framer-motion'

/**
 * Large, touch-friendly action button for dashboard and CTAs.
 * Supports icon + label and optional variant.
 */
export default function ActionButton({ icon: Icon, label, onClick, variant = 'primary', className = '' }) {
  const base =
    'flex items-center justify-center gap-3 min-h-[48px] px-5 rounded-2xl font-medium touch-manipulation transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50'
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-light dark:bg-primary-light dark:hover:bg-primary shadow-soft',
    secondary:
      'bg-accent-lavender dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/20',
    ghost: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />}
      <span>{label}</span>
    </motion.button>
  )
}
