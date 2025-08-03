import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Play, 
  BookOpen, 
  Terminal,
  Award,
  ChevronRight,
  Target,
  Lightbulb
} from 'lucide-react'

const SessionPage = () => {
  const { sessionId } = useParams()
  const { markSessionComplete, updateSessionTime, getSessionProgress } = useProgress()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [startTime] = useState(Date.now())
  const [isCompleted, setIsCompleted] = useState(false)

  const sessionProgress = getSessionProgress(sessionId)

  useEffect(() => {
    loadSessionContent()
    setIsCompleted(sessionProgress.completed || false)
    
    // Track time spent
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      updateSessionTime(sessionId, 1) // Update every second
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [sessionId])

  const loadSessionContent = async () => {
    try {
      // Import the markdown content based on sessionId
      const contentMap = {
        'week1-session1': () => import('../../week1-session1.md?raw'),
        'week1-session2': () => import('../../week1-session2.md?raw'),
        'week1-session3': () => import('../../week1-session3.md?raw'),
        'week1-session4': () => import('../../week1-session4.md?raw'),
        'week2-session1': () => import('../../week2-session1.md?raw'),
        'week2-session2': () => import('../../week2-session2.md?raw'),
        'week2-session3': () => import('../../week2-session3.md?raw'),
        'week2-session4': () => import('../../week2-session4.md?raw')
      }

      if (contentMap[sessionId]) {
        const module = await contentMap[sessionId]()
        setContent(module.default)
      } else {
        setContent('# Session Not Found\n\nThe requested session could not be loaded.')
      }
    } catch (error) {
      console.error('Error loading session content:', error)
      setContent('# Error Loading Session\n\nThere was an error loading the session content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSession = () => {
    markSessionComplete(sessionId)
    setIsCompleted(true)
  }

  const getSessionInfo = (sessionId) => {
    const sessionMap = {
      'week1-session1': {
        title: 'Linux Introduction & Setup',
        subtitle: 'Building Your Digital Workshop Foundation',
        week: 1,
        session: 1,
        duration: '2 hours',
        difficulty: 'Beginner',
        labs: ['basic-navigation', 'command-history', 'file-system-exploration']
      },
      'week1-session2': {
        title: 'Command Line Essentials',
        subtitle: 'Mastering Your Workshop Tools',
        week: 1,
        session: 2,
        duration: '2 hours',
        difficulty: 'Beginner',
        labs: ['advanced-navigation', 'io-redirection', 'environment-setup']
      },
      'week1-session3': {
        title: 'System Monitoring & Process Management',
        subtitle: 'Becoming the Digital Workshop Supervisor',
        week: 1,
        session: 3,
        duration: '2 hours',
        difficulty: 'Intermediate',
        labs: ['process-monitoring', 'job-control', 'system-analysis']
      },
      'week1-session4': {
        title: 'File Operations & Text Processing',
        subtitle: 'Mastering the Workshop Information Systems',
        week: 1,
        session: 4,
        duration: '2 hours',
        difficulty: 'Intermediate',
        labs: ['file-permissions', 'text-processing', 'archive-management']
      },
      'week2-session1': {
        title: 'Users & Permissions',
        subtitle: 'Building Your Workshop Team & System Control',
        week: 2,
        session: 1,
        duration: '2 hours',
        difficulty: 'Intermediate',
        labs: ['user-management', 'permission-setup', 'security-basics']
      },
      'week2-session2': {
        title: 'Package Management',
        subtitle: 'Managing the Workshop Supply Chain',
        week: 2,
        session: 2,
        duration: '2 hours',
        difficulty: 'Intermediate',
        labs: ['package-installation', 'dependency-management', 'system-updates']
      },
      'week2-session3': {
        title: 'System Services & Networking',
        subtitle: 'Workshop Operations & External Connections',
        week: 2,
        session: 3,
        duration: '2 hours',
        difficulty: 'Advanced',
        labs: ['service-management', 'network-configuration', 'ssh-setup']
      },
      'week2-session4': {
        title: 'System Monitoring & Environment Basics',
        subtitle: 'The Digital Watchkeeper\'s Essential Tools',
        week: 2,
        session: 4,
        duration: '2 hours',
        difficulty: 'Advanced',
        labs: ['system-monitoring', 'environment-variables', 'troubleshooting']
      }
    }
    return sessionMap[sessionId] || {}
  }

  const sessionInfo = getSessionInfo(sessionId)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'Advanced': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading session content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Week {sessionInfo.week}, Session {sessionInfo.session}: {sessionInfo.title}
                </h1>
                <p className="text-sm text-gray-400">{sessionInfo.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{sessionInfo.duration}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(sessionInfo.difficulty)}`}>
                {sessionInfo.difficulty}
              </span>
              {!isCompleted && (
                <button
                  onClick={handleCompleteSession}
                  className="btn btn-success btn-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Session Progress */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Session Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className={isCompleted ? 'text-green-400' : 'text-yellow-400'}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Time Spent</span>
                    <span className="text-white">
                      {Math.round((sessionProgress.timeSpent || 0) / 60)}min
                    </span>
                  </div>
                  {sessionProgress.completedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Completed</span>
                      <span className="text-white">
                        {new Date(sessionProgress.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hands-on Labs */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Hands-on Labs
                </h3>
                <div className="space-y-2">
                  {sessionInfo.labs?.map((labId, index) => {
                    const labCompleted = sessionProgress.labs?.[labId]?.completed
                    return (
                      <Link
                        key={labId}
                        to={`/lab/${sessionId}/${labId}`}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          {labCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                          )}
                          <span className="text-sm text-white">
                            Lab {index + 1}: {labId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Study Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Practice commands in the interactive labs</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Take notes of important concepts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Complete all hands-on exercises</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Review previous sessions regularly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="prose prose-invert prose-blue max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-gray-700">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-white mt-8 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-semibold text-white mt-4 mb-2">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-300">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-500/10 rounded-r-lg mb-4">
                        <div className="text-blue-200 italic">
                          {children}
                        </div>
                      </blockquote>
                    ),
                    code: ({ inline, children }) => {
                      if (inline) {
                        return (
                          <code className="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code className="block bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-700 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="bg-gray-700 text-white px-4 py-2 text-left border-b border-gray-600">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="text-gray-300 px-4 py-2 border-b border-gray-700">
                        {children}
                      </td>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-blue-300 italic">
                        {children}
                      </em>
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Session Actions */}
            <div className="mt-8 flex items-center justify-between">
              <Link
                to="/dashboard"
                className="btn btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              
              <div className="flex items-center gap-4">
                {sessionInfo.labs && sessionInfo.labs.length > 0 && (
                  <Link
                    to={`/lab/${sessionId}/${sessionInfo.labs[0]}`}
                    className="btn btn-primary"
                  >
                    <Terminal className="w-4 h-4" />
                    Start Labs
                  </Link>
                )}
                
                {!isCompleted && (
                  <button
                    onClick={handleCompleteSession}
                    className="btn btn-success"
                  >
                    <Award className="w-4 h-4" />
                    Complete Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionPage