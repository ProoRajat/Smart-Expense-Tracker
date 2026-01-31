import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  user as initialUser,
  expenses as initialExpenses,
  monthlySummary as initialSummary,
  initialSavingsGoals,
  initialSubscriptions,
  initialBadges,
  initialBudget,
} from '../../data/mockExpenses'
import {
  isApiEnabled,
  getStoredToken,
  clearToken,
  apiGetMe,
  apiUpdateMe,
  apiGetExpenses,
  apiAddExpense,
  apiUpdateExpense,
  apiDeleteExpense,
  apiGetSavingsGoals,
  apiAddSavingsGoal,
  apiUpdateSavingsGoal,
  apiDeleteSavingsGoal,
  apiGetSubscriptions,
  apiAddSubscription,
  apiUpdateSubscription,
  apiDeleteSubscription,
  apiGetMonthlySummary,
  apiGetBadges,
  apiEarnBadge,
  apiGetBudget,
  apiUpdateBudget,
} from '../api/client'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialUser)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [monthlySummary, setMonthlySummary] = useState(initialSummary)
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals)
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [badges, setBadges] = useState(initialBadges)
  const [budget, setBudget] = useState(initialBudget)
  const [darkMode, setDarkMode] = useState(initialUser.darkMode ?? false)
  const [guiltFreeMode, setGuiltFreeMode] = useState(initialUser.guiltFreeMode ?? true)
  const [apiLoading, setApiLoading] = useState(false)
  const apiEnabled = isApiEnabled()

  // Toggle dark mode and persist to "user" (no backend)
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      setCurrentUser((u) => ({ ...u, darkMode: next }))
      if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  const toggleGuiltFreeMode = useCallback(() => {
    setGuiltFreeMode((prev) => {
      const next = !prev
      setCurrentUser((u) => ({ ...u, guiltFreeMode: next }))
      return next
    })
  }, [])

  const addExpense = useCallback(async (expense) => {
    const payload = {
      amount: expense.amount,
      categoryId: expense.categoryId,
      date: expense.date || new Date().toISOString(),
      note: expense.note,
      mood: expense.mood,
    }
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiAddExpense(payload)
        setExpenses((prev) => [data, ...prev])
        const summary = await apiGetMonthlySummary()
        setMonthlySummary(summary)
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    const newExpense = {
      ...expense,
      id: String(Date.now()),
      date: expense.date || new Date().toISOString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
    setMonthlySummary((prev) => ({
      ...prev,
      totalSpent: prev.totalSpent + (expense.amount || 0),
      daysTracked: prev.daysTracked,
    }))
  }, [apiEnabled])

  const updateExpense = useCallback(async (id, updates) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiUpdateExpense(id, updates)
        setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
        const summary = await apiGetMonthlySummary()
        setMonthlySummary(summary)
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setExpenses((prev) => {
      const item = prev.find((e) => e.id === id)
      if (!item) return prev
      const newAmount = updates.amount !== undefined ? updates.amount : item.amount
      const diff = (newAmount || 0) - (item.amount || 0)
      setMonthlySummary((s) => ({
        ...s,
        totalSpent: Math.max(0, s.totalSpent + diff),
      }))
      return prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    })
  }, [apiEnabled])

  const removeExpense = useCallback(async (id) => {
    if (apiEnabled && getStoredToken()) {
      try {
        await apiDeleteExpense(id)
        setExpenses((prev) => prev.filter((e) => e.id !== id))
        const summary = await apiGetMonthlySummary()
        setMonthlySummary(summary)
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setExpenses((prev) => {
      const item = prev.find((e) => e.id === id)
      const amount = item?.amount || 0
      setMonthlySummary((s) => ({
        ...s,
        totalSpent: Math.max(0, s.totalSpent - amount),
      }))
      return prev.filter((e) => e.id !== id)
    })
  }, [apiEnabled])

  const addSavingsGoal = useCallback(async (goal) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiAddSavingsGoal({ item: goal.item, targetAmount: goal.targetAmount, savedAmount: goal.savedAmount || 0 })
        setSavingsGoals((prev) => [...prev, data])
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setSavingsGoals((prev) => [
      ...prev,
      { ...goal, id: String(Date.now()), achieved: false, savedAmount: goal.savedAmount || 0 },
    ])
  }, [apiEnabled])

  const updateSavingsGoal = useCallback(async (id, updates) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiUpdateSavingsGoal(id, updates)
        setSavingsGoals((prev) => prev.map((g) => (g.id === id ? data : g)))
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    )
  }, [apiEnabled])

  const removeSavingsGoal = useCallback(async (id) => {
    if (apiEnabled && getStoredToken()) {
      try {
        await apiDeleteSavingsGoal(id)
        setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
  }, [apiEnabled])

  const addToSavings = useCallback((goalId, amount) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              savedAmount: g.savedAmount + amount,
              achieved: g.savedAmount + amount >= g.targetAmount,
            }
          : g
      )
    )
  }, [])

  const markGoalAchieved = useCallback((goalId) => {
    setSavingsGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, achieved: true } : g)))
  }, [])

  const addSubscription = useCallback(async (sub) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiAddSubscription({
          name: sub.name,
          amount: sub.amount,
          frequency: sub.frequency || 'monthly',
          nextDue: sub.nextDue,
        })
        setSubscriptions((prev) => [...prev, data])
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setSubscriptions((prev) => [...prev, { ...sub, id: String(Date.now()) }])
  }, [apiEnabled])

  const updateSubscription = useCallback(async (id, updates) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiUpdateSubscription(id, updates)
        setSubscriptions((prev) => prev.map((s) => (s.id === id ? data : s)))
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }, [apiEnabled])

  const removeSubscription = useCallback(async (id) => {
    if (apiEnabled && getStoredToken()) {
      try {
        await apiDeleteSubscription(id)
        setSubscriptions((prev) => prev.filter((s) => s.id !== id))
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }, [apiEnabled])

  const updateBudget = useCallback(async (updates) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiUpdateBudget(updates)
        setBudget(data)
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setBudget((prev) => ({ ...prev, ...updates }))
  }, [apiEnabled])

  const unlockBadge = useCallback(async (badgeId) => {
    if (apiEnabled && getStoredToken()) {
      try {
        await apiEarnBadge(badgeId)
        setBadges((prev) =>
          prev.map((b) => (b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString().slice(0, 10) } : b))
        )
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString().slice(0, 10) } : b))
    )
  }, [apiEnabled])

  const updateUser = useCallback(async (updates) => {
    if (apiEnabled && getStoredToken()) {
      try {
        const data = await apiUpdateMe(updates)
        setCurrentUser((prev) => ({ ...prev, ...data }))
        setDarkMode(!!data.darkMode)
        setGuiltFreeMode(!!data.guiltFreeMode)
      } catch (e) {
        console.error(e)
        throw e
      }
      return
    }
    setCurrentUser((prev) => ({ ...prev, ...updates }))
  }, [apiEnabled])

  // Load all data from API when token exists
  const loadFromApi = useCallback(async () => {
    if (!apiEnabled || !getStoredToken()) return
    setApiLoading(true)
    try {
      const [user, expensesList, goals, subs, badgesList, budgetRow, summary] = await Promise.all([
        apiGetMe(),
        apiGetExpenses({ limit: 100 }),
        apiGetSavingsGoals(),
        apiGetSubscriptions(),
        apiGetBadges(),
        apiGetBudget(),
        apiGetMonthlySummary(),
      ])
      setCurrentUser((prev) => ({ ...prev, ...user, darkMode: !!user.darkMode, guiltFreeMode: !!user.guiltFreeMode }))
      setExpenses(expensesList)
      setSavingsGoals(goals)
      setSubscriptions(subs)
      setBadges(badgesList)
      setBudget(budgetRow || { monthly: null, streakDays: 0 })
      setMonthlySummary(summary)
      if (user.darkMode != null) setDarkMode(!!user.darkMode)
      if (user.guiltFreeMode != null) setGuiltFreeMode(!!user.guiltFreeMode)
    } catch (e) {
      console.error('Failed to load from API', e)
      clearToken()
    } finally {
      setApiLoading(false)
    }
  }, [apiEnabled])

  const login = useCallback((user) => {
    setCurrentUser((prev) => ({ ...prev, ...user, darkMode: !!user.darkMode, guiltFreeMode: !!user.guiltFreeMode }))
    setDarkMode(!!user.darkMode)
    setGuiltFreeMode(!!user.guiltFreeMode)
    loadFromApi()
  }, [loadFromApi])

  const logout = useCallback(() => {
    clearToken()
    setCurrentUser(initialUser)
    setExpenses(initialExpenses)
    setMonthlySummary(initialSummary)
    setSavingsGoals(initialSavingsGoals)
    setSubscriptions(initialSubscriptions)
    setBadges(initialBadges)
    setBudget(initialBudget)
    setDarkMode(initialUser.darkMode ?? false)
    setGuiltFreeMode(initialUser.guiltFreeMode ?? true)
  }, [])

  // On mount: restore session from token and load API data
  useEffect(() => {
    if (apiEnabled && getStoredToken()) {
      loadFromApi()
    }
  }, [apiEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync dark mode to document on mount and when it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const value = {
    currentUser,
    expenses,
    monthlySummary,
    savingsGoals,
    subscriptions,
    badges,
    budget,
    apiEnabled,
    apiLoading,
    login,
    logout,
    loadFromApi,
    addExpense,
    updateExpense,
    removeExpense,
    addSavingsGoal,
    updateSavingsGoal,
    removeSavingsGoal,
    addToSavings,
    markGoalAchieved,
    addSubscription,
    updateSubscription,
    removeSubscription,
    updateBudget,
    unlockBadge,
    updateUser,
    darkMode,
    guiltFreeMode,
    toggleDarkMode,
    toggleGuiltFreeMode,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
