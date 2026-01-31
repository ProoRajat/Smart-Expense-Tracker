import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import StoryCard from '../components/StoryCard'
import { weeklyStories } from '../../data/mockExpenses'

/**
 * Weekly Money Story — narrative cards instead of charts.
 */
export default function WeeklyStory() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20 md:pb-8">
      <Header title="Weekly money story" onBack={() => navigate(-1)} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted dark:text-muted-dark mb-6">
          This week in words, not numbers.
        </p>
        <ul className="space-y-4">
          {weeklyStories.map((story, i) => (
            <li key={story.id}>
              <StoryCard story={story} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
