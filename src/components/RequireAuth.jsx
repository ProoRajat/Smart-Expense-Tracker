import { Navigate, Outlet } from 'react-router-dom'
import { isApiEnabled, getStoredToken } from '../api/client'

/**
 * When API is enabled, require a stored token; otherwise redirect to login.
 * When API is not enabled, allow through (demo mode).
 */
export default function RequireAuth() {
  if (isApiEnabled() && !getStoredToken()) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
