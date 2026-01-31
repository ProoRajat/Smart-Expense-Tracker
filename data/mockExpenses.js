/**
 * Mock data for Smart Expense Tracker — no backend.
 * Simulates monthly data, categories, emotions, and user profile.
 */

export const user = {
  name: 'Anubha',
  email: 'anubha@example.com',
  monthlyIncome: 85000,
  guiltFreeMode: true,
  darkMode: false,
}

export const categories = [
  { id: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed', color: 'accent-peach' },
  { id: 'transport', label: 'Transport', icon: 'Car', color: 'accent-sky' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'accent-lavender' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Film', color: 'accent-mint' },
  { id: 'bills', label: 'Bills & Utilities', icon: 'Receipt', color: 'accent-sky' },
  { id: 'health', label: 'Health', icon: 'Heart', color: 'accent-mint' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: 'accent-lavender' },
]

export const moods = ['😊', '😌', '😐', '😓', '🎉', '☕', '🍳', '🛒']

// Current month expenses (for dashboard & add flow)
export const expenses = [
  { id: '1', amount: 420, categoryId: 'food', note: 'Lunch with team', mood: '😊', date: '2025-01-28T12:30:00' },
  { id: '2', amount: 180, categoryId: 'transport', note: 'Cab', mood: '😐', date: '2025-01-28T09:00:00' },
  { id: '3', amount: 890, categoryId: 'shopping', note: 'Groceries', mood: '🛒', date: '2025-01-27T18:00:00' },
  { id: '4', amount: 350, categoryId: 'food', note: 'Dinner out', mood: '😌', date: '2025-01-27T20:00:00' },
  { id: '5', amount: 120, categoryId: 'entertainment', note: 'Streaming', mood: '😌', date: '2025-01-26T19:00:00' },
  { id: '6', amount: 2100, categoryId: 'bills', note: 'Rent', mood: null, date: '2025-01-25T00:00:00' },
  { id: '7', amount: 280, categoryId: 'food', note: 'Coffee & snacks', mood: '☕', date: '2025-01-25T14:00:00' },
  { id: '8', amount: 450, categoryId: 'health', note: 'Gym', mood: '😊', date: '2025-01-24T07:00:00' },
]

// Monthly summary (for dashboard card)
export const monthlySummary = {
  totalSpent: 4990,
  income: 85000,
  topCategory: { id: 'bills', label: 'Bills & Utilities', amount: 2100 },
  daysTracked: 4,
}

// Weekly story cards (narrative, not charts)
export const weeklyStories = [
  {
    id: 's1',
    title: 'Food was your biggest comfort this week',
    description: 'You spent more on meals and snacks than usual. Nothing wrong with that — food connects us.',
    icon: 'UtensilsCrossed',
    tone: 'warm',
  },
  {
    id: 's2',
    title: 'Evening spending increased after 8pm',
    description: 'Most of your non-essential spending happened in the evening. A small shift could add up over time.',
    icon: 'Moon',
    tone: 'gentle',
  },
  {
    id: 's3',
    title: 'You stayed consistent 4 days in a row',
    description: 'You logged expenses every day. That kind of consistency helps you see patterns without judgment.',
    icon: 'Target',
    tone: 'celebratory',
  },
]

// Insights & predictions (empathetic language)
export const insights = [
  {
    id: 'i1',
    type: 'trend',
    title: 'Spending trends',
    text: 'Your food spending has been steady. No surprises this week.',
    icon: 'TrendingUp',
  },
  {
    id: 'i2',
    type: 'prediction',
    title: 'Soft prediction',
    text: 'You might spend a bit more on food this week — maybe plan one extra home meal if you’d like to balance it.',
    icon: 'Sparkles',
  },
  {
    id: 'i3',
    type: 'suggestion',
    title: 'Gentle suggestion',
    text: 'Consider cooking 1 extra meal at home. No pressure — just an idea.',
    icon: 'ChefHat',
  },
]

// Spending personality (fun, shareable)
export const spendingPersonality = {
  type: 'Comfort Spender',
  description: 'You spend where it brings you comfort — good food, cozy moments, little treats. That’s not a flaw; it’s a pattern we can work with.',
  strengths: ['You know what you value', 'You’re consistent with big bills', 'You’re open to seeing patterns'],
  blindSpots: ['Evening impulse buys', 'Small daily spends adding up'],
  monthlyEvolution: 72, // 0–100 “evolved” score
}

// ——— Chart data (no backend) ———

// Category totals for pie chart (name, value, hex color) — popping kid-friendly
export const categorySpendTotals = [
  { name: 'Bills & Utilities', value: 2100, fill: '#2563eb' },
  { name: 'Food & Dining', value: 1050, fill: '#f97316' },
  { name: 'Shopping', value: 890, fill: '#eab308' },
  { name: 'Health', value: 450, fill: '#10b981' },
  { name: 'Transport', value: 180, fill: '#06b6d4' },
  { name: 'Entertainment', value: 120, fill: '#8b5cf6' },
  { name: 'Other', value: 200, fill: '#ec4899' },
]

// Whole year monthly spend for bar chart (last 12 months)
export const yearlyMonthlySpend = [
  { month: 'Feb', spent: 42000 },
  { month: 'Mar', spent: 38500 },
  { month: 'Apr', spent: 45200 },
  { month: 'May', spent: 39800 },
  { month: 'Jun', spent: 44100 },
  { month: 'Jul', spent: 46700 },
  { month: 'Aug', spent: 39100 },
  { month: 'Sep', spent: 42800 },
  { month: 'Oct', spent: 45500 },
  { month: 'Nov', spent: 41200 },
  { month: 'Dec', spent: 48900 },
  { month: 'Jan', spent: 4990 }, // current month partial
]

// Scatter: individual expenses for “which was greater” (x = index/order, y = amount, category for color)
export const scatterExpensePoints = [
  { x: 1, y: 420, name: 'Lunch', category: 'Food' },
  { x: 2, y: 180, name: 'Cab', category: 'Transport' },
  { x: 3, y: 890, name: 'Groceries', category: 'Shopping' },
  { x: 4, y: 350, name: 'Dinner', category: 'Food' },
  { x: 5, y: 120, name: 'Streaming', category: 'Entertainment' },
  { x: 6, y: 2100, name: 'Rent', category: 'Bills' },
  { x: 7, y: 280, name: 'Coffee', category: 'Food' },
  { x: 8, y: 450, name: 'Gym', category: 'Health' },
]

// ——— Savings goals (user can add, track, mark achieved) ———
export const initialSavingsGoals = [
  { id: 'sg1', item: 'New laptop', targetAmount: 50000, savedAmount: 32000, achieved: false },
  { id: 'sg2', item: 'Vacation fund', targetAmount: 25000, savedAmount: 25000, achieved: true },
  { id: 'sg3', item: 'Emergency fund', targetAmount: 100000, savedAmount: 15000, achieved: false },
]

// ——— Subscriptions ———
export const initialSubscriptions = [
  { id: 'sub1', name: 'Netflix', amount: 499, frequency: 'monthly', nextDue: '2025-02-05' },
  { id: 'sub2', name: 'Spotify', amount: 129, frequency: 'monthly', nextDue: '2025-02-12' },
  { id: 'sub3', name: 'Gym', amount: 1500, frequency: 'monthly', nextDue: '2025-02-01' },
]

// ——— Gamification: badges & rewards ———
export const initialBadges = [
  { id: 'b1', name: 'First save', icon: '🌟', earned: true, earnedAt: '2025-01-15' },
  { id: 'b2', name: 'Budget keeper', icon: '🎯', earned: true, earnedAt: '2025-01-20' },
  { id: 'b3', name: 'Super saver', icon: '🏆', earned: false },
  { id: 'b4', name: '7-day streak', icon: '🔥', earned: false },
  { id: 'b5', name: 'Goal crusher', icon: '⭐', earned: true, earnedAt: '2025-01-28' },
]

// User budget (for gamification: "staying in budget")
export const initialBudget = { monthly: 40000, streakDays: 5 }
