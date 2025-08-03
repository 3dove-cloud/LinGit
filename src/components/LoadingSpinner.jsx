import React from 'react'
import { BookOpen, Terminal, Code, Zap } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Code className="w-4 h-4 text-white" />
          </div>
          <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Linux Mastery Academy
        </h1>
        <p className="text-gray-400 mb-8">
          Preparing your premium training environment...
        </p>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Initializing secure environment</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Loading course materials</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>Setting up virtual labs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner