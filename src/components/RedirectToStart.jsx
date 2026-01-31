import { Navigate } from 'react-router-dom'
import { isApiEnabled, getStoredToken } from '../api/client'

/**
 * "/" redirects to login (when API enabled and no token) or dashboard.
 */
export default function RedirectToStart() {
  if (isApiEnabled() && !getStoredToken()) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to="/dashboard" replace />
}
