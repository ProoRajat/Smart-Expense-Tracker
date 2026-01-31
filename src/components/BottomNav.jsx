import { NavLink } from 'react-router-dom'
import { Home, Sparkles, PiggyBank, Repeat, Brain, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/insights', icon: Sparkles, label: 'Insights' },
  { to: '/savings', icon: PiggyBank, label: 'Savings' },
  { to: '/subscriptions', icon: Repeat, label: 'Subs' },
  { to: '/personality', icon: Brain, label: 'You' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

/**
 * Bottom navigation — mobile-first; hidden on large screens (use sidebar in layout instead).
 */
export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card dark:bg-card-dark border-t border-gray-100 dark:border-gray-800/50 pb-safe"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] rounded-xl touch-manipulation transition-colors ${
                  isActive
                    ? 'text-primary bg-accent-lavender dark:bg-primary/20'
                    : 'text-muted dark:text-muted-dark hover:text-gray-700 dark:hover:text-gray-300'
                }`
              }
            >
              <Icon className="w-6 h-6" strokeWidth={1.8} />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
