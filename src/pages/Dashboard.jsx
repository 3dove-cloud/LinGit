import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Users,
  Terminal,
  GitBranch
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

const Dashboard = () => {
  const { user } = useAuth()
  const { sessionProgress, getOverallProgress } = useProgress()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const sessions = [
    {
      id: 'week1-session1',
      title: 'Linux Introduction & Setup',
      subtitle: 'Building Your Digital Workshop Foundation',
      duration: '2 hours',
      difficulty: 'Beginner',
      topics: ['Linux Fundamentals', 'Terminal Navigation', 'Command History', 'Basic Troubleshooting'],
      week: 1,
      session: 1
    },
    {
      id: 'week1-session2',
      title: 'Command Line Essentials',
      subtitle: 'Mastering Your Workshop Tools',
      duration: '2 hours',
      difficulty: 'Beginner',
      topics: ['Advanced Navigation', 'I/O Redirection', 'PATH Management', 'Environment Variables'],
      week: 1,
      session: 2
    },
    {
      id: 'week1-session3',
      title: 'System Monitoring & Process Management',
      subtitle: 'Becoming the Digital Workshop Supervisor',
      duration: '2 hours',
      difficulty: 'Intermediate',
      topics: ['System Monitoring', 'Process Control', 'Job Management', 'Resource Analysis'],
      week: 1,
      session: 3
    },
    {
      id: 'week1-session4',
      title: 'File Operations & Text Processing',
      subtitle: 'Mastering the Workshop Information Systems',
      duration: '2 hours',
      difficulty: 'Intermediate',
      topics: ['File Permissions', 'Text Processing', 'Archives', 'Data Pipelines'],
      week: 1,
      session: 4
    },
    {
      id: 'week2-session1',
      title: 'Users & Permissions',
      subtitle: 'Building Your Workshop Team & System Control',
      duration: '2 hours',
      difficulty: 'Intermediate',
      topics: ['User Management', 'Group Management', 'Security', 'Environment Setup'],
      week: 2,
      session: 1
    },
    {
      id: 'week2-session2',
      title: 'Package Management',
      subtitle: 'Managing the Workshop Supply Chain',
      duration: '2 hours',
      difficulty: 'Intermediate',
      topics: ['APT Management', 'Software Installation', 'Dependencies', 'System Updates'],
      week: 2,
      session: 2
    },
    {
      id: 'week2-session3',
      title: 'System Services & Networking',
      subtitle: 'Workshop Operations & External Connections',
      duration: '2 hours',
      difficulty: 'Advanced',
      topics: ['Systemd Services', 'Network Configuration', 'SSH', 'Firewall Management'],
      week: 2,
      session: 3
    },
    {
      id: 'week2-session4',
      title: 'System Monitoring & Environment Basics',
      subtitle: 'The Digital Watchkeeper\'s Essential Tools',
      duration: '2 hours',
      difficulty: 'Advanced',
      topics: ['System Health', 'Environment Variables', 'Job Control', 'Troubleshooting'],
      week: 2,
      session: 4
    }
  ]

  const overallProgress = getOverallProgress()
  const completedSessions = Object.values(sessionProgress).filter(s => s.completed).length
  const daysRemaining = differenceInDays(new Date(user?.expiryDate), new Date())
  const totalTimeSpent = Object.values(sessionProgress).reduce((total, session) => total + (session.timeSpent || 0), 0)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'Advanced': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getSessionStatus = (sessionId) => {
    const progress = sessionProgress[sessionId]
    if (progress?.completed) return 'completed'
    if (progress?.lastAccessed) return 'in-progress'
    return 'not-started'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'in-progress': return <Play className="w-5 h-5 text-yellow-400" />
      default: return <BookOpen className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-6">
      <div className="container mx-auto px-4 pb-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-400">
                Continue your Linux mastery journey • {format(currentTime, 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Access expires in</p>
                <p className="text-lg font-semibold text-white">{daysRemaining} days</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{overallProgress}%</p>
                <p className="text-sm text-gray-400">Overall Progress</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completedSessions}/8</p>
                <p className="text-sm text-gray-400">Sessions Complete</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{Math.round(totalTimeSpent / 60)}h</p>
                <p className="text-sm text-gray-400">Time Invested</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{daysRemaining}</p>
                <p className="text-sm text-gray-400">Days Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Learning Progress</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4" />
              <span>Keep up the momentum!</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Started your Linux journey</span>
            <span>{overallProgress}% Complete</span>
            <span>Linux Master 🎯</span>
          </div>
        </div>

        {/* Course Sessions */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Course Sessions</h2>
          </div>

          {/* Week 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Week 1: Linux Fundamentals</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Terminal className="w-4 h-4" />
                <span>Foundation Building</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.filter(s => s.week === 1).map((session) => {
                const status = getSessionStatus(session.id)
                const progress = sessionProgress[session.id]
                
                return (
                  <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    className="card hover:border-gray-600 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            Session {session.session}: {session.title}
                          </h4>
                          <p className="text-sm text-gray-400">{session.subtitle}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                      {progress?.timeSpent && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.round(progress.timeSpent / 60)}min spent</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {session.topics.slice(0, 3).map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                      {session.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                          +{session.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Week 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Week 2: System Administration</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <GitBranch className="w-4 h-4" />
                <span>Advanced Concepts</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.filter(s => s.week === 2).map((session) => {
                const status = getSessionStatus(session.id)
                const progress = sessionProgress[session.id]
                
                return (
                  <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    className="card hover:border-gray-600 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            Session {session.session}: {session.title}
                          </h4>
                          <p className="text-sm text-gray-400">{session.subtitle}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                      {progress?.timeSpent && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.round(progress.timeSpent / 60)}min spent</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {session.topics.slice(0, 3).map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                      {session.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                          +{session.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium text-white">View Profile</p>
                <p className="text-sm text-gray-400">Check your progress & settings</p>
              </div>
            </Link>
            
            <button className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium text-white">Schedule Study</p>
                <p className="text-sm text-gray-400">Plan your learning sessions</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium text-white">Achievements</p>
                <p className="text-sm text-gray-400">View your milestones</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard