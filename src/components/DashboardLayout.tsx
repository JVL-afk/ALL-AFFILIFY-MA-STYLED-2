'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Zap,
  LayoutDashboard,
  Plus,
  Globe,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Crown,
  Sparkles,
  Bot,
  Mail,
  Key,
  Plug,
  FileText,
  TestTube,
  Star
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  websitesCreated: number
  websiteLimit: number
  analysesUsed: number
  analysisLimit: number
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Redirect to login if not authenticated
        router.push('/login')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Create Website',
      href: '/dashboard/create-website',
      icon: Plus,
      current: pathname === '/dashboard/create-website'
    },
    {
      name: 'My Websites',
      href: '/dashboard/my-websites',
      icon: Globe,
      current: pathname === '/dashboard/my-websites'
    },
    {
      name: 'Analyze Website',
      href: '/dashboard/analyze-website',
      icon: BarChart3,
      current: pathname === '/dashboard/analyze-website'
    },
    {
      name: 'A/B Testing',
      href: '/dashboard/ab-testing',
      icon: TestTube,
      current: pathname === '/dashboard/ab-testing',
      enterprise: true
    },
    {
      name: 'Reviews',
      href: '/dashboard/reviews',
      icon: Star,
      current: pathname === '/dashboard/reviews',
      enterprise: true
    }
  ]

  const enterpriseNavigation = [
    {
      name: 'Advanced Analytics',
      href: '/dashboard/advanced-analytics',
      icon: BarChart3,
      current: pathname === '/dashboard/advanced-analytics'
    },
    {
      name: 'AI Chatbot',
      href: '/dashboard/ai-chatbot',
      icon: Bot,
      current: pathname === '/dashboard/ai-chatbot'
    },
    {
      name: 'Email Marketing',
      href: '/dashboard/email-marketing',
      icon: Mail,
      current: pathname === '/dashboard/email-marketing'
    },
    {
      name: 'Team Collaboration',
      href: '/dashboard/team-collaboration',
      icon: Users,
      current: pathname === '/dashboard/team-collaboration'
    },
    {
      name: 'API Management',
      href: '/dashboard/api-management',
      icon: Key,
      current: pathname === '/dashboard/api-management'
    },
    {
      name: 'Custom Integrations',
      href: '/dashboard/custom-integrations',
      icon: Plug,
      current: pathname === '/dashboard/custom-integrations'
    },
    {
      name: 'Advanced Reporting',
      href: '/dashboard/advanced-reporting',
      icon: FileText,
      current: pathname === '/dashboard/advanced-reporting'
    }
  ]

  const secondaryNavigation = [
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard
    },
    {
      name: 'Help',
      href: '/dashboard/help',
      icon: HelpCircle
    }
  ]

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-gray-100 text-gray-800'
      case 'pro':
        return 'bg-purple-100 text-purple-800'
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="w-3 h-3" />
      case 'enterprise':
        return <Sparkles className="w-3 h-3" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AFFILIFY
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.enterprise && user.plan !== 'enterprise' && (
                  <Crown className="ml-auto h-4 w-4 text-orange-500" />
                )}
              </Link>
            ))}
            
            {/* Enterprise Features */}
            {user.plan === 'enterprise' && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Enterprise Features
                </div>
                {enterpriseNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="pt-6 mt-6 border-t border-gray-200">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                  {getPlanIcon(user.plan)}
                  <span>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AFFILIFY
              </span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.enterprise && user.plan !== 'enterprise' && (
                  <Crown className="ml-auto h-4 w-4 text-orange-500" />
                )}
              </Link>
            ))}
            
            {/* Enterprise Features */}
            {user.plan === 'enterprise' && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Enterprise Features
                </div>
                {enterpriseNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="pt-6 mt-6 border-t border-gray-200">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                  {getPlanIcon(user.plan)}
                  <span>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-4 lg:px-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Usage indicators */}
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{user.websitesCreated}/{user.websiteLimit === -1 ? '∞' : user.websiteLimit}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{user.analysesUsed}/{user.analysisLimit === -1 ? '∞' : user.analysisLimit}</span>
                </div>
              </div>
              
              {user.plan === 'basic' && (
                <Link href="/pricing">
                  <Button size="sm" variant="gradient">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

