import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, BookOpen, Bell, ArrowRight, Play, LogIn, UserPlus } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import { isApiEnabled } from '../api/client'

const features = [
  {
    icon: Zap,
    title: 'Auto tracking',
    description: 'Log expenses in seconds. We learn your habits.',
  },
  {
    icon: BookOpen,
    title: 'Weekly money stories',
    description: 'Narrative insights, not overwhelming charts.',
  },
  {
    icon: Bell,
    title: 'Predictive alerts',
    description: 'Gentle nudges when patterns suggest a shift.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Hero */}
      <section className="relative px-4 pt-12 pb-16 overflow-hidden md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-lavender/40 via-transparent to-accent-peach/30 dark:from-primary/10 dark:to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-5xl leading-tight">
            Understand your money, without guilt.
          </h1>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark md:text-xl">
            Smart. Calm. Personal.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            {isApiEnabled() ? (
              <>
                <Link to="/login">
                  <ActionButton label="Sign in" icon={LogIn} className="w-full sm:w-auto" />
                </Link>
                <Link to="/signup">
                  <ActionButton
                    label="Sign up"
                    icon={UserPlus}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <ActionButton label="Get Started" icon={ArrowRight} className="w-full sm:w-auto" />
                </Link>
                <Link to="/dashboard">
                  <ActionButton
                    label="View Demo"
                    icon={Play}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  />
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-lavender dark:bg-primary/20 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary dark:text-primary-light" strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-display font-semibold text-gray-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted dark:text-muted-dark leading-relaxed">
                {f.description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="px-4 py-8 text-center text-sm text-muted dark:text-muted-dark border-t border-gray-100 dark:border-gray-800/50">
        <p>No judgment. Just clarity.</p>
      </footer>
    </div>
  )
}
