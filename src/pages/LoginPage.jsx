import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Lock, Mail, ArrowRight, Shield, Users, Award, Clock } from 'lucide-react'

const LoginPage = () => {
  const [accessCode, setAccessCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!accessCode.trim()) {
      setError('Please enter your access code')
      setIsLoading(false)
      return
    }

    const result = await login(accessCode, email)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const features = [
    {
      icon: BookOpen,
      title: '8 Comprehensive Sessions',
      description: 'From Linux basics to advanced system administration'
    },
    {
      icon: Shield,
      title: 'Hands-on Labs',
      description: 'Interactive terminal simulations and real-world scenarios'
    },
    {
      icon: Users,
      title: 'Expert Instruction',
      description: 'Learn from industry professionals with years of experience'
    },
    {
      icon: Award,
      title: 'Certificate Ready',
      description: 'Build skills that employers value in the tech industry'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Linux Mastery Academy</h1>
              <p className="text-sm text-gray-400">Premium Training Platform</p>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Master Linux & Git
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Like a Pro
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join our exclusive premium training program and transform from a beginner 
            to a confident Linux system administrator with hands-on labs and expert guidance.
          </p>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">8</div>
              <div className="text-xs text-gray-400">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">20+</div>
              <div className="text-xs text-gray-400">Labs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">90</div>
              <div className="text-xs text-gray-400">Days Access</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
              <p className="text-gray-400">Enter your premium access code to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Access Code *
                </label>
                <div className="relative">
                  <input
                    id="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="input pl-10"
                    placeholder="Enter your premium access code"
                    required
                  />
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="your.email@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full btn-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying Access...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Access Training Platform
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </form>

            {/* Demo Codes */}
            <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h4 className="text-sm font-semibold text-white mb-2">Demo Access Codes:</h4>
              <div className="space-y-1 text-xs text-gray-300 font-mono">
                <div>LINUX2024PREMIUM</div>
                <div>LINUXMASTER2024</div>
                <div>GITLINUX2024PRO</div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Use any of these codes to explore the platform
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>90-day premium access • Secure encrypted sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage