import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { apiSignup, isApiEnabled } from '../api/client'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (isApiEnabled()) {
      setLoading(true)
      try {
        const { user } = await apiSignup(email, password, name)
        login(user)
        navigate('/dashboard', { replace: true })
      } catch (err) {
        setError(err.message || 'Sign up failed')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col px-4 py-12 md:max-w-md md:mx-auto md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center"
      >
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h1>
        <p className="mt-2 text-muted dark:text-muted-dark">
          Start understanding your money, without guilt.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-card dark:bg-card-dark text-gray-900 dark:text-white placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary touch-manipulation"
              autoComplete="name"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-card dark:bg-card-dark text-gray-900 dark:text-white placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary touch-manipulation"
              autoComplete="email"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full min-h-[48px] px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-card dark:bg-card-dark text-gray-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] rounded-xl bg-primary text-white font-medium hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50 touch-manipulation disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {!isApiEnabled() && (
          <p className="mt-4 text-sm text-muted dark:text-muted-dark text-center">
            Backend not configured. Set <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">VITE_API_URL</code> and run the API to sign up.
          </p>
        )}

        <div className="mt-6">
          <p className="text-center text-sm text-muted dark:text-muted-dark mb-3">
            or sign up with
          </p>
          <button
            type="button"
            className="w-full min-h-[48px] rounded-xl border border-gray-200 dark:border-gray-700 bg-card dark:bg-card-dark font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 touch-manipulation"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google (UI only)
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted dark:text-muted-dark">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
