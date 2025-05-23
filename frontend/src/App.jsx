import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'

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
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
