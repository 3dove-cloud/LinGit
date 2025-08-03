import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Clock, 
  TrendingUp,
  BookOpen,
  Target,
  Shield,
  Settings,
  Download,
  Share2,
  Trophy,
  Star,
  CheckCircle
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const { sessionProgress, getOverallProgress } = useProgress()
  const [activeTab, setActiveTab] = useState('overview')

  const overallProgress = getOverallProgress()
  const completedSessions = Object.values(sessionProgress).filter(s => s.completed).length
  const totalTimeSpent = Object.values(sessionProgress).reduce((total, session) => total + (session.timeSpent || 0), 0)
  const daysRemaining = differenceInDays(new Date(user?.expiryDate), new Date())
  const enrollmentDays = differenceInDays(new Date(), new Date(user?.enrollmentDate))

  const achievements = [
    {
      id: 'first-session',
      title: 'First Steps',
      description: 'Completed your first session',
      icon: BookOpen,
      earned: completedSessions >= 1,
      color: 'text-blue-400'
    },
    {
      id: 'week-one',
      title: 'Week One Warrior',
      description: 'Completed all Week 1 sessions',
      icon: Trophy,
      earned: completedSessions >= 4,
      color: 'text-yellow-400'
    },
    {
      id: 'halfway',
      title: 'Halfway Hero',
      description: 'Reached 50% completion',
      icon: Target,
      earned: overallProgress >= 50,
      color: 'text-green-400'
    },
    {
      id: 'time-invested',
      title: 'Dedicated Learner',
      description: 'Spent over 5 hours learning',
      icon: Clock,
      earned: totalTimeSpent >= 300, // 5 hours in minutes
      color: 'text-purple-400'
    },
    {
      id: 'linux-master',
      title: 'Linux Master',
      description: 'Completed all sessions',
      icon: Award,
      earned: completedSessions >= 8,
      color: 'text-red-400'
    }
  ]

  const earnedAchievements = achievements.filter(a => a.earned)
  const nextAchievement = achievements.find(a => !a.earned)

  const sessionStats = [
    {
      id: 'week1-session1',
      title: 'Linux Introduction & Setup',
      completed: sessionProgress['week1-session1']?.completed || false,
      timeSpent: sessionProgress['week1-session1']?.timeSpent || 0,
      completedAt: sessionProgress['week1-session1']?.completedAt
    },
    {
      id: 'week1-session2', 
      title: 'Command Line Essentials',
      completed: sessionProgress['week1-session2']?.completed || false,
      timeSpent: sessionProgress['week1-session2']?.timeSpent || 0,
      completedAt: sessionProgress['week1-session2']?.completedAt
    },
    {
      id: 'week1-session3',
      title: 'System Monitoring & Process Management',
      completed: sessionProgress['week1-session3']?.completed || false,
      timeSpent: sessionProgress['week1-session3']?.timeSpent || 0,
      completedAt: sessionProgress['week1-session3']?.completedAt
    },
    {
      id: 'week1-session4',
      title: 'File Operations & Text Processing',
      completed: sessionProgress['week1-session4']?.completed || false,
      timeSpent: sessionProgress['week1-session4']?.timeSpent || 0,
      completedAt: sessionProgress['week1-session4']?.completedAt
    },
    {
      id: 'week2-session1',
      title: 'Users & Permissions',
      completed: sessionProgress['week2-session1']?.completed || false,
      timeSpent: sessionProgress['week2-session1']?.timeSpent || 0,
      completedAt: sessionProgress['week2-session1']?.completedAt
    },
    {
      id: 'week2-session2',
      title: 'Package Management',
      completed: sessionProgress['week2-session2']?.completed || false,
      timeSpent: sessionProgress['week2-session2']?.timeSpent || 0,
      completedAt: sessionProgress['week2-session2']?.completedAt
    },
    {
      id: 'week2-session3',
      title: 'System Services & Networking',
      completed: sessionProgress['week2-session3']?.completed || false,
      timeSpent: sessionProgress['week2-session3']?.timeSpent || 0,
      completedAt: sessionProgress['week2-session3']?.completedAt
    },
    {
      id: 'week2-session4',
      title: 'System Monitoring & Environment Basics',
      completed: sessionProgress['week2-session4']?.completed || false,
      timeSpent: sessionProgress['week2-session4']?.timeSpent || 0,
      completedAt: sessionProgress['week2-session4']?.completedAt
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-6">
      <div className="container mx-auto px-4 pb-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{overallProgress}%</div>
                  <div className="text-xs text-gray-400">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{completedSessions}</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{Math.round(totalTimeSpent / 60)}h</div>
                  <div className="text-xs text-gray-400">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{daysRemaining}</div>
                  <div className="text-xs text-gray-400">Days Left</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>{user?.accessLevel} Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Enrolled {enrollmentDays} days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learning Progress */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Learning Progress
                </h2>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Overall Progress</span>
                    <span className="text-white font-semibold">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-white">Sessions Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{completedSessions}/8</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-white">Time Invested</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{Math.round(totalTimeSpent / 60)}h {totalTimeSpent % 60}m</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                <div className="space-y-3">
                  {sessionStats
                    .filter(s => s.completedAt)
                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                    .slice(0, 5)
                    .map((session) => (
                      <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                          <p className="font-medium text-white">{session.title}</p>
                          <p className="text-sm text-gray-400">
                            Completed {format(new Date(session.completedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          {Math.round(session.timeSpent / 60)}min
                        </div>
                      </div>
                    ))}
                  {sessionStats.filter(s => s.completedAt).length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      No completed sessions yet. Start your first session to see activity here!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Achievement */}
              {nextAchievement && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Next Achievement
                  </h3>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <nextAchievement.icon className={`w-8 h-8 ${nextAchievement.color}`} />
                    </div>
                    <h4 className="font-medium text-white mb-1">{nextAchievement.title}</h4>
                    <p className="text-sm text-gray-400">{nextAchievement.description}</p>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Account Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Access Level</span>
                    <span className="text-white capitalize">{user?.accessLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Enrolled</span>
                    <span className="text-white">
                      {format(new Date(user?.enrollmentDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Expires</span>
                    <span className="text-white">
                      {format(new Date(user?.expiryDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Days Remaining</span>
                    <span className={`font-semibold ${daysRemaining < 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {daysRemaining} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-secondary w-full btn-sm">
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </button>
                  <button className="btn btn-secondary w-full btn-sm">
                    <Share2 className="w-4 h-4" />
                    Share Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Detailed Progress</h2>
            <div className="space-y-4">
              {sessionStats.map((session, index) => (
                <div key={session.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {session.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                      )}
                      <h3 className="font-medium text-white">
                        Session {index + 1}: {session.title}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round(session.timeSpent / 60)}min spent
                    </div>
                  </div>
                  {session.completed && session.completedAt && (
                    <p className="text-sm text-gray-400 ml-8">
                      Completed on {format(new Date(session.completedAt), 'MMMM d, yyyy')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border text-center transition-all ${
                    achievement.earned
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-800/50 border-gray-700 opacity-50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    achievement.earned ? 'bg-gray-600' : 'bg-gray-700'
                  }`}>
                    <achievement.icon className={`w-8 h-8 ${
                      achievement.earned ? achievement.color : 'text-gray-500'
                    }`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    achievement.earned ? 'text-white' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        <Star className="w-3 h-3" />
                        Earned
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-white mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="input"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="input"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="font-medium text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive updates about your progress</p>
                    </div>
                    <button className="btn btn-secondary btn-sm">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Dark Mode</p>
                      <p className="text-sm text-gray-400">Currently enabled</p>
                    </div>
                    <button className="btn btn-secondary btn-sm">
                      Toggle
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="font-medium text-white mb-4">Account Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-secondary w-full">
                    <Download className="w-4 h-4" />
                    Export Progress Data
                  </button>
                  <button 
                    onClick={logout}
                    className="btn btn-secondary w-full text-red-400 hover:bg-red-500/20"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage