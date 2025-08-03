import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import SessionPage from './pages/SessionPage'
import LabPage from './pages/LabPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'

function AppContent() {
  const { user, loading } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading || !isInitialized) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/session/:sessionId" 
          element={user ? <SessionPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/lab/:sessionId/:labId" 
          element={user ? <LabPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </AuthProvider>
    </Router>
  )
}

export default App