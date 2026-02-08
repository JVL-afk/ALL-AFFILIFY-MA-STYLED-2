'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  Settings, 
  MessageSquare, 
  Calendar, 
  FileText, 
  UserPlus, 
  Crown, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Star,
  ChevronRight,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  avatar: string
  status: 'active' | 'pending' | 'inactive'
  lastActive: Date
  joinedDate: Date
  permissions: string[]
  tasksCompleted?: number
  projectsActive?: number
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  assignedTo: string[]
  dueDate: Date
  createdDate: Date
  priority?: 'low' | 'medium' | 'high'
}

interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: Date
  type: 'create' | 'edit' | 'delete' | 'comment' | 'assign'
}

export default function TeamCollaborationPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeTab, setActiveTab] = useState<'members' | 'projects' | 'activity' | 'permissions'>('members')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'owner' | 'admin' | 'editor' | 'viewer'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/team/data')
      if (response.ok) {
        const result = await response.json()
        setTeamMembers(result.data.members || [])
        setProjects(result.data.projects || [])
        setActivities(result.data.activities || [])
      } else {
        // If API fails, set empty arrays
        setTeamMembers([])
        setProjects([])
        setActivities([])
      }
    } catch (error) {
      console.error('Error loading team data:', error)
      setTeamMembers([])
      setProjects([])
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const loadTeamDataOld = () => {
    const mockMembers: TeamMember[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@affilify.eu',
        role: 'owner',
        avatar: '/avatars/john.jpg',
        status: 'active',
        lastActive: new Date(),
        joinedDate: new Date(Date.now() - 86400000 * 30),
        permissions: ['all'],
        tasksCompleted: 145,
        projectsActive: 5
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@affilify.eu',
        role: 'admin',
        avatar: '/avatars/sarah.jpg',
        status: 'active',
        lastActive: new Date(Date.now() - 3600000),
        joinedDate: new Date(Date.now() - 86400000 * 15),
        permissions: ['manage_websites', 'manage_analytics', 'manage_team'],
        tasksCompleted: 89,
        projectsActive: 3
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@affilify.eu',
        role: 'editor',
        avatar: '/avatars/mike.jpg',
        status: 'active',
        lastActive: new Date(Date.now() - 7200000),
        joinedDate: new Date(Date.now() - 86400000 * 7),
        permissions: ['create_websites', 'edit_content', 'view_analytics'],
        tasksCompleted: 56,
        projectsActive: 2
      },
      {
        id: '4',
        name: 'Emma Davis',
        email: 'emma@affilify.eu',
        role: 'viewer',
        avatar: '/avatars/emma.jpg',
        status: 'pending',
        lastActive: new Date(Date.now() - 86400000),
        joinedDate: new Date(Date.now() - 86400000 * 2),
        permissions: ['view_websites', 'view_analytics'],
        tasksCompleted: 12,
        projectsActive: 1
      },
    ]

    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Q1 Website Optimization',
        description: 'Optimize conversion rates for top-performing affiliate sites',
        status: 'active',
        progress: 65,
        assignedTo: ['2', '3'],
        dueDate: new Date(Date.now() + 86400000 * 14),
        createdDate: new Date(Date.now() - 86400000 * 10),
        priority: 'high'
      },
      {
        id: '2',
        name: 'New Product Launch Campaign',
        description: 'Create affiliate sites for upcoming product launches',
        status: 'active',
        progress: 30,
        assignedTo: ['1', '2', '3'],
        dueDate: new Date(Date.now() + 86400000 * 21),
        createdDate: new Date(Date.now() - 86400000 * 5),
        priority: 'medium'
      },
      {
        id: '3',
        name: 'Analytics Dashboard Redesign',
        description: 'Improve user experience for analytics dashboard',
        status: 'completed',
        progress: 100,
        assignedTo: ['2'],
        dueDate: new Date(Date.now() - 86400000 * 3),
        createdDate: new Date(Date.now() - 86400000 * 20),
        priority: 'low'
      },
    ]

    const mockActivities: Activity[] = [
      {
        id: '1',
        user: 'Sarah Wilson',
        action: 'created',
        target: 'Tech Gadgets Website',
        timestamp: new Date(Date.now() - 3600000),
        type: 'create',
      },
      {
        id: '2',
        user: 'Mike Johnson',
        action: 'updated',
        target: 'Q1 Website Optimization',
        timestamp: new Date(Date.now() - 7200000),
        type: 'edit',
      },
      {
        id: '3',
        user: 'John Doe',
        action: 'assigned',
        target: 'New Product Launch Campaign to Sarah Wilson',
        timestamp: new Date(Date.now() - 10800000),
        type: 'assign',
      },
      {
        id: '4',
        user: 'Sarah Wilson',
        action: 'commented on',
        target: 'Analytics Dashboard Redesign',
        timestamp: new Date(Date.now() - 14400000),
        type: 'comment',
      },
    ]

    setTeamMembers(mockMembers)
    setProjects(mockProjects)
    setActivities(mockActivities)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'editor':
        return <Edit className="h-4 w-4" />
      case 'viewer':
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'from-yellow-500 to-orange-600'
      case 'admin':
        return 'from-indigo-500 to-blue-600'
      case 'editor':
        return 'from-green-500 to-emerald-600'
      case 'viewer':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-600'
      case 'pending':
        return 'from-orange-500 to-yellow-600'
      case 'inactive':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-blue-500 to-indigo-600'
      case 'completed':
        return 'from-green-500 to-emerald-600'
      case 'on-hold':
        return 'from-orange-500 to-yellow-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-orange-600'
      case 'medium':
        return 'from-yellow-500 to-orange-600'
      case 'low':
        return 'from-blue-500 to-cyan-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Plus className="h-4 w-4" />
      case 'edit':
        return <Edit className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'comment':
        return <MessageSquare className="h-4 w-4" />
      case 'assign':
        return <UserPlus className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterRole === 'all' || member.role === filterRole
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400">
                    Team Collaboration
                  </h1>
                  <p className="text-indigo-200/70 text-sm">Manage your team and collaborate on projects</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Total Members</CardTitle>
              <Users className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{teamMembers.length}</div>
              <p className="text-xs text-indigo-300/60 mt-1">
                {teamMembers.filter(m => m.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'active').length}</div>
              <p className="text-xs text-blue-300/60 mt-1">
                {projects.length} total projects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {teamMembers.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0)}
              </div>
              <p className="text-xs text-indigo-300/60 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-400" />
                +12% this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Team Activity</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activities.length}</div>
              <p className="text-xs text-blue-300/60 mt-1">
                Recent actions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm flex items-center justify-between"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-200">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm flex items-center justify-between"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-200">{success}</span>
              </div>
              <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30">
            <CardContent className="p-2">
              <nav className="flex space-x-2">
                {[
                  { id: 'members', label: 'Team Members', icon: Users },
                  { id: 'projects', label: 'Projects', icon: FileText },
                  { id: 'activity', label: 'Activity', icon: Activity },
                  { id: 'permissions', label: 'Permissions', icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                        : 'text-indigo-300 hover:bg-indigo-500/20'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-indigo-500/30 text-white placeholder:text-indigo-300/50 h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRole === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('all')}
                  className={filterRole === 'all' ? 'bg-indigo-500 hover:bg-indigo-600' : 'border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20'}
                >
                  All
                </Button>
                <Button
                  variant={filterRole === 'owner' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('owner')}
                  className={filterRole === 'owner' ? 'bg-yellow-500 hover:bg-yellow-600' : 'border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20'}
                >
                  Owner
                </Button>
                <Button
                  variant={filterRole === 'admin' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('admin')}
                  className={filterRole === 'admin' ? 'bg-blue-500 hover:bg-blue-600' : 'border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20'}
                >
                  Admin
                </Button>
              </div>
            </motion.div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30 hover:border-blue-500/50 transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(member.role)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{member.name}</h3>
                            <p className="text-sm text-indigo-200/70">{member.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(member.role)} text-white flex items-center space-x-1`}>
                          {getRoleIcon(member.role)}
                          <span>{member.role}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(member.status)} text-white`}>
                          {member.status}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-indigo-200/70">Tasks Completed</span>
                          <span className="text-white font-semibold">{member.tasksCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-indigo-200/70">Active Projects</span>
                          <span className="text-white font-semibold">{member.projectsActive}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-indigo-200/70">Last Active</span>
                          <span className="text-white font-semibold text-xs">
                            {Math.floor((Date.now() - member.lastActive.getTime()) / 3600000)}h ago
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20">
                          <Mail className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white text-lg">{project.name}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getProjectStatusColor(project.status)} text-white`}>
                            {project.status}
                          </div>
                          {project.priority && (
                            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                              {project.priority} priority
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-indigo-200/70">{project.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-indigo-200/70">Progress</span>
                          <span className="text-sm text-white font-semibold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-indigo-400" />
                          <span className="text-indigo-200/70">Due:</span>
                          <span className="text-white font-semibold">{project.dueDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-indigo-400" />
                          <span className="text-indigo-200/70">Team:</span>
                          <span className="text-white font-semibold">{project.assignedTo.length} members</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-indigo-200/60">Latest team actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${
                        activity.type === 'create' ? 'from-green-500 to-emerald-600' :
                        activity.type === 'edit' ? 'from-blue-500 to-indigo-600' :
                        activity.type === 'delete' ? 'from-red-500 to-orange-600' :
                        activity.type === 'comment' ? 'from-purple-500 to-pink-600' :
                        'from-orange-500 to-yellow-600'
                      } rounded-lg flex items-center justify-center flex-shrink-0 text-white`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          <span className="text-indigo-300">{activity.user}</span> {activity.action} <span className="text-blue-300">{activity.target}</span>
                        </div>
                        <div className="text-xs text-indigo-200/70 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.floor((Date.now() - activity.timestamp.getTime()) / 3600000)}h ago
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <span>Role Permissions</span>
                </CardTitle>
                <CardDescription className="text-indigo-200/60">Manage what each role can do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['owner', 'admin', 'editor', 'viewer'].map((role, index) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 bg-gradient-to-r ${getRoleColor(role)} bg-opacity-10 rounded-lg border border-indigo-500/30`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(role)} rounded-lg flex items-center justify-center text-white`}>
                          {getRoleIcon(role)}
                        </div>
                        <div>
                          <div className="text-white font-semibold capitalize">{role}</div>
                          <div className="text-xs text-indigo-200/70">
                            {role === 'owner' && 'Full access to everything'}
                            {role === 'admin' && 'Manage team and websites'}
                            {role === 'editor' && 'Create and edit content'}
                            {role === 'viewer' && 'View-only access'}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {role === 'owner' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>All Permissions</span>
                            </div>
                          </>
                        )}
                        {role === 'admin' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>Manage Websites</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>Manage Analytics</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>Manage Team</span>
                            </div>
                          </>
                        )}
                        {role === 'editor' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>Create Websites</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>Edit Content</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>View Analytics</span>
                            </div>
                          </>
                        )}
                        {role === 'viewer' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>View Websites</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span>View Analytics</span>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Invite Member Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowInviteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 border border-indigo-500/30 rounded-xl p-6 w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                    Invite Team Member
                  </h2>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-indigo-200 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Email Address</label>
                    <Input 
                      placeholder="colleague@example.com" 
                      className="bg-black/50 border-indigo-500/30 text-white placeholder:text-indigo-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Role</label>
                    <select className="w-full p-3 border border-indigo-500/30 rounded-lg bg-black/50 text-white h-12">
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  
                  <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                      What happens next?
                    </h3>
                    <ul className="space-y-2 text-sm text-indigo-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>An invitation email will be sent</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>They'll create an account or sign in</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Access granted based on selected role</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowInviteModal(false)
                      setSuccess('Invitation sent successfully!')
                    }}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


        {/* Team Performance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Team Performance</span>
              </CardTitle>
              <CardDescription className="text-indigo-200/60">Track your team's productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-indigo-200/70">Completion Rate</span>
                    <ArrowUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">94%</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-200/70">Avg Response Time</span>
                    <ArrowDown className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">2.3h</div>
                  <div className="text-xs text-blue-200/70">15% faster than last month</div>
                </div>

                <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-indigo-200/70">Team Satisfaction</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-blue-200/60">Common team management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30 hover:border-blue-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-indigo-300 transition-colors">Add Member</div>
                      <div className="text-xs text-indigo-200/70">Invite new team member</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-indigo-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">New Project</div>
                      <div className="text-xs text-blue-200/70">Create a new project</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30 hover:border-blue-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-indigo-300 transition-colors">Schedule Meeting</div>
                      <div className="text-xs text-indigo-200/70">Plan team sync</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-indigo-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">Export Report</div>
                      <div className="text-xs text-blue-200/70">Download team data</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
