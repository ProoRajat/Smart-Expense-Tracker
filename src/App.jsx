import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import RedirectToStart from './components/RedirectToStart'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import InsightsAndStory from './pages/InsightsAndStory'
import Savings from './pages/Savings'
import Subscriptions from './pages/Subscriptions'
import Personality from './pages/Personality'
import Settings from './pages/Settings'

// When API is enabled (VITE_API_URL set), "/" and app routes require sign-in so data persists.
// When API is not set, app works with mock data and no login.
function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<RedirectToStart />} />
        <Route path="/welcome" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<InsightsAndStory />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/personality" element={<Personality />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<RedirectToStart />} />
      </Routes>
    </AppProvider>
  )
}

export default App
