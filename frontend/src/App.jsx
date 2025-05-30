import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

const App = () => {
  // Global state using zustand
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  console.log({ onlineUsers })

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Conditionally return some JSX
  // is authentication status is being checked, show a loading screen
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        {/* Routes meant only for logged in users */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* Signup/Login routes, only meant for users who are not logged in  */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        {/* Options - both logged in and logged out users can access */}
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
