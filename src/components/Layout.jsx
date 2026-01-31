import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { Home, Sparkles, PiggyBank, Repeat, Brain, Settings } from 'lucide-react'
import BottomNav from './BottomNav'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/insights', icon: Sparkles, label: 'Insights' },
  { to: '/savings', icon: PiggyBank, label: 'Savings' },
  { to: '/subscriptions', icon: Repeat, label: 'Subs' },
  { to: '/personality', icon: Brain, label: 'You' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

/**
 * Layout: bottom nav on mobile, sidebar on desktop.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex">
      {/* Desktop sidebar — hidden on mobile */}
      <aside
        className="hidden md:flex md:flex-col md:w-56 md:fixed md:inset-y-0 md:left-0 z-20 bg-card dark:bg-card-dark border-r border-gray-100 dark:border-gray-800/50"
        aria-label="Main navigation"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="w-12 h-12 rounded-xl flex-shrink-0" aria-hidden />
            <span className="font-display font-bold text-xl text-primary dark:text-primary-light">
              Expense Tracker
            </span>
          </NavLink>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-lavender dark:bg-primary/20 text-primary dark:text-primary-light'
                    : 'text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content — offset on desktop for sidebar */}
      <main className="flex-1 md:pl-56 min-h-screen">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
