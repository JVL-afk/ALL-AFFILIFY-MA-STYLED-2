import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart2, 
  Settings, 
  Users, 
  Mail, 
  MessageSquare, 
  Code, 
  Layers, 
  GitBranch, 
  PieChart, 
  Zap, 
  Crown,
  FileText,
  Activity,
  Database,
  Server,
  UserPlus
} from 'lucide-react';

// Define the plan types
type PlanType = 'basic' | 'pro' | 'enterprise';

// Define the navigation item structure
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiredPlan: PlanType;
  isActive?: boolean;
}

// Define the props for the component
interface PlanAwareDashboardLayoutProps {
  children: React.ReactNode;
}

export default function PlanAwareDashboardLayout({ children }: PlanAwareDashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userPlan, setUserPlan] = useState<PlanType>('basic');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user plan from API or localStorage
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        // Try to get the token from localStorage or cookies
        const token = localStorage.getItem('token') || 
                      document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] ||
                      document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
        
        if (!token) {
          // If no token, redirect to login
          router.push('/login');
          return;
        }
        
        // Fetch user data from API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserPlan(userData.plan || 'basic');
        } else {
          // If API call fails, try to get plan from localStorage
          const storedPlan = localStorage.getItem('userPlan');
          if (storedPlan && ['basic', 'pro', 'enterprise'].includes(storedPlan)) {
            setUserPlan(storedPlan as PlanType);
          }
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
        // Fallback to basic plan if there's an error
        setUserPlan('basic');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPlan();
  }, [router]);

  // Define navigation items with plan requirements
  const navigationItems: NavItem[] = [
    // Basic plan features
    { name: 'Dashboard', href: '/dashboard', icon: Home, requiredPlan: 'basic' },
    { name: 'My Websites', href: '/dashboard/my-websites', icon: Layers, requiredPlan: 'basic' },
    { name: 'Create Website', href: `/dashboard/create-website/${userPlan}`, icon: Zap, requiredPlan: 'basic' },
    { name: 'Analyze Website', href: '/dashboard/analyze-website', icon: Activity, requiredPlan: 'basic' },
    
    // Pro plan features
    { name: 'Advanced Analytics', href: '/dashboard/advanced-analytics', icon: BarChart2, requiredPlan: 'pro' },
    { name: 'Email Marketing', href: '/dashboard/email-marketing', icon: Mail, requiredPlan: 'pro' },
    { name: 'AI Chatbot', href: '/dashboard/ai-chatbot', icon: MessageSquare, requiredPlan: 'pro' },
    { name: 'Custom Integrations', href: '/dashboard/custom-integrations', icon: GitBranch, requiredPlan: 'pro' },
    
    // Enterprise plan features
    { name: 'Advanced Reporting', href: '/dashboard/advanced-reporting', icon: PieChart, requiredPlan: 'enterprise' },
    { name: 'A/B Testing', href: '/dashboard/ab-testing', icon: GitBranch, requiredPlan: 'enterprise' },
    { name: 'Reviews', href: '/dashboard/reviews', icon: FileText, requiredPlan: 'enterprise' },
    { name: 'API Management', href: '/dashboard/api-management', icon: Code, requiredPlan: 'enterprise' },
    { name: 'Team Collaboration', href: '/dashboard/team-collaboration', icon: Users, requiredPlan: 'enterprise' },
    
    // Settings is available for all plans
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, requiredPlan: 'basic' },
  ];

  // Define plan hierarchy for comparison
  const planHierarchy = {
    'basic': 1,
    'pro': 2,
    'enterprise': 3
  };

  // Filter navigation items based on user's plan
  const filteredNavItems = navigationItems.map(item => ({
    ...item,
    isActive: pathname === item.href,
    isAccessible: planHierarchy[userPlan] >= planHierarchy[item.requiredPlan]
  }));

  // Get the next plan for upgrade suggestions
  const getNextPlan = (currentPlan: PlanType): PlanType | null => {
    if (currentPlan === 'basic') return 'pro';
    if (currentPlan === 'pro') return 'enterprise';
    return null;
  };

  const nextPlan = getNextPlan(userPlan);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <Link href="/dashboard" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mr-2">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AFFILIFY</span>
              </Link>
            </div>
            
            {/* Plan badge */}
            <div className="mb-6">
              <div className={`
                py-1.5 px-3 rounded-full text-sm font-medium text-center
                ${userPlan === 'basic' ? 'bg-blue-600/20 text-blue-300' : 
                  userPlan === 'pro' ? 'bg-purple-600/20 text-purple-300' : 
                  'bg-orange-600/20 text-orange-300'}
              `}>
                {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <div key={item.name} className="relative">
                  <Link
                    href={item.isAccessible ? item.href : `/pricing?upgrade=${item.requiredPlan}&from=${userPlan}`}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      ${item.isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                      ${!item.isAccessible ? 'opacity-50' : ''}
                      transition-colors
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                    
                    {/* Show upgrade icon for inaccessible features */}
                    {!item.isAccessible && (
                      <Crown className="w-4 h-4 ml-auto text-yellow-400" />
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          
          {/* Upgrade prompt */}
          {nextPlan && (
            <div className="p-4 mt-4">
              <Link
                href={`/pricing?plan=${nextPlan}`}
                className="block p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white text-center"
              >
                <div className="flex items-center justify-center mb-1">
                  <Crown className="w-5 h-5 mr-2" />
                  <span className="font-medium">Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}</span>
                </div>
                <p className="text-xs text-white/80">
                  {nextPlan === 'pro' ? 'Get advanced analytics & more' : 'Unlock all premium features'}
                </p>
              </Link>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
