import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ProgressContext = createContext()

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export const ProgressProvider = ({ children }) => {
  const { user, updateProgress } = useAuth()
  const [sessionProgress, setSessionProgress] = useState({})

  useEffect(() => {
    if (user?.progress) {
      setSessionProgress(user.progress)
    }
  }, [user])

  const markSessionComplete = (sessionId) => {
    const newProgress = {
      ...sessionProgress,
      [sessionId]: {
        ...sessionProgress[sessionId],
        completed: true,
        completedAt: new Date().toISOString()
      }
    }
    setSessionProgress(newProgress)
    updateProgress(sessionId, newProgress[sessionId])
  }

  const markLabComplete = (sessionId, labId) => {
    const sessionData = sessionProgress[sessionId] || { labs: {} }
    const newProgress = {
      ...sessionProgress,
      [sessionId]: {
        ...sessionData,
        labs: {
          ...sessionData.labs,
          [labId]: {
            completed: true,
            completedAt: new Date().toISOString()
          }
        }
      }
    }
    setSessionProgress(newProgress)
    updateProgress(sessionId, newProgress[sessionId])
  }

  const updateSessionTime = (sessionId, timeSpent) => {
    const sessionData = sessionProgress[sessionId] || {}
    const newProgress = {
      ...sessionProgress,
      [sessionId]: {
        ...sessionData,
        timeSpent: (sessionData.timeSpent || 0) + timeSpent,
        lastAccessed: new Date().toISOString()
      }
    }
    setSessionProgress(newProgress)
    updateProgress(sessionId, newProgress[sessionId])
  }

  const getSessionProgress = (sessionId) => {
    return sessionProgress[sessionId] || {}
  }

  const getOverallProgress = () => {
    const totalSessions = 8 // Based on your 8 sessions
    const completedSessions = Object.values(sessionProgress).filter(s => s.completed).length
    return Math.round((completedSessions / totalSessions) * 100)
  }

  const value = {
    sessionProgress,
    markSessionComplete,
    markLabComplete,
    updateSessionTime,
    getSessionProgress,
    getOverallProgress
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}