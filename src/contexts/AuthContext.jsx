import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Simulated user database with encrypted access codes
const USERS_DB = {
  'LINUX2024PREMIUM': {
    id: 'user_001',
    email: 'student@example.com',
    name: 'Premium Student',
    accessLevel: 'premium',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
    enrollmentDate: new Date(),
    progress: {}
  },
  'LINUXMASTER2024': {
    id: 'user_002', 
    email: 'advanced@example.com',
    name: 'Advanced Student',
    accessLevel: 'premium',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    enrollmentDate: new Date(),
    progress: {}
  },
  'GITLINUX2024PRO': {
    id: 'user_003',
    email: 'pro@example.com', 
    name: 'Pro Student',
    accessLevel: 'premium',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    enrollmentDate: new Date(),
    progress: {}
  }
}

const SECRET_KEY = 'LinuxMasteryAcademy2024SecretKey'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = Cookies.get('lma_user')
    if (savedUser) {
      try {
        const decryptedUser = CryptoJS.AES.decrypt(savedUser, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        const userData = JSON.parse(decryptedUser)
        
        // Check if access hasn't expired
        if (new Date(userData.expiryDate) > new Date()) {
          setUser(userData)
        } else {
          Cookies.remove('lma_user')
        }
      } catch (error) {
        console.error('Error loading user session:', error)
        Cookies.remove('lma_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (accessCode, email) => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const userData = USERS_DB[accessCode.toUpperCase()]
    
    if (userData && new Date(userData.expiryDate) > new Date()) {
      // Update email if provided
      const userWithEmail = { ...userData, email: email || userData.email }
      
      // Encrypt and store user data
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userWithEmail), SECRET_KEY).toString()
      Cookies.set('lma_user', encryptedUser, { expires: 90, secure: true, sameSite: 'strict' })
      
      setUser(userWithEmail)
      setLoading(false)
      return { success: true }
    } else if (userData && new Date(userData.expiryDate) <= new Date()) {
      setLoading(false)
      return { success: false, error: 'Access code has expired. Please contact support.' }
    } else {
      setLoading(false)
      return { success: false, error: 'Invalid access code. Please check your code and try again.' }
    }
  }

  const logout = () => {
    Cookies.remove('lma_user')
    setUser(null)
  }

  const updateProgress = (sessionId, progress) => {
    if (user) {
      const updatedUser = {
        ...user,
        progress: {
          ...user.progress,
          [sessionId]: progress
        }
      }
      
      // Update encrypted cookie
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(updatedUser), SECRET_KEY).toString()
      Cookies.set('lma_user', encryptedUser, { expires: 90, secure: true, sameSite: 'strict' })
      
      setUser(updatedUser)
    }
  }

  const value = {
    user,
    login,
    logout,
    loading,
    updateProgress
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}