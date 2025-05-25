import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  // Global state using zustand
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser })

  // Conditionally return some JSX
  // is authentication status is being checked, show a loading screen
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Navbar />

      <Routes>
        {/* Routes meant only for logged in users */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* Signup/Login routes, only meant for users who are not logged in  */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
