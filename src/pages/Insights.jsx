import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import InsightCard from '../components/InsightCard'
import { insights } from '../../data/mockExpenses'

/**
 * Insights & Predictions — empathetic language, soft suggestions, no alarming colors.
 */
export default function Insights() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header title="Insights & predictions" onBack={() => navigate(-1)} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted dark:text-muted-dark mb-6">
          Gentle nudges and patterns we noticed.
        </p>
        <ul className="space-y-4">
          {insights.map((insight, i) => (
            <li key={insight.id}>
              <InsightCard insight={insight} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
