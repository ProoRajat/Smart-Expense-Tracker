/**
 * API client for Smart Expense Tracker backend.
 * Uses VITE_API_URL when set; all requests include Authorization when token is present.
 */

const BASE = import.meta.env.VITE_API_URL || ''

function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('expense_tracker_token') : null
}

function setToken(token) {
  if (typeof localStorage !== 'undefined') {
    if (token) localStorage.setItem('expense_tracker_token', token)
    else localStorage.removeItem('expense_tracker_token')
  }
}

export function isApiEnabled() {
  return !!BASE
}

export function getStoredToken() {
  return getToken()
}

export function clearToken() {
  setToken(null)
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  const data = res.ok ? await res.json().catch(() => ({})) : await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || data.error || `Request failed: ${res.status}`)
  return data
}

// ——— Auth ———
export async function apiLogin(email, password) {
  const { token, user } = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(token)
  return { token, user }
}

export async function apiSignup(email, password, name) {
  const { token, user } = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
  setToken(token)
  return { token, user }
}

export async function apiGetMe() {
  return request('/api/users/me')
}

export async function apiUpdateMe(body) {
  return request('/api/users/me', { method: 'PATCH', body: JSON.stringify(body) })
}

// ——— Expenses ———
export async function apiGetExpenses(params = {}) {
  const q = new URLSearchParams(params).toString()
  return request(`/api/expenses${q ? `?${q}` : ''}`)
}

export async function apiAddExpense(body) {
  return request('/api/expenses', { method: 'POST', body: JSON.stringify(body) })
}

export async function apiUpdateExpense(id, body) {
  return request(`/api/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

export async function apiDeleteExpense(id) {
  await request(`/api/expenses/${id}`, { method: 'DELETE' })
}

// ——— Savings goals ———
export async function apiGetSavingsGoals() {
  return request('/api/savings-goals')
}

export async function apiAddSavingsGoal(body) {
  return request('/api/savings-goals', { method: 'POST', body: JSON.stringify(body) })
}

export async function apiUpdateSavingsGoal(id, body) {
  return request(`/api/savings-goals/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

export async function apiDeleteSavingsGoal(id) {
  await request(`/api/savings-goals/${id}`, { method: 'DELETE' })
}

// ——— Subscriptions ———
export async function apiGetSubscriptions() {
  return request('/api/subscriptions')
}

export async function apiAddSubscription(body) {
  return request('/api/subscriptions', { method: 'POST', body: JSON.stringify(body) })
}

export async function apiUpdateSubscription(id, body) {
  return request(`/api/subscriptions/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

export async function apiDeleteSubscription(id) {
  await request(`/api/subscriptions/${id}`, { method: 'DELETE' })
}

// ——— Summary ———
export async function apiGetMonthlySummary(month, year) {
  const q = new URLSearchParams({ month, year }).toString()
  return request(`/api/summary/monthly?${q}`)
}

export async function apiGetYearlySummary(year) {
  return request(`/api/summary/yearly?year=${year || new Date().getFullYear()}`)
}

// ——— Badges ———
export async function apiGetBadges() {
  return request('/api/badges')
}

export async function apiEarnBadge(id) {
  return request(`/api/badges/${id}/earn`, { method: 'POST' })
}

// ——— Budget ———
export async function apiGetBudget() {
  return request('/api/budget')
}

export async function apiUpdateBudget(body) {
  return request('/api/budget', { method: 'PATCH', body: JSON.stringify(body) })
}

// ——— Config (no auth) ———
export async function apiGetCategories() {
  return request('/api/config/categories')
}

export async function apiGetMoods() {
  return request('/api/config/moods')
}
