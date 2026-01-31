import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Simple month calendar — pick a date. Shows current month with prev/next.
 */
export default function DateCalendar({ value, onChange }) {
  const date = value ? new Date(value) : new Date()
  const year = date.getFullYear()
  const month = date.getMonth()

  const { days, monthLabel } = useMemo(() => {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startPad = first.getDay()
    const daysInMonth = last.getDate()
    const days = []
    for (let i = 0; i < startPad; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    const monthLabel = first.toLocaleString('default', { month: 'long', year: 'numeric' })
    return { days, monthLabel }
  }, [year, month])

  const today = new Date()

  const setDay = (day) => {
    if (!day) return
    const d = new Date(year, month, day)
    onChange(d.toISOString().slice(0, 10))
  }

  const goPrev = () => {
    const d = new Date(year, month - 1, 1)
    onChange(d.toISOString().slice(0, 10))
  }

  const goNext = () => {
    const d = new Date(year, month + 1, 1)
    onChange(d.toISOString().slice(0, 10))
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={goPrev}
          className="p-2 rounded-lg text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{monthLabel}</span>
        <button
          type="button"
          onClick={goNext}
          className="p-2 rounded-lg text-muted dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-xs font-medium text-muted dark:text-muted-dark py-1">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />
            const isSelected =
              value && new Date(value).getDate() === day && new Date(value).getMonth() === month && new Date(value).getFullYear() === year
            const isToday =
              today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
            return (
              <button
                key={day}
                type="button"
                onClick={() => setDay(day)}
                className={`min-h-[36px] rounded-lg text-sm font-medium touch-manipulation transition-colors ${
                  isSelected
                    ? 'bg-primary text-white dark:bg-primary-light'
                    : isToday
                      ? 'bg-accent-lavender dark:bg-primary/20 text-primary dark:text-primary-light ring-1 ring-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
