import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Header from '../components/Header'
import StoryCard from '../components/StoryCard'
import InsightCard from '../components/InsightCard'
import { useApp } from '../context/AppContext'
import { weeklyStories, insights, yearlyMonthlySpend } from '../../data/mockExpenses'

/**
 * Single tab: Story + Insights merged. Month/year spending insights (day spent most, month spent most).
 */
export default function InsightsAndStory() {
  const navigate = useNavigate()
  const { expenses } = useApp()

  const { daySpentMost, monthSpentMost } = useMemo(() => {
    const byDay = {}
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    expenses.forEach((e) => {
      const d = new Date(e.date)
      if (d.getMonth() !== thisMonth || d.getFullYear() !== thisYear) return
      const day = d.getDate()
      byDay[day] = (byDay[day] || 0) + (e.amount || 0)
    })
    let daySpentMost = null
    let maxDay = 0
    Object.entries(byDay).forEach(([day, total]) => {
      if (total > maxDay) {
        maxDay = total
        daySpentMost = { day: Number(day), total }
      }
    })
    const yearData = yearlyMonthlySpend || []
    const best = yearData.reduce((acc, m, i) => {
      const spent = m.spent || 0
      return spent > (acc?.spent || 0) ? { ...m, index: i } : acc
    }, null)
    return {
      daySpentMost: daySpentMost ? { ...daySpentMost, label: `Day ${daySpentMost.day}` } : null,
      monthSpentMost: best ? { month: best.month, spent: best.spent } : null,
    }
  }, [expenses])

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header title="Story & insights" onBack={() => navigate(-1)} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted dark:text-muted-dark mb-6">
          Your week in words and gentle nudges.
        </p>

        {/* Month / year insights */}
        {(daySpentMost || monthSpentMost) && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-4"
          >
            <h2 className="font-display font-semibold text-primary dark:text-primary-light flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Spending insights
            </h2>
            {daySpentMost && (
              <div className="p-4 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d">
                <p className="text-sm text-muted dark:text-muted-dark">This month</p>
                <p className="font-display font-semibold text-gray-900 dark:text-white mt-1">
                  You spent the most on day {daySpentMost.day} — ₹{daySpentMost.total?.toLocaleString()}
                </p>
              </div>
            )}
            {monthSpentMost && (
              <div className="p-4 rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d">
                <p className="text-sm text-muted dark:text-muted-dark">This year</p>
                <p className="font-display font-semibold text-gray-900 dark:text-white mt-1">
                  Highest spend month: {monthSpentMost.month} — ₹{monthSpentMost.spent?.toLocaleString()}
                </p>
              </div>
            )}
          </motion.section>
        )}

        <section className="mb-8">
          <h2 className="font-display font-semibold text-primary dark:text-primary-light mb-4">
            This week&apos;s story
          </h2>
          <ul className="space-y-4">
            {weeklyStories.map((story, i) => (
              <li key={story.id}>
                <StoryCard story={story} index={i} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-primary dark:text-primary-light mb-4">
            Insights & predictions
          </h2>
          <ul className="space-y-4">
            {insights.map((insight, i) => (
              <li key={insight.id}>
                <InsightCard insight={insight} index={i} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
